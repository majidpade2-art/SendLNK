"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SocialAccount, SocialPlatform } from "@/types";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformConfig {
  platform: SocialPlatform;
  label: string;
  placeholder: string;
  prefix?: string;
}

const PLATFORMS: PlatformConfig[] = [
  { platform: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { platform: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username" },
  { platform: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
  { platform: "twitter", label: "X (Twitter)", placeholder: "https://x.com/username" },
  { platform: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { platform: "discord", label: "Discord Server / Invite", placeholder: "https://discord.gg/..." },
  { platform: "whatsapp", label: "WhatsApp Direct", placeholder: "https://wa.me/123456789" },
  { platform: "telegram", label: "Telegram Channel / User", placeholder: "https://t.me/username" },
  { platform: "spotify", label: "Spotify Artist / Playlist", placeholder: "https://open.spotify.com/..." },
  { platform: "linkedin", label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/username" },
  { platform: "twitch", label: "Twitch Stream", placeholder: "https://twitch.tv/username" },
  { platform: "facebook", label: "Facebook Page", placeholder: "https://facebook.com/username" },
  { platform: "email", label: "Contact Email", placeholder: "mailto:your@email.com" },
];

export function SocialsTab() {
  const { user, socials, updateSocials, uiTheme, t } = useApp();
  const isLight = uiTheme === "light";
  const [localSocials, setLocalSocials] = useState<SocialAccount[]>(socials);
  const [isSaved, setIsSaved] = useState(false);

  // Keep localSocials in sync when global socials state changes
  React.useEffect(() => {
    setLocalSocials(socials);
  }, [socials]);

  // Helper to find or get existing social
  const getSocialValue = (platform: SocialPlatform): { url: string; is_active: boolean } => {
    const found = localSocials.find((s) => s.platform === platform);
    return {
      url: found?.url || "",
      is_active: found?.is_active ?? false,
    };
  };

  const handleUrlChange = (platform: SocialPlatform, url: string) => {
    setLocalSocials((prev) => {
      const existing = prev.find((s) => s.platform === platform);
      if (existing) {
        return prev.map((s) =>
          s.platform === platform
            ? { ...s, url, is_active: url.trim() !== "" ? s.is_active : false }
            : s
        );
      } else {
        return [
          ...prev,
          {
            id: `soc_${Date.now()}_${platform}`,
            profile_id: user.id,
            platform,
            url,
            is_active: true,
            display_order: prev.length + 1,
          },
        ];
      }
    });
  };

  const handleToggleActive = (platform: SocialPlatform, is_active: boolean) => {
    let updated: SocialAccount[];
    const existing = localSocials.find((s) => s.platform === platform);
    if (existing) {
      updated = localSocials.map((s) =>
        s.platform === platform ? { ...s, is_active } : s
      );
    } else {
      updated = [
        ...localSocials,
        {
          id: `soc_${Date.now()}_${platform}`,
          profile_id: user.id,
          platform,
          url: "",
          is_active,
          display_order: localSocials.length + 1,
        },
      ];
    }
    setLocalSocials(updated);
    // Immediately persist and sync so live preview and public profile reflect the toggle instantly
    updateSocials(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocials(localSocials);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className={cn(
              "text-lg font-bold flex items-center gap-2 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            <span>{t("socials_title")}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("socials_desc")}
          </p>
        </div>

        <Button variant="neon" size="md" type="submit" className="gap-2 shrink-0">
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-[#07090e]" />
              {t("socials_saved")}
            </>
          ) : (
            t("socials_btn_save")
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {PLATFORMS.map((item) => {
          const { url, is_active } = getSocialValue(item.platform);

          return (
            <div
              key={item.platform}
              className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                isLight
                  ? "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm"
                  : "bg-[#0a0e1a] border-slate-800/80 hover:border-slate-700"
              )}
            >
              <div className="min-w-[140px]">
                <span
                  className={cn(
                    "font-semibold text-sm transition-colors",
                    isLight ? "text-slate-900" : "text-slate-200"
                  )}
                >
                  {item.label}
                </span>
                <span className="block text-[11px] text-slate-500 font-mono">
                  {item.platform}
                </span>
              </div>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder={item.placeholder}
                  value={url}
                  onChange={(e) => handleUrlChange(item.platform, e.target.value)}
                  onBlur={() => updateSocials(localSocials)}
                  className={cn(
                    "w-full border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 transition-all font-mono",
                    isLight
                      ? "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                      : "bg-[#0b101c] border-slate-800 text-slate-200 placeholder-slate-600 focus:border-emerald-500/60 focus:ring-emerald-500/20"
                  )}
                />
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span
                  className={cn(
                    "text-[11px] transition-colors",
                    isLight ? "text-slate-600" : "text-slate-400"
                  )}
                >
                  {is_active ? t("socials_visible") : t("socials_hidden")}
                </span>
                <Switch
                  checked={is_active}
                  onCheckedChange={(val) => handleToggleActive(item.platform, val)}
                  disabled={url.trim() === ""}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end pt-4">
        <Button variant="neon" size="md" type="submit">
          {t("socials_btn_save")}
        </Button>
      </div>
    </form>
  );
}
