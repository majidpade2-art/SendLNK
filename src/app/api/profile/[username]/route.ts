import { NextRequest, NextResponse } from "next/server";
import {
  getProfileByUsername,
  getLinksByProfileId,
  getSocialsByProfileId,
} from "@/lib/serverStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).toLowerCase().trim();

  const profile = getProfileByUsername(decodedUsername);

  if (profile) {
    const links = getLinksByProfileId(profile.id).filter((l) => l.is_active);
    const socials = getSocialsByProfileId(profile.id).filter((s) => s.is_active);

    return NextResponse.json({
      success: true,
      profile,
      links,
      socials,
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: `Profile @${decodedUsername} not found.`,
    },
    { status: 404 }
  );
}
