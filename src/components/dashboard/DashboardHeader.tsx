"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ShareModal } from "@/components/profile/ShareModal";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Menu,
  ExternalLink,
  Share2,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  onToggleMobileSidebar: () => void;
  onToggleMobilePreview: () => void;
  title: string;
  subtitle?: string;
}

export function DashboardHeader({
  onToggleMobileSidebar,
  onToggleMobilePreview,
  title,
  subtitle,
}: DashboardHeaderProps) {
  const { user, uiTheme, t } = useApp();
  const isLight = uiTheme === "light";
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "h-16 px-2.5 sm:px-6 flex items-center justify-between backdrop-blur-md border-b sticky top-0 z-30 transition-colors w-full max-w-full overflow-hidden",
          isLight
            ? "bg-white/85 border-slate-200/90 text-slate-900 shadow-xs"
            : "bg-[#0b0f19]/80 border-slate-800/80 text-slate-100"
        )}
      >
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className={cn(
              "p-1.5 sm:p-2 rounded-xl transition-colors md:hidden cursor-pointer shrink-0",
              isLight
                ? "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1
              className={cn(
                "text-sm sm:text-lg font-bold flex items-center gap-2 transition-colors truncate max-w-[110px] xs:max-w-[160px] sm:max-w-none",
                isLight ? "text-slate-900" : "text-slate-100"
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-400 hidden sm:block truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right header actions */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle variant="pill" />

          {/* Multi-language Selector */}
          <LanguageSelector variant="compact" />

          {/* Toggle Live Phone Preview button for mobile/tablets */}
          <button
            onClick={onToggleMobilePreview}
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium xl:hidden transition-all cursor-pointer",
              isLight
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-500"
                : "bg-slate-900 border-slate-700/80 text-slate-200 hover:border-emerald-500/50"
            )}
            title="Toggle Live Phone Mockup"
          >
            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="hidden md:inline">{t("nav_preview")}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer",
              isLight
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-500"
                : "bg-slate-900 border-slate-700/80 text-slate-200 hover:border-emerald-500/50"
            )}
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{t("nav_share")}</span>
          </button>

          {/* Live profile link */}
          <Link
            href={`/${user.username}`}
            target="_blank"
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all cursor-pointer shrink-0"
            title={t("nav_live_site")}
          >
            <span className="hidden sm:inline">{t("nav_live_site")}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        username={user.username}
        displayName={user.display_name}
      />
    </>
  );
}
