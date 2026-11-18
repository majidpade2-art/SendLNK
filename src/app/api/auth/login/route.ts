import { NextResponse } from "next/server";
import { verifyServerCredentials } from "@/lib/serverStore";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if real Supabase credentials are configured
    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder");

    let supabaseUser: { id: string; email?: string } | null = null;

    if (hasSupabase) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (!error && data.user) {
          supabaseUser = { id: data.user.id, email: data.user.email };
        }
      } catch (err) {
        console.warn("Supabase login fallback to serverStore:", err);
      }
    }

    // Verify against server store
    const verifyResult = verifyServerCredentials(cleanEmail, password);

    if (!verifyResult.success && !supabaseUser) {
      return NextResponse.json(
        { success: false, message: verifyResult.message },
        { status: 401 }
      );
    }

    const account = verifyResult.account || {
      email: cleanEmail,
      username: cleanEmail.split("@")[0],
      displayName: cleanEmail.split("@")[0],
    };

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil!",
      account: {
        email: account.email,
        username: account.username,
        displayName: account.displayName,
      },
    });

    // Set authentication cookies
    response.cookies.set("app_auth", "true", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
