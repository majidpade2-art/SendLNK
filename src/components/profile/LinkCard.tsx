"use client";

import React, { useState } from "react";
import { LinkItem, ThemeConfig } from "@/types";
import { PRESET_THEMES } from "@/lib/constants/themes";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  link: LinkItem;
  theme: ThemeConfig;
  onLinkClick?: (linkId: string) => void;
  isMockClick?: boolean;
}

export function LinkCard({
  link,
  theme,
  onLinkClick,
  isMockClick = false,
}: LinkCardProps) {
  const [imgError, setImgError] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onLinkClick) {
      onLinkClick(link.id);
    }
    if (isMockClick) {
      e.preventDefault();
    }
  };

  // Border radius map
  const radiusMap = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  };

  const currentRadius = radiusMap[theme.border_radius] || "rounded-xl";

  // Intelligent theme lightness detection with preset fallback
  const isLight =
    theme.mode === "light" ||
    (theme.theme_id ? PRESET_THEMES[theme.theme_id]?.mode === "light" : false) ||
    (typeof theme.background_value === "string" &&
      (theme.background_value.includes("#fff") ||
        theme.background_value.includes("#faf") ||
        theme.background_value.includes("#f8") ||
        theme.background_value.includes("#f0") ||
        theme.background_value.includes("#e0") ||
        theme.background_value.includes("255, 255, 255")));

  const getButtonStyle = () => {
    if (isLight) {
      switch (theme.button_style) {
        case "neon-glow":
          return link.is_highlighted
            ? "bg-white border-2 shadow-md hover:shadow-lg"
            : "bg-white/95 border border-slate-200 shadow-sm hover:border-[var(--theme-accent)] hover:shadow-md";
        case "glass":
          return "bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-white hover:border-slate-300 shadow-sm";
        case "solid-pill":
          return "bg-slate-100 border border-slate-200 hover:bg-slate-200 hover:border-slate-300";
        case "outline":
          return "bg-white/50 border border-slate-300 hover:border-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10";
        case "minimal":
          return "bg-white border border-slate-200 hover:border-slate-300 shadow-sm";
        default:
          return "bg-white/90 border border-slate-200 shadow-sm";
      }
    }

    switch (theme.button_style) {
      case "neon-glow":
        return link.is_highlighted
          ? "bg-[#0b1220]/80 border shadow-[0_0_20px_var(--theme-glow)] hover:shadow-[0_0_30px_var(--theme-glow)]"
          : "bg-[#0b101c]/70 border border-white/10 hover:border-[var(--theme-accent)] hover:shadow-[0_0_20px_var(--theme-glow)]";
      case "glass":
        return "bg-white/[0.06] backdrop-blur-md border border-white/10 hover:bg-white/[0.12] hover:border-white/20";
      case "solid-pill":
        return "bg-slate-900/90 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-500";
      case "outline":
        return "bg-transparent border border-white/20 hover:border-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10";
      case "minimal":
        return "bg-[#090d16] border border-slate-800/80 hover:border-slate-700";
      default:
        return "bg-white/[0.05] border border-white/10";
    }
  };

  const accentColor = theme.accent_color || "#10b981";

  return (
    <motion.a
      href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex items-center justify-between w-full p-4 transition-all duration-300 cursor-pointer overflow-hidden",
        currentRadius,
        getButtonStyle(),
        link.is_highlighted && "border-[var(--theme-accent)] ring-1 ring-[var(--theme-accent)]/50"
      )}
      style={
        {
          "--theme-accent": accentColor,
          "--theme-glow": `${accentColor}33`,
          borderColor: link.is_highlighted ? accentColor : undefined,
        } as React.CSSProperties
      }
    >
      {/* Highlighted pulse glow banner */}
      {link.is_highlighted && (
        <span
          className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
      )}

      {/* Left Icon or Thumbnail */}
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {link.thumbnail_url && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={link.thumbnail_url}
            alt=""
            onError={() => setImgError(true)}
            className={cn(
              "w-10 h-10 rounded-xl object-cover shrink-0 border",
              isLight ? "border-slate-200" : "border-white/10"
            )}
          />
        ) : (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300",
              link.is_highlighted
                ? "bg-[var(--theme-accent)]/20 text-[var(--theme-accent)]"
                : isLight
                  ? "bg-slate-100 text-slate-700 group-hover:text-[var(--theme-accent)] group-hover:bg-[var(--theme-accent)]/10"
                  : "bg-white/5 text-slate-300 group-hover:text-[var(--theme-accent)] group-hover:bg-[var(--theme-accent)]/10"
            )}
          >
            <IconRenderer name={link.icon || "Globe"} className="w-5 h-5" />
          </div>
        )}

        <div className="flex flex-col text-left min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "font-semibold text-sm sm:text-base truncate transition-colors",
                isLight
                  ? "text-slate-900 group-hover:text-black"
                  : "text-slate-100 group-hover:text-white"
              )}
              style={{
                color: isLight ? "#0f172a" : "#f8fafc",
              }}
            >
              {link.title}
            </span>
            {link.is_highlighted && (
              <span
                className="flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                <Sparkles className="w-3 h-3 mr-0.5 inline" />
                Featured
              </span>
            )}
          </div>
          {link.description && (
            <span
              className={cn(
                "text-xs truncate mt-0.5 transition-colors",
                isLight
                  ? "text-slate-600 group-hover:text-slate-800"
                  : "text-slate-400 group-hover:text-slate-300"
              )}
              style={{
                color: isLight ? "#475569" : "#cbd5e1",
              }}
            >
              {link.description}
            </span>
          )}
        </div>
      </div>

      {/* Right arrow / action */}
      <div className="shrink-0 flex items-center pl-2">
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
            isLight
              ? "text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100"
              : "text-slate-400 group-hover:text-white group-hover:bg-white/10"
          )}
          style={{
            color: isLight ? "#64748b" : "#94a3b8",
          }}
        >
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </motion.a>
  );
}
