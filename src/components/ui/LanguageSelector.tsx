"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  variant?: "dropdown" | "grid" | "compact";
  className?: string;
}

export function LanguageSelector({
  variant = "dropdown",
  className = "",
}: LanguageSelectorProps) {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Grid Variant (Ideal for Settings Tab)
  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3", className)}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = language === lang.code;
          return (
            <button
              type="button"
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer group",
                isSelected
                  ? "bg-emerald-500/10 border-emerald-500/50 shadow-sm shadow-emerald-500/15"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0 select-none">{lang.flag}</span>
                <div className="truncate">
                  <div
                    className={cn(
                      "text-xs font-semibold truncate",
                      isSelected ? "text-emerald-400 font-bold" : "text-slate-200 group-hover:text-white"
                    )}
                  >
                    {lang.nativeName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {lang.name}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 ml-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Compact Pill Variant (e.g. for header or footer)
  if (variant === "compact") {
    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all backdrop-blur-md shadow-xs border",
            className || "bg-black/40 border-white/10 text-slate-300 hover:border-emerald-500/40"
          )}
          title="Change Language"
        >
          <span className="text-sm select-none">{currentLang.flag}</span>
          <span className="font-mono uppercase text-[11px]">
            {currentLang.code}
          </span>
          <ChevronDown className={cn("w-3 h-3 opacity-60 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 mb-1">
              Select Language
            </div>
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-1.5 text-xs text-left transition-colors",
                  language === l.code
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{l.flag}</span>
                  <span>{l.nativeName}</span>
                </span>
                {language === l.code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. Standard Dropdown Variant (e.g. for header bar)
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-medium text-slate-200 transition-all cursor-pointer",
          className
        )}
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-sm select-none">{currentLang.flag}</span>
        <span className="hidden sm:inline font-medium">{currentLang.nativeName}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-1.5 z-50">
          <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
            Display Language
          </div>
          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((l) => {
              const active = language === l.code;
              return (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer",
                    active
                      ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base select-none">{l.flag}</span>
                    <div>
                      <div className="font-medium leading-none mb-0.5">
                        {l.nativeName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {l.name}
                      </div>
                    </div>
                  </div>
                  {active && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
