import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Check if user is authenticated via cookie
  const isAuth = request.cookies.get("app_auth")?.value === "true";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let hasSupabaseUser = false;

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder")) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      hasSupabaseUser = Boolean(user);
    } catch {
      hasSupabaseUser = false;
    }
  }

  const isAuthenticated = hasSupabaseUser || isAuth;

  // Protect all dashboard routes: redirect to login if not authenticated
  if (isDashboardRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if already logged in and visiting auth pages
  if (
    isAuthRoute &&
    isAuthenticated &&
    !request.nextUrl.pathname.includes("reset-password") &&
    !request.nextUrl.pathname.includes("forgot-password")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
