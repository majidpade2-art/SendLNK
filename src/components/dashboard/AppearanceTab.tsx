"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  PRESET_THEMES,
  AVAILABLE_FONTS,
  AVAILABLE_ACCENT_COLORS,
} from "@/lib/constants/themes";
import { ButtonStyle, BorderRadius } from "@/types";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Check, Sparkles, Palette, Sliders, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppearanceTab() {
  const { user, updateTheme, uiTheme, t } = useApp();
  const theme = user.theme_config;
  const isLight = uiTheme === "light";

  const [isSaved, setIsSaved] = useState(false);

  const activePreset = theme.theme_id || "cyberpunk";
  const accentColor = theme.accent_color || "#10b981";
  const buttonStyle = theme.button_style || "neon-glow";
  const borderRadius = theme.border_radius || "lg";
  const fontFamily = theme.font_family || user.font_family || "Space Grotesk";
  const hideBranding = Boolean(theme.hide_branding);

  const applyPreset = (presetKey: string) => {
    const p = PRESET_THEMES[presetKey];
    if (!p) return;

    // Apply live to context immediately so the live phone preview updates instantly!
    updateTheme({
      theme_id: p.theme_id,
      name: p.name,
      mode: p.mode,
      accent_color: p.accent_color,
      button_style: p.button_style,
      card_style: p.card_style,
      border_radius: p.border_radius,
      font_family: p.font_family,
      background_type: p.background_type,
      background_value: p.background_value,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const buttonStyleOptions: { id: ButtonStyle; label: string; desc: string }[] = [
    { id: "neon-glow", label: t("btn_style_neon_glow"), desc: t("btn_style_neon_glow_desc") },
    { id: "glass", label: t("btn_style_glass"), desc: t("btn_style_glass_desc") },
    { id: "solid-pill", label: t("btn_style_solid"), desc: t("btn_style_solid_desc") },
    { id: "outline", label: t("btn_style_outline"), desc: t("btn_style_outline_desc") },
    { id: "minimal", label: t("btn_style_minimal"), desc: t("btn_style_minimal_desc") },
  ];

  const radiusOptions: { id: BorderRadius; label: string }[] = [
    { id: "sm", label: t("radius_sharp") },
    { id: "md", label: t("radius_rounded") },
    { id: "lg", label: t("radius_curved") },
    { id: "full", label: t("radius_full") },
  ];

  const getColorName = (c: { name: string; hex: string }) => {
    switch (c.hex) {
      case "#10b981":
        return t("color_emerald");
      case "#06b6d4":
        return t("color_cyan");
      case "#14b8a6":
        return t("color_teal");
      case "#a78bfa":
        return t("color_lavender");
      case "#f59e0b":
        return t("color_amber");
      case "#f43f5e":
        return t("color_coral");
      case "#38bdf8":
        return t("color_sky");
      case "#e2e8f0":
        return t("color_slate");
      default:
        return c.name;
    }
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
            <span>{t("appearance_title")}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("appearance_desc")}
          </p>
        </div>

        <Button variant="neon" size="md" type="submit" className="gap-2 shrink-0">
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-[#07090e]" />
              {t("common_saved")}
            </>
          ) : (
            t("common_save")
          )}
        </Button>
      </div>

      {/* Preset Themes Showcase Grid */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <label
          className={cn(
            "block text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
            isLight ? "text-slate-700" : "text-slate-300"
          )}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          {t("appearance_presets_title")}
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(PRESET_THEMES).map(([key, t]) => {
            const isSelected = activePreset === key;
            return (
              <button
                type="button"
                key={key}
                onClick={() => applyPreset(key)}
                className={`relative p-3.5 rounded-xl border text-left transition-all overflow-hidden group cursor-pointer ${
                  isSelected
                    ? isLight
                      ? "border-emerald-500 bg-white shadow-md ring-2 ring-emerald-500/20"
                      : "border-[var(--card-accent)] shadow-[0_0_20px_var(--card-glow)] bg-slate-900"
                    : isLight
                      ? "border-slate-200 bg-slate-50/80 hover:bg-white hover:border-slate-300 hover:shadow-xs"
                      : "border-slate-800/80 bg-slate-950/60 hover:border-slate-700"
                }`}
                style={
                  {
                    "--card-accent": t.accent_color,
                    "--card-glow": `${t.accent_color}25`,
                  } as React.CSSProperties
                }
              >
                {/* Theme preview swatch */}
                <div
                  className={`h-10 w-full rounded-lg mb-2 flex items-center justify-center p-1 border ${
                    isLight ? "border-slate-200 shadow-2xs" : "border-white/10"
                  }`}
                  style={{ background: t.background_value }}
                >
                  <span
                    className="w-5 h-2 rounded-full shadow-sm"
                    style={{ backgroundColor: t.accent_color }}
                  />
                </div>

                <div className={`font-semibold text-xs truncate transition-colors ${
                  isLight ? "text-slate-800 group-hover:text-slate-950" : "text-slate-200 group-hover:text-white"
                }`}>
                  {t.name}
                </div>
                <div className={`text-[10px] font-mono capitalize ${
                  isLight ? "text-slate-500" : "text-slate-500"
                }`}>
                  {t.button_style}
                </div>

                {isSelected && (
                  <span
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                      isLight ? "ring-2 ring-white" : ""
                    }`}
                    style={{ backgroundColor: t.accent_color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Accent Color Picker */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <label
          className={cn(
            "block text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
            isLight ? "text-slate-700" : "text-slate-300"
          )}
        >
          <Palette className="w-3.5 h-3.5 text-[#00f0ff]" />
          {t("appearance_accent_color")}
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {AVAILABLE_ACCENT_COLORS.map((c) => (
            <button
              type="button"
              key={c.hex}
              onClick={() => {
                updateTheme({ accent_color: c.hex });
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                accentColor === c.hex
                  ? isLight
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs font-semibold"
                    : "border-white bg-slate-800 shadow-md text-white font-semibold"
                  : isLight
                    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: c.hex, color: c.hex }}
              />
              <span>{getColorName(c)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Button Style & Border Radius */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-5 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <label
          className={cn(
            "block text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
            isLight ? "text-slate-700" : "text-slate-300"
          )}
        >
          <Sliders className="w-3.5 h-3.5 text-[#c084fc]" />
          {t("appearance_geometry")}
        </label>

        {/* Button Style */}
        <div>
          <span className="block text-xs text-slate-400 mb-2">
            {t("appearance_btn_aesthetics")}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {buttonStyleOptions.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => {
                  updateTheme({ button_style: opt.id });
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  buttonStyle === opt.id
                    ? isLight
                      ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500/20"
                      : "border-emerald-500 bg-emerald-500/10 text-white font-semibold shadow-sm shadow-emerald-500/15"
                    : isLight
                      ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className={`text-xs font-medium ${isLight ? "text-slate-900" : "text-slate-200"}`}>
                  {opt.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Corner Radius */}
        <div>
          <span className="block text-xs text-slate-400 mb-2">
            {t("appearance_corner_radius")}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {radiusOptions.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => {
                  updateTheme({ border_radius: r.id });
                }}
                className={`py-2 px-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                  borderRadius === r.id
                    ? isLight
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-500/20"
                      : "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-semibold"
                    : isLight
                      ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography & Font */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-3 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <label
          className={cn(
            "block text-xs font-semibold uppercase tracking-wider transition-colors",
            isLight ? "text-slate-700" : "text-slate-300"
          )}
        >
          {t("appearance_typography")}
        </label>
        <select
          value={fontFamily}
          onChange={(e) => {
            updateTheme({ font_family: e.target.value });
          }}
          className={`w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500/60 border ${
            isLight
              ? "bg-white border-slate-200 text-slate-900"
              : "bg-[#090d18] border-slate-800 text-slate-100"
          }`}
        >
          {AVAILABLE_FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Platform Branding Option */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wider transition-colors",
              isLight ? "text-slate-700" : "text-slate-300"
            )}
          >
            {t("appearance_branding_title")}
          </span>
        </div>

        <Switch
          label={t("appearance_branding_remove")}
          description={t("appearance_branding_desc")}
          checked={hideBranding}
          onCheckedChange={(val) => {
            updateTheme({ hide_branding: val });
          }}
        />
      </div>

      <div className="flex items-center justify-end pt-2">
        <Button variant="neon" size="md" type="submit">
          {t("appearance_btn_save")}
        </Button>
      </div>
    </form>
  );
}
