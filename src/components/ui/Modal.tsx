"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "md",
}: ModalProps) {
  const { uiTheme } = useApp();
  const isLight = uiTheme === "light";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={cn(
              "fixed inset-0 backdrop-blur-md transition-colors",
              isLight ? "bg-slate-900/40" : "bg-black/75"
            )}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative w-full max-h-[88vh] flex flex-col rounded-2xl modal-content border z-10 my-auto overflow-hidden transition-colors shadow-2xl",
              isLight
                ? "bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)]"
                : "bg-[#0b0f1a] border-slate-800/80 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.8)]",
              maxWidthStyles[maxWidth],
              className
            )}
          >
            {/* Soft top organic glow line */}
            <div
              className={cn(
                "h-[2px] w-full shrink-0",
                isLight
                  ? "bg-gradient-to-r from-transparent via-emerald-500/80 to-transparent"
                  : "bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
              )}
            />

            {/* Modal Header (Pinned at top) */}
            <div className="p-5 sm:p-6 pb-3 flex items-start justify-between gap-4 shrink-0">
              <div>
                {title && (
                  <h3
                    className={cn(
                      "text-lg font-bold tracking-tight transition-colors",
                      isLight ? "text-slate-900" : "text-slate-100"
                    )}
                  >
                    {title}
                  </h3>
                )}
                {description && (
                  <p
                    className={cn(
                      "text-xs mt-1 transition-colors",
                      isLight ? "text-slate-500" : "text-slate-400"
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className={cn(
                  "rounded-lg p-1.5 transition-colors cursor-pointer shrink-0",
                  isLight
                    ? "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                )}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="px-5 sm:px-6 pb-6 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
