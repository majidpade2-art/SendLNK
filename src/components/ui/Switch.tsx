"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
  description?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  label,
  description,
}: SwitchProps) {
  const { uiTheme } = useApp();
  const isLight = uiTheme === "light";

  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex items-center justify-between gap-3">
      {(label || description) && (
        <label htmlFor={switchId} className="cursor-pointer select-none">
          {label && (
            <span
              className={cn(
                "block text-sm font-medium transition-colors",
                isLight ? "text-slate-800" : "text-slate-200"
              )}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              className={cn(
                "block text-xs transition-colors",
                isLight ? "text-slate-500" : "text-slate-400"
              )}
            >
              {description}
            </span>
          )}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
          checked
            ? "bg-emerald-500 shadow-sm shadow-emerald-500/30"
            : isLight
            ? "bg-slate-300"
            : "bg-slate-800",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full shadow-md transform ring-0 transition duration-200 ease-in-out",
            checked
              ? "translate-x-5 bg-white"
              : isLight
              ? "translate-x-0 bg-white shadow-sm"
              : "translate-x-0 bg-slate-400"
          )}
        />
      </button>
    </div>
  );
}
