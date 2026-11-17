import { NextRequest, NextResponse } from "next/server";
import {
  getLinksByProfileId,
  addLinkItem,
  updateLinkItem,
  deleteLinkItem,
} from "@/lib/serverStore";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profile_id") || undefined;
  const links = getLinksByProfileId(profileId);
  return NextResponse.json({
    success: true,
    data: links,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newLink = addLinkItem(body);
    return NextResponse.json({
      success: true,
      message: "Link created in backend",
      data: newLink,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Link ID is required for update" },
        { status: 400 }
      );
    }
    const updated = updateLinkItem(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Link updated in backend",
      data: updated,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Link ID is required" },
        { status: 400 }
      );
    }
    const deleted = deleteLinkItem(id);
    return NextResponse.json({
      success: true,
      message: deleted ? `Link ${id} deleted` : `Link ${id} not found`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
