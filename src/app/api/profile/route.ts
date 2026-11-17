import { NextRequest, NextResponse } from "next/server";
import { getDefaultProfile, saveOrUpdateProfile } from "@/lib/serverStore";

export async function GET() {
  const profile = getDefaultProfile();
  return NextResponse.json({
    success: true,
    data: profile,
  });
}

export async function PUT(request: NextRequest) {
  try {
    const text = await request.text();
    let updates = {};
    if (text) {
      updates = JSON.parse(text);
    }
    const updated = saveOrUpdateProfile(updates);
    return NextResponse.json({
      success: true,
      message: "Profile synchronized with backend",
      data: updated,
    });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
