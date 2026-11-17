"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Link2,
  Share2,
  Palette,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  onCloseMobile?: () => void;
}

export function DashboardSidebar({ onCloseMobile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout, uiTheme, t } = useApp();
  const isLight = uiTheme === "light";

  const navItems = [
    { name: t("nav_overview"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("nav_profile"), href: "/dashboard/profile", icon: User },
    { name: t("nav_links"), href: "/dashboard/links", icon: Link2 },
    { name: t("nav_socials"), href: "/dashboard/socials", icon: Share2 },
    { name: t("nav_appearance"), href: "/dashboard/appearance", icon: Palette },
    { name: t("nav_analytics"), href: "/dashboard/analytics", icon: BarChart3 },
    { name: t("nav_settings"), href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "w-64 h-full flex flex-col justify-between border-r p-4 select-none transition-colors",
        isLight ? "bg-white border-slate-200" : "bg-[#0b0f19] border-slate-800/80"
      )}
    >
      {/* Brand logo & Handle */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 p-0.5 flex items-center justify-center drop-shadow-[0_0_12px_rgba(16,185,129,0.25)] shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SendLNK Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <span
              className={cn(
                "font-extrabold text-base tracking-wider transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              SendLNK
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-emerald-500 font-semibold">
              LINK IN BIO
            </span>
          </div>
        </div>

        {/* Live profile link pill */}
        <Link
          href={`/${user.username}`}
          target="_blank"
          className={cn(
            "flex items-center justify-between p-2.5 mb-6 rounded-xl border text-xs group transition-all",
            isLight
              ? "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-emerald-500/40 text-slate-700"
              : "bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/50 text-slate-300"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url || "/avatar.png"}
              alt={user.display_name}
              className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200/40"
            />
            <span
              className={cn(
                "font-mono truncate",
                isLight ? "text-slate-700 group-hover:text-slate-950" : "text-slate-300 group-hover:text-white"
              )}
            >
              sendlnk.net/{user.username}
            </span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0" />
        </Link>

        {/* Navigation items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? isLight
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-2xs font-semibold"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-500/10 font-semibold"
                    : isLight
                      ? "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full" />
                )}
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-emerald-500"
                      : isLight
                        ? "text-slate-500 group-hover:text-slate-900"
                        : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card & Logout */}
      <div className={cn("space-y-3 pt-4 border-t", isLight ? "border-slate-200" : "border-slate-800/80")}>
        {/* Open Access Status */}
        <div
          className={cn(
            "p-3.5 rounded-xl border relative overflow-hidden transition-all",
            isLight
              ? "bg-gradient-to-b from-emerald-50/80 to-slate-50 border-emerald-500/25 shadow-2xs"
              : "bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border-emerald-500/20"
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={cn(
                "text-xs font-semibold flex items-center gap-1",
                isLight ? "text-slate-900" : "text-slate-200"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              {t("nav_open_access")}
            </span>
            <span
              className={cn(
                "text-[10px] font-mono px-1.5 py-0.5 rounded font-bold",
                isLight
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200/80"
                  : "bg-emerald-500/20 text-emerald-300"
              )}
            >
              FREE
            </span>
          </div>
          <p
            className={cn(
              "text-[11px] leading-tight",
              isLight ? "text-slate-600" : "text-slate-400"
            )}
          >
            {t("nav_open_access_desc")}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            onCloseMobile?.();
            logout("/auth/login");
          }}
          className={cn(
            "flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer",
            isLight
              ? "text-slate-600 hover:text-red-600 hover:bg-red-50"
              : "text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          )}
        >
          <LogOut className="w-4 h-4" />
          <span>{t("nav_signout")}</span>
        </button>
      </div>
    </aside>
  );
}
