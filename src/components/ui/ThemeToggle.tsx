"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  variant?: "icon" | "pill" | "badge";
  className?: string;
}

export function ThemeToggle({
  variant = "pill",
  className = "",
}: ThemeToggleProps) {
  const { uiTheme, toggleUiTheme, language } = useApp();
  const isLight = uiTheme === "light";

  const label = isLight
    ? language === "id"
      ? "Mode Terang"
      : "Light Mode"
    : language === "id"
    ? "Mode Gelap"
    : "Dark Mode";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleUiTheme}
        className={`p-2 rounded-xl border transition-all cursor-pointer ${
          isLight
            ? "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40"
            : "bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:border-emerald-500/50"
        } ${className}`}
        title={label}
        aria-label={label}
      >
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-500 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-cyan-400 transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleUiTheme}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
        isLight
          ? "bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20"
          : "bg-slate-900 border-slate-700/80 text-slate-200 hover:text-white hover:border-emerald-500/50"
      } ${className}`}
      title={label}
      aria-label={label}
    >
      {isLight ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline font-medium">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline font-medium">Dark</span>
        </>
      )}
    </button>
  );
}
