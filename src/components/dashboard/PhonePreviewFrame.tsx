"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, LinkItem, SocialAccount } from "@/types";
import { PublicProfileView } from "@/components/profile/PublicProfileView";
import { useApp } from "@/context/AppContext";
import { ExternalLink, Smartphone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PhonePreviewFrameProps {
  user: UserProfile;
  links: LinkItem[];
  socials: SocialAccount[];
  className?: string;
}

export function PhonePreviewFrame({
  user,
  links,
  socials,
  className = "",
}: PhonePreviewFrameProps) {
  const { t } = useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const accentColor = user.theme_config.accent_color || "#10b981";

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between w-[320px] sm:w-[340px] mb-3 px-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t("preview_title")}</span>
        </div>
        <Link
          href={`/${user.username}`}
          target="_blank"
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <span>{t("preview_open_full")}</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Futuristic Phone Chassis */}
      <div
        className="relative w-[320px] sm:w-[340px] h-[660px] rounded-[48px] p-3.5 bg-[#0a0d16] border-[4px] border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-all duration-300"
        style={{
          boxShadow: `0 0 35px ${accentColor}18, 0 20px 60px rgba(0,0,0,0.9)`,
        }}
      >
        {/* Side physical buttons (mocked for realism) */}
        <div className="absolute -left-[7px] top-24 w-[3px] h-8 bg-slate-700 rounded-l-md" />
        <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-slate-700 rounded-l-md" />
        <div className="absolute -right-[7px] top-28 w-[3px] h-14 bg-slate-700 rounded-r-md" />

        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
        </div>

        {/* Screen inner container */}
        <div
          className={cn(
            "w-full h-full rounded-[38px] overflow-hidden overflow-y-auto no-scrollbar relative transition-colors duration-300",
            user.theme_config.mode === "light" ? "bg-white" : "bg-[#07090e]"
          )}
        >
          {isMounted ? (
            <PublicProfileView
              user={user}
              links={links}
              socials={socials}
              isMockClick={true}
              isInsidePreview={true}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-4 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-slate-800" />
              <div className="w-32 h-4 rounded-full bg-slate-800" />
              <div className="w-48 h-3 rounded-full bg-slate-800/60" />
              <div className="w-full space-y-2 pt-6">
                <div className="w-full h-11 rounded-xl bg-slate-800/70" />
                <div className="w-full h-11 rounded-xl bg-slate-800/70" />
                <div className="w-full h-11 rounded-xl bg-slate-800/70" />
              </div>
            </div>
          )}
        </div>

        {/* Home indicator bar at bottom */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full pointer-events-none z-30" />
      </div>
    </div>
  );
}
