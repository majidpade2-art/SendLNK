"use client";

import React, { useState } from "react";
import { UserProfile, LinkItem, SocialAccount } from "@/types";
import { PRESET_THEMES } from "@/lib/constants/themes";
import { useApp } from "@/context/AppContext";
import { LinkCard } from "./LinkCard";
import { SocialIconsBar } from "./SocialIconsBar";
import { ShareModal } from "./ShareModal";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import {
  BadgeCheck,
  Share2,
  Eye,
  Search,
  Sparkles,
} from "lucide-react";
import { formatNumber, cn } from "@/lib/utils";
import Link from "next/link";

interface PublicProfileViewProps {
  user: UserProfile;
  links: LinkItem[];
  socials: SocialAccount[];
  onLinkClick?: (linkId: string) => void;
  isMockClick?: boolean;
  isInsidePreview?: boolean;
}

export function PublicProfileView({
  user,
  links,
  socials,
  onLinkClick,
  isMockClick = false,
  isInsidePreview = false,
}: PublicProfileViewProps) {
  const { t } = useApp();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const theme = user.theme_config;
  const accentColor = theme.accent_color || "#10b981";
  const isThemeLight =
    theme.mode === "light" ||
    (theme.theme_id ? PRESET_THEMES[theme.theme_id]?.mode === "light" : false) ||
    (typeof theme.background_value === "string" &&
      (theme.background_value.includes("#fff") ||
        theme.background_value.includes("#faf") ||
        theme.background_value.includes("#f8") ||
        theme.background_value.includes("#f0") ||
        theme.background_value.includes("#e0") ||
        theme.background_value.includes("255, 255, 255")));

  // Filter links by active, schedule, category, and search query
  const now = new Date().getTime();
  const visibleLinks = links.filter((link) => {
    if (!link.is_active) return false;

    // Check schedule visibility if set
    if (link.scheduled_start) {
      const start = new Date(link.scheduled_start).getTime();
      if (now < start) return false;
    }
    if (link.scheduled_end) {
      const end = new Date(link.scheduled_end).getTime();
      if (now > end) return false;
    }

    // Category filter
    if (selectedCategory !== "All" && link.category !== selectedCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = link.title.toLowerCase().includes(q);
      const matchDesc = link.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  // Extract unique categories
  const categories = [
    "All",
    ...Array.from(
      new Set(
        links
          .map((l) => l.category?.trim())
          .filter((c): c is string => Boolean(c) && c !== "")
      )
    ),
  ];

  // Dynamic Background Style (resilient to gradients and missing types)
  const getContainerBackgroundStyle = (): React.CSSProperties => {
    const val = theme.background_value;
    if (!val) {
      return { backgroundColor: isThemeLight ? "#ffffff" : "#07090e" };
    }

    if (val.startsWith("url(") || theme.background_type === "image") {
      return {
        backgroundImage: val.startsWith("url(") ? val : `url(${val})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    if (
      val.includes("gradient") ||
      theme.background_type === "gradient" ||
      theme.background_type === "mesh" ||
      theme.background_type === "radial"
    ) {
      return { background: val };
    }

    return { backgroundColor: val };
  };

  // Font family mapping
  const activeFont = user.font_family || theme?.font_family || "Space Grotesk";
  const getFontFamilyCss = (fontName?: string) => {
    switch (fontName) {
      case "Outfit":
        return "var(--font-outfit), sans-serif";
      case "Plus Jakarta Sans":
        return "var(--font-plus-jakarta-sans), sans-serif";
      case "Inter":
        return "var(--font-inter), sans-serif";
      case "JetBrains Mono":
        return "var(--font-jetbrains-mono), monospace";
      case "Space Grotesk":
      default:
        return "var(--font-space-grotesk), sans-serif";
    }
  };

  const fontStyle = {
    fontFamily: getFontFamilyCss(activeFont),
  };

  return (
    <div
      data-profile-theme={isThemeLight ? "light" : "dark"}
      style={{
        ...getContainerBackgroundStyle(),
        ...fontStyle,
        ["--profile-accent" as string]: accentColor,
      }}
      className={`min-h-full w-full flex flex-col items-center justify-between text-slate-100 transition-colors duration-500 relative ${
        isInsidePreview ? "p-4 sm:p-5" : "min-h-screen py-10 px-4 sm:px-6"
      }`}
    >
      {/* Background cyber grid overlay */}
      <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-40" />

      {/* Floating Action Buttons (Top Bar) */}
      <div className="w-full max-w-xl flex items-center justify-between z-10 mb-4 px-2">
        <div className="flex items-center gap-2">
          {/* Views badge */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors backdrop-blur-md shadow-xs",
              isThemeLight
                ? "bg-white/80 border border-slate-200 text-slate-700"
                : "bg-black/40 border border-white/10 text-slate-300"
            )}
          >
            <Eye className="w-3.5 h-3.5 text-[var(--profile-accent)]" />
            <span>
              {formatNumber(user.views_count)} {t("overview_views")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Multi-language Selector */}
          <LanguageSelector
            variant="compact"
            className={
              isThemeLight
                ? "bg-white/80 border-slate-200 text-slate-700 hover:bg-white"
                : "bg-black/40 border-white/10 text-slate-300 hover:bg-white/10"
            }
          />

          {/* Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 backdrop-blur-md shadow-xs",
              isThemeLight
                ? "bg-white/80 border border-slate-200 text-slate-700 hover:border-[var(--profile-accent)] hover:text-[var(--profile-accent)] hover:bg-white"
                : "bg-black/40 border border-white/10 text-slate-300 hover:border-[var(--profile-accent)] hover:text-[var(--profile-accent)] hover:bg-white/10"
            )}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="w-full max-w-xl flex flex-col items-center text-center z-10">
        {/* Avatar with status indicator */}
        <div className="relative mb-4 group">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 border-2 transition-transform duration-300 group-hover:scale-105"
            style={{
              borderColor: accentColor,
              boxShadow: `0 0 25px ${accentColor}40`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url || "/avatar.png"}
              alt={user.display_name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/avatar.png";
              }}
              className="w-full h-full rounded-full object-cover bg-black/40"
            />
          </div>

          {/* Online Indicator Dot */}
          {user.is_online && (
            <span
              className="absolute bottom-1 right-2 w-4 h-4 rounded-full border-2 border-[#0b0f19] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              title="Online now"
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </span>
          )}
        </div>

        {/* Display Name & Verified Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <h1
            className={cn(
              "text-xl sm:text-2xl font-bold tracking-tight",
              isThemeLight ? "text-slate-900" : "text-white"
            )}
          >
            {user.display_name}
          </h1>
          {user.verified && (
            <BadgeCheck
              className="w-5 h-5 shrink-0"
              style={{ color: accentColor }}
            />
          )}
        </div>

        {/* Handle */}
        <p
          className={cn(
            "text-xs sm:text-sm font-medium font-mono mb-3",
            isThemeLight ? "text-slate-600" : "text-slate-400"
          )}
        >
          @{user.username}
        </p>

        {/* Bio */}
        {user.bio && (
          <p
            className={cn(
              "text-xs sm:text-sm max-w-md leading-relaxed mb-4 px-2",
              isThemeLight ? "text-slate-700" : "text-slate-300"
            )}
          >
            {user.bio}
          </p>
        )}

        {/* Social Icons Bar */}
        <SocialIconsBar socials={socials} accentColor={accentColor} isLight={isThemeLight} />

        {/* Search Bar (if more than 3 links) */}
        {links.length > 3 && (
          <div className="w-full mt-4 mb-2 px-1">
            <div className="relative">
              <Search
                className={cn(
                  "absolute left-3 top-2.5 w-4 h-4",
                  isThemeLight ? "text-slate-400" : "text-slate-500"
                )}
              />
              <input
                type="text"
                placeholder={t("public_search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[var(--profile-accent)] transition-all",
                  isThemeLight
                    ? "bg-white/80 border border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm focus:border-[var(--profile-accent)]"
                    : "bg-black/30 backdrop-blur-md border border-white/10 text-slate-200 placeholder-slate-500 focus:border-[var(--profile-accent)]"
                )}
              />
            </div>
          </div>
        )}

        {/* Category Pills (if categories exist) */}
        {categories.length > 2 && (
          <div
            suppressHydrationWarning
            className="w-full flex items-center justify-center gap-1.5 overflow-x-auto py-2 px-1 mb-2 no-scrollbar"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                suppressHydrationWarning
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-white text-[#07090e] font-semibold shadow-md"
                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
                style={
                  selectedCategory === cat
                    ? { backgroundColor: accentColor, color: "#07090e" }
                    : {}
                }
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Links List Section */}
      <div className="w-full max-w-xl space-y-3 my-4 z-10">
        {visibleLinks.length > 0 ? (
          visibleLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              theme={theme}
              onLinkClick={onLinkClick}
              isMockClick={isMockClick}
            />
          ))
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white/[0.03] border border-white/10">
            <Sparkles className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">
              {t("public_no_links")}
            </p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      {!theme.hide_branding && (
        <footer className="w-full max-w-xl text-center py-6 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-400 hover:text-white hover:border-[var(--profile-accent)] transition-all group"
          >
            <span>{t("public_powered_by")}</span>
            <span className="font-bold text-white tracking-wider flex items-center gap-1">
              SENDLINK
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--profile-accent)] inline-block group-hover:scale-125 transition-transform" />
            </span>
          </Link>
        </footer>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        username={user.username}
        displayName={user.display_name}
      />
    </div>
  );
}
