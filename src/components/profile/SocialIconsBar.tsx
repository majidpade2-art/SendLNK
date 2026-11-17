"use client";

import React from "react";
import { SocialAccount, SocialPlatform } from "@/types";
import { Mail, Send } from "lucide-react";
import {
  InstagramIcon,
  YouTubeIcon,
  XTwitterIcon,
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
  TikTokIcon,
  WhatsAppIcon,
  DiscordIcon,
  SpotifyIcon,
  TwitchIcon,
  TelegramIcon,
} from "@/components/ui/SocialBrandIcons";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SocialIconsBarProps {
  socials: SocialAccount[];
  accentColor?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  isLight?: boolean;
}

export function SocialIconsBar({
  socials,
  accentColor = "#10b981",
  className = "",
  size = "md",
  isLight = false,
}: SocialIconsBarProps) {
  const activeSocials = socials.filter((s) => s.is_active && s.url.trim() !== "");

  if (activeSocials.length === 0) return null;

  const sizeClasses = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2.5",
    lg: "w-12 h-12 p-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const renderIcon = (platform: SocialPlatform, iconClass: string) => {
    switch (platform) {
      case "instagram":
        return <InstagramIcon className={iconClass} />;
      case "tiktok":
        return <TikTokIcon className={iconClass} />;
      case "youtube":
        return <YouTubeIcon className={iconClass} />;
      case "facebook":
        return <FacebookIcon className={iconClass} />;
      case "twitter":
        return <XTwitterIcon className={iconClass} />;
      case "discord":
        return <DiscordIcon className={iconClass} />;
      case "whatsapp":
        return <WhatsAppIcon className={iconClass} />;
      case "telegram":
        return <TelegramIcon className={iconClass} />;
      case "github":
        return <GitHubIcon className={iconClass} />;
      case "twitch":
        return <TwitchIcon className={iconClass} />;
      case "spotify":
        return <SpotifyIcon className={iconClass} />;
      case "linkedin":
        return <LinkedInIcon className={iconClass} />;
      case "email":
        return <Mail className={iconClass} />;
      default:
        return <Send className={iconClass} />;
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2.5 my-3 ${className}`}
    >
      {activeSocials.map((item) => (
        <motion.a
          key={item.id}
          href={
            item.url.startsWith("mailto:") || item.url.startsWith("http")
              ? item.url
              : `https://${item.url}`
          }
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative group rounded-full flex items-center justify-center transition-all duration-300",
            sizeClasses[size],
            isLight
              ? "bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-xs"
              : "bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          )}
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-opacity blur-sm pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />
          <span className="relative z-10">
            {renderIcon(item.platform, iconSizes[size])}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
