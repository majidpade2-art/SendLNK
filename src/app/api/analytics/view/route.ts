import { NextRequest, NextResponse } from "next/server";
import { incrementViewCount, getDefaultProfile } from "@/lib/serverStore";

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty or plain text
    }

    const defaultProfile = getDefaultProfile();
    const profile_id = (body.profile_id as string) || defaultProfile.id;
    const totalViews = incrementViewCount(profile_id);

    return NextResponse.json({
      success: true,
      message: "View recorded",
      total_views: totalViews,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
