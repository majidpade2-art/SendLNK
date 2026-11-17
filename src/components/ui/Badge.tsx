"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neon" | "cyan" | "purple" | "outline" | "secondary" | "danger";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neon",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neon: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10",
    cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10",
    purple: "bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-500/10",
    outline: "bg-transparent text-slate-300 border border-slate-700",
    secondary: "bg-slate-800 text-slate-300 border border-slate-700/50",
    danger: "bg-red-500/10 text-red-400 border border-red-500/30",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 rounded-full font-semibold",
    md: "text-xs px-2.5 py-1 rounded-full font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 transition-all select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
