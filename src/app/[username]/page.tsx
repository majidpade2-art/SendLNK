import React, { Suspense } from "react";
import ProfileContent from "./ProfileContent";
import {
  getProfileByUsername,
  getLinksByProfileId,
  getSocialsByProfileId,
} from "@/lib/serverStore";

interface PageProps {
  params: Promise<{ username: string }>;
}

function ProfileLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0f19] text-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-slate-400">
          INITIALIZING MAJIDSPACE...
        </span>
      </div>
    </div>
  );
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).toLowerCase().trim();

  const profile = getProfileByUsername(decodedUsername);
  const links = profile
    ? getLinksByProfileId(profile.id).filter((l) => l.is_active)
    : [];
  const socials = profile
    ? getSocialsByProfileId(profile.id).filter((s) => s.is_active)
    : [];

  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent
        username={username}
        serverProfile={profile}
        serverLinks={links}
        serverSocials={socials}
      />
    </Suspense>
  );
}
