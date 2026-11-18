"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PRESET_THEMES } from "@/lib/constants/themes";
import { PublicProfileView } from "@/components/profile/PublicProfileView";
import {
  ArrowRight,
  Sparkles,
  Smartphone,
  BarChart3,
  Palette,
  ShieldCheck,
  Check,
  Layers,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const { user, links, socials, isAuthenticated, uiTheme, t } = useApp();
  const [handleInput, setHandleInput] = useState("");
  const [previewThemeKey, setPreviewThemeKey] = useState("cyberpunk");

  const isLight = uiTheme === "light";

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) {
      router.push("/auth/register");
      return;
    }
    router.push(`/auth/register?handle=${encodeURIComponent(handleInput.trim())}`);
  };

  const currentPreviewTheme = PRESET_THEMES[previewThemeKey] || PRESET_THEMES.cyberpunk;

  const previewUser = {
    ...user,
    theme_config: currentPreviewTheme,
  };

  return (
    <div
      className={cn(
        "min-h-screen selection:bg-emerald-500/30 selection:text-emerald-500 overflow-x-hidden transition-colors duration-200",
        isLight
          ? "bg-[#f8fafc] text-slate-900"
          : "bg-[#0b0f19] text-slate-100"
      )}
    >
      {/* Background Ambience & Cyber Grid */}
      <div className="fixed inset-0 bg-grid-cyber opacity-25 pointer-events-none" />
      <div
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] blur-[140px] pointer-events-none transition-opacity",
          isLight
            ? "bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent"
            : "bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent"
        )}
      />

      {/* Navigation Bar */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors",
          isLight
            ? "bg-white/80 border-slate-200/80 shadow-xs"
            : "bg-[#0b0f19]/80 border-slate-800/80"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(16,185,129,0.35)] overflow-hidden border border-emerald-500/30 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="SendLNK Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-full" />
            </div>
            <span
              className={cn(
                "font-extrabold text-lg sm:text-2xl tracking-wider transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              SendLNK
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a
              href="#features"
              className={cn(
                "transition-colors",
                isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-300 hover:text-white"
              )}
            >
              {t("landing_nav_features")}
            </a>
            <a
              href="#themes"
              className={cn(
                "transition-colors",
                isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-300 hover:text-white"
              )}
            >
              {t("landing_nav_themes")}
            </a>
            <Link
              href={`/${user.username || "sendlink"}`}
              target="_blank"
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-300 hover:text-white"
              )}
            >
              <span>{t("landing_nav_explore")}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <ThemeToggle />
            <LanguageSelector variant="compact" />
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>{t("landing_nav_dashboard")}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/auth/login"
                  className={cn(
                    "text-xs sm:text-sm font-semibold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border transition-colors",
                    isLight
                      ? "border-slate-200 bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-2xs"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800"
                  )}
                >
                  {t("landing_nav_signin")}
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Daftar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 sm:pt-20 sm:pb-32 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Natural Pill Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono mb-4 sm:mb-6 transition-colors",
            isLight
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-bold shadow-xs"
              : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10"
          )}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          <span>{t("landing_hero_badge")}</span>
        </div>

        {/* Main Headline */}
        <h1
          className={cn(
            "text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.15] sm:leading-[1.1] transition-colors",
            isLight ? "text-slate-900" : "text-white"
          )}
        >
          {t("landing_hero_title")}
        </h1>

        <p
          className={cn(
            "mt-4 sm:mt-6 text-sm sm:text-lg max-w-2xl leading-relaxed transition-colors px-2",
            isLight ? "text-slate-600" : "text-slate-400"
          )}
        >
          {t("landing_hero_desc")}
        </p>

        {/* Handle Claim Form */}
        <form
          onSubmit={handleClaim}
          className={cn(
            "mt-6 sm:mt-10 w-full max-w-md p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-lg",
            isLight
              ? "bg-white border-slate-300/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20"
              : "bg-[#0e1628]/90 backdrop-blur-xl border-slate-800 focus-within:border-emerald-500/60 focus-within:shadow-[0_4px_20px_rgba(16,185,129,0.15)]"
          )}
        >
          <div className="flex items-center flex-1 min-w-0 px-2.5 py-1">
            <span className="text-xs sm:text-sm font-mono text-slate-400 shrink-0 select-none">
              sendlnk.net/
            </span>
            <input
              type="text"
              placeholder={t("landing_claim_placeholder")}
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              className={cn(
                "bg-transparent flex-1 text-xs sm:text-sm placeholder-slate-400 focus:outline-none font-mono py-1 px-1.5 min-w-0",
                isLight ? "text-slate-900" : "text-slate-100"
              )}
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{t("landing_claim_btn")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div
          className={cn(
            "mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-mono transition-colors px-2",
            isLight ? "text-slate-600 font-medium" : "text-slate-400"
          )}
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> 100% Gratis
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Tanpa Koding
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Setup Instan
          </span>
        </div>

        {/* Live Interactive Showcase with Theme Selector */}
        <div id="themes" className="mt-16 w-full max-w-5xl">
          <div
            className={cn(
              "p-6 sm:p-8 rounded-3xl border transition-all relative overflow-hidden",
              isLight
                ? "bg-white border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
                : "bg-[#090d18]/90 border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            )}
          >
            <div
              className={cn(
                "flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-5 border-b transition-colors",
                isLight ? "border-slate-100" : "border-slate-800"
              )}
            >
              <div className="text-left">
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-500 font-bold">
                  Simulator Langsung Interaktif
                </span>
                <h3
                  className={cn(
                    "text-lg font-bold mt-0.5 transition-colors",
                    isLight ? "text-slate-900" : "text-white"
                  )}
                >
                  Rasakan Perubahan Tema Secara Real-Time
                </h3>
              </div>

              {/* Theme switcher tabs */}
              <div className="flex flex-wrap items-center justify-start sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
                {Object.keys(PRESET_THEMES).slice(0, 5).map((tKey) => {
                  const t = PRESET_THEMES[tKey];
                  const isActive = previewThemeKey === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => setPreviewThemeKey(tKey)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer",
                        isActive
                          ? isLight
                            ? "bg-slate-900 text-white shadow-sm shadow-slate-900/20 font-semibold"
                            : "bg-slate-800 text-white border border-emerald-500 shadow-sm shadow-emerald-500/20 font-semibold"
                          : isLight
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80"
                            : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                      )}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: t.accent_color }}
                      />
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Embedded Live Phone Frame inside Showcase */}
            <div className="flex justify-center py-4">
              <div
                className={cn(
                  "w-full max-w-[340px] h-[580px] rounded-[44px] p-3.5 border-[4px] overflow-hidden relative transition-all",
                  isLight
                    ? "bg-slate-950 border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/10"
                    : "bg-[#0a0d16] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                )}
                style={{
                  boxShadow: isLight
                    ? `0 0 35px ${currentPreviewTheme.accent_color}25, 0 25px 60px rgba(0,0,0,0.1)`
                    : `0 0 40px ${currentPreviewTheme.accent_color}25, 0 25px 60px rgba(0,0,0,0.9)`,
                }}
              >
                {/* Dynamic Island */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-20" />
                <div className="w-full h-full rounded-[34px] overflow-hidden overflow-y-auto no-scrollbar relative">
                  <PublicProfileView
                    user={previewUser}
                    links={links}
                    socials={socials}
                    isMockClick={true}
                    isInsidePreview={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-emerald-500 font-bold">
            {t("landing_features_badge")}
          </span>
          <h2
            className={cn(
              "text-3xl sm:text-4xl font-extrabold mt-2 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            {t("landing_features_title")}
          </h2>
          <p
            className={cn(
              "text-sm mt-3 transition-colors",
              isLight ? "text-slate-600" : "text-slate-400"
            )}
          >
            {t("landing_features_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div
            className={cn(
              "p-6 rounded-2xl border transition-all group",
              isLight
                ? "bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/50"
                : "bg-[#0a0e1a] border-slate-800/80 hover:border-emerald-500/40"
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Palette className="w-6 h-6" />
            </div>
            <h3
              className={cn(
                "text-lg font-bold mb-2 transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("landing_f3_title")}
            </h3>
            <p
              className={cn(
                "text-xs leading-relaxed transition-colors",
                isLight ? "text-slate-600" : "text-slate-400"
              )}
            >
              {t("landing_f3_desc")}
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className={cn(
              "p-6 rounded-2xl border transition-all group",
              isLight
                ? "bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-cyan-500/50"
                : "bg-[#0a0e1a] border-slate-800/80 hover:border-cyan-500/40"
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3
              className={cn(
                "text-lg font-bold mb-2 transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("preview_title")}
            </h3>
            <p
              className={cn(
                "text-xs leading-relaxed transition-colors",
                isLight ? "text-slate-600" : "text-slate-400"
              )}
            >
              {t("layout_overview_sub")}
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className={cn(
              "p-6 rounded-2xl border transition-all group",
              isLight
                ? "bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-500/50"
                : "bg-[#0a0e1a] border-slate-800/80 hover:border-purple-500/40"
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3
              className={cn(
                "text-lg font-bold mb-2 transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("landing_f2_title")}
            </h3>
            <p
              className={cn(
                "text-xs leading-relaxed transition-colors",
                isLight ? "text-slate-600" : "text-slate-400"
              )}
            >
              {t("landing_f2_desc")}
            </p>
          </div>

          {/* Feature 4 */}
          <div
            className={cn(
              "p-6 rounded-2xl border transition-all group",
              isLight
                ? "bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-500/50"
                : "bg-[#0a0e1a] border-slate-800/80 hover:border-amber-500/40"
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3
              className={cn(
                "text-lg font-bold mb-2 transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("landing_f1_title")}
            </h3>
            <p
              className={cn(
                "text-xs leading-relaxed transition-colors",
                isLight ? "text-slate-600" : "text-slate-400"
              )}
            >
              {t("landing_f1_desc")}
            </p>
          </div>

          {/* Feature 5 */}
          <div
            className={cn(
              "p-6 rounded-2xl border transition-all group",
              isLight
                ? "bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/50"
                : "bg-[#0a0e1a] border-slate-800/80 hover:border-emerald-500/40"
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3
              className={cn(
                "text-lg font-bold mb-2 transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("landing_f4_title")}
            </h3>
            <p
              className={cn(
                "text-xs leading-relaxed transition-colors",
                isLight ? "text-slate-600" : "text-slate-400"
              )}
            >
              {t("landing_f4_desc")}
            </p>
          </div>

          {/* Feature 6 */}
          <div
            className={cn(
              "p-6 rounded-2xl border transition-all group",
              isLight
                ? "bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-500/50"
                : "bg-[#0a0e1a] border-slate-800/80 hover:border-blue-500/40"
            )}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3
              className={cn(
                "text-lg font-bold mb-2 transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("settings_language_title")}
            </h3>
            <p
              className={cn(
                "text-xs leading-relaxed transition-colors",
                isLight ? "text-slate-600" : "text-slate-400"
              )}
            >
              {t("settings_language_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action Footer Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div
          className={cn(
            "p-8 sm:p-12 rounded-3xl border relative overflow-hidden transition-all",
            isLight
              ? "bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-slate-100 border-emerald-500/20 shadow-lg shadow-emerald-500/5"
              : "bg-gradient-to-r from-[#0b1324] via-[#0f172a] to-[#122244] border-emerald-500/20 shadow-xl shadow-black/50"
          )}
        >
          <div className="relative z-10">
            <h2
              className={cn(
                "text-3xl sm:text-5xl font-extrabold tracking-tight transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("landing_cta_title")}
            </h2>
            <p
              className={cn(
                "mt-4 text-sm sm:text-base max-w-xl mx-auto transition-colors",
                isLight ? "text-slate-600" : "text-slate-300"
              )}
            >
              {t("landing_cta_desc")}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all"
              >
                {t("landing_cta_btn")}
              </Link>
              <Link
                href="/auth/login"
                className={cn(
                  "w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors border",
                  isLight
                    ? "bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:text-slate-950"
                    : "bg-slate-900 border-slate-700 text-slate-200 hover:text-white hover:border-slate-500"
                )}
              >
                {t("landing_nav_signin")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={cn(
          "border-t py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs transition-colors",
          isLight ? "border-slate-200 text-slate-500" : "border-slate-800/80 text-slate-500"
        )}
      >
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="SendLNK Logo" className="w-6 h-6 object-cover rounded-full" />
          <span className={cn("font-bold transition-colors", isLight ? "text-slate-800" : "text-slate-300")}>
            SendLNK
          </span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className={cn(
              "transition-colors",
              isLight ? "hover:text-slate-900" : "hover:text-slate-300"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/auth/login"
            className={cn(
              "transition-colors",
              isLight ? "hover:text-slate-900" : "hover:text-slate-300"
            )}
          >
            Sign In
          </Link>
        </div>
      </footer>
    </div>
  );
}
