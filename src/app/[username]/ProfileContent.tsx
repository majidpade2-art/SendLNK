"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { PublicProfileView } from "@/components/profile/PublicProfileView";
import { UserProfile, LinkItem, SocialAccount } from "@/types";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface ProfileContentProps {
  username: string;
  serverProfile?: UserProfile | null;
  serverLinks?: LinkItem[];
  serverSocials?: SocialAccount[];
}

export default function ProfileContent({
  username,
  serverProfile,
  serverLinks,
  serverSocials,
}: ProfileContentProps) {
  const {
    user: clientUser,
    links: clientLinks,
    socials: clientSocials,
    recordProfileView,
    recordLinkClick,
    isLoading,
  } = useApp();

  const [isMounted, setIsMounted] = React.useState(false);

  // Record profile view once on mount
  useEffect(() => {
    setIsMounted(true);
    recordProfileView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decodedUsername = decodeURIComponent(username).toLowerCase().trim();
  const isClientMatch = isMounted && clientUser.username.toLowerCase().trim() === decodedUsername;

  // Determine active profile to display:
  // Prefer clientUser if currently logged-in user is previewing/editing their own profile;
  // otherwise, use serverProfile loaded directly from backend store.
  const activeProfile = isClientMatch ? clientUser : (serverProfile || null);
  const activeLinks = isClientMatch ? clientLinks : (serverLinks || []);
  const activeSocials = isClientMatch ? clientSocials : (serverSocials || []);

  if (isLoading && !serverProfile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0f19] text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-slate-400">
            CONNECTING TO SENDLINK...
          </span>
        </div>
      </div>
    );
  }

  if (!activeProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0b0f19] text-slate-100 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-slate-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Profile Not Found
        </h1>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          The handle <strong className="text-emerald-400">@{username}</strong>{" "}
          is available! Claim it today on Sendlink.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/register"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition-all"
          >
            Claim @{username}
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <PublicProfileView
        user={activeProfile}
        links={activeLinks}
        socials={activeSocials}
        onLinkClick={recordLinkClick}
      />
    </div>
  );
}
