"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "neon" | "glass" | "outline" | "ghost" | "danger" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "neon",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0f19] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variantStyles = {
      neon: "bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] focus:ring-emerald-400",
      glass:
        "glass-panel text-slate-100 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_4px_15px_rgba(255,255,255,0.06)] focus:ring-slate-400",
      outline:
        "border border-emerald-500/30 text-emerald-400 bg-transparent hover:bg-emerald-500/10 hover:border-emerald-400 focus:ring-emerald-400",
      ghost:
        "text-slate-400 hover:text-slate-100 hover:bg-white/5 focus:ring-slate-500",
      danger:
        "bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] focus:ring-red-500",
      secondary:
        "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white focus:ring-slate-500",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5 font-semibold",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
