import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, continue
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    return supabaseResponse;
  }

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

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // Check if user is authenticated via cookie
  const isAuth = request.cookies.get("app_auth")?.value === "true";

  if (isDashboardRoute && !user && !isAuth) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && (user || isAuth) && !request.nextUrl.pathname.includes("reset-password")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
