import { NextResponse } from "next/server";
import { registerServerAccount } from "@/lib/serverStore";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, username, displayName } = body;

    if (!email || !password || !username) {
      return NextResponse.json(
        { success: false, message: "Email, username, dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Check if real Supabase credentials are configured
    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("placeholder");

    let supabaseAuthId: string | null = null;

    if (hasSupabase) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              username: username.trim().toLowerCase(),
              display_name: displayName || username,
            },
          },
        });
        if (error) {
          return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
          );
        }
        supabaseAuthId = data.user?.id || null;
      } catch (err: unknown) {
        console.warn("Supabase signup skipped / error:", err);
      }
    }

    // Register into central serverStore
    const regResult = registerServerAccount({
      email: email.trim().toLowerCase(),
      password,
      username: username.trim().toLowerCase(),
      displayName: displayName || username,
      createdAt: new Date().toISOString(),
    });

    if (!regResult.success) {
      return NextResponse.json(
        { success: false, message: regResult.message },
        { status: 409 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Selamat datang di SendLNK.",
      account: {
        email: regResult.account?.email,
        username: regResult.account?.username,
        displayName: regResult.account?.displayName,
        supabaseAuthId,
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
