import { NextRequest, NextResponse } from "next/server";
import { incrementLinkClick } from "@/lib/serverStore";

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty or plain text
    }

    const link_id = (body.link_id as string) || "link_1";
    const clicks = incrementLinkClick(link_id);

    return NextResponse.json({
      success: true,
      message: "Click recorded",
      link_clicks: clicks,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
