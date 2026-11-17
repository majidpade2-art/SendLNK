"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNumber, cn } from "@/lib/utils";
import {
  Eye,
  MousePointerClick,
  Percent,
  Link2,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function OverviewTab() {
  const { user, links, analytics, uiTheme, language, t } = useApp();
  const [timelineFilter, setTimelineFilter] = useState<"7d" | "30d">("7d");
  const isLight = uiTheme === "light";

  const formatDay = (dateStr: string) => {
    if (language === "id") {
      const dayMap: Record<string, string> = {
        Mon: "Sen",
        Tue: "Sel",
        Wed: "Rab",
        Thu: "Kam",
        Fri: "Jum",
        Sat: "Sab",
        Sun: "Min",
      };
      return dayMap[dateStr] || dateStr;
    }
    return dateStr;
  };

  const getDeviceLabel = (device: string) => {
    if (device === "Mobile") return t("overview_mobile");
    if (device === "Desktop") return t("overview_desktop");
    if (device === "Tablet") return t("overview_tablet");
    return device;
  };

  const getReferralLabel = (source: string) => {
    if (source === "Direct / QR Scan") return t("overview_direct_qr");
    return source;
  };

  // Multiplier for 30d simulation
  const mult = timelineFilter === "30d" ? 3.8 : 1;
  const totalViews = Math.round(analytics.total_views * mult);
  const totalClicks = Math.round(analytics.total_clicks * mult);
  const activeCount = links.filter((l) => l.is_active).length;

  // Max value in daily stats for SVG height scaling
  const maxStat = Math.max(
    ...analytics.daily_stats.map((d) => Math.max(d.views, d.clicks)),
    1
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-6 transition-all border",
          isLight
            ? "bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-slate-50 border-emerald-500/25 shadow-xs"
            : "bg-gradient-to-r from-[#0b1324] via-[#0f172a] to-[#0d1c3a] border border-emerald-500/20 shadow-lg shadow-black/40"
        )}
      >
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "text-xs uppercase font-mono tracking-wider font-bold",
                  isLight ? "text-emerald-700" : "text-emerald-400"
                )}
              >
                {t("overview_title")}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h2
              className={cn(
                "text-xl sm:text-2xl font-extrabold transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("overview_welcome")}, {user.display_name}!
            </h2>
            <p
              className={cn(
                "text-xs sm:text-sm mt-1 max-w-lg transition-colors",
                isLight ? "text-slate-600" : "text-slate-300"
              )}
            >
              Pusat digital Anda aktif dengan tingkat keterlibatan yang tinggi. Anda telah memperoleh{" "}
              <strong className={isLight ? "text-emerald-700" : "text-emerald-400"}>
                +14.2%
              </strong>{" "}
              {t("overview_growth")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/links"
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all shrink-0 cursor-pointer"
            >
              {t("overview_new_link")}
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div
          className={cn(
            "p-5 rounded-2xl border transition-all",
            isLight
              ? "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm"
              : "bg-[#0a0e1a] border-slate-800/80 hover:border-slate-700"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">
              {t("overview_total_views")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div
            className={cn(
              "text-2xl sm:text-3xl font-extrabold transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            {formatNumber(totalViews)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% from last period</span>
          </div>
        </div>

        {/* Total Clicks */}
        <div
          className={cn(
            "p-5 rounded-2xl border transition-all",
            isLight
              ? "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm"
              : "bg-[#0a0e1a] border-slate-800/80 hover:border-slate-700"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">
              {t("overview_total_clicks")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div
            className={cn(
              "text-2xl sm:text-3xl font-extrabold transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            {formatNumber(totalClicks)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+22.1% engagement</span>
          </div>
        </div>

        {/* Click-Through Rate */}
        <div
          className={cn(
            "p-5 rounded-2xl border transition-all",
            isLight
              ? "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm"
              : "bg-[#0a0e1a] border-slate-800/80 hover:border-slate-700"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">
              {t("overview_ctr")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div
            className={cn(
              "text-2xl sm:text-3xl font-extrabold transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            {analytics.ctr}%
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-400 mt-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top tier SaaS benchmark</span>
          </div>
        </div>

        {/* Active Links */}
        <div
          className={cn(
            "p-5 rounded-2xl border transition-all",
            isLight
              ? "bg-white border-slate-200/90 hover:border-slate-300 shadow-sm"
              : "bg-[#0a0e1a] border-slate-800/80 hover:border-slate-700"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">
              {t("overview_active_links")}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <div
            className={cn(
              "text-2xl sm:text-3xl font-extrabold transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            {activeCount}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span>{links.length} total links configured</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Traffic Visualizer */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3
                className={cn(
                  "text-base font-bold flex items-center gap-2 transition-colors",
                  isLight ? "text-slate-900" : "text-white"
                )}
              >
                <span>{t("overview_engagement_title")}</span>
                <span
                  className={cn(
                    "text-xs font-mono font-normal transition-colors",
                    isLight ? "text-slate-500" : "text-slate-400"
                  )}
                >
                  {t("overview_views_vs_clicks")}
                </span>
              </h3>
              <p
                className={cn(
                  "text-xs mt-0.5 transition-colors",
                  isLight ? "text-slate-600" : "text-slate-400"
                )}
              >
                {t("overview_engagement_desc")}
              </p>
            </div>

            {/* Timeline Filter Toggle */}
            <div
              className={cn(
                "flex items-center p-1 rounded-xl text-xs font-medium border",
                isLight
                  ? "bg-slate-100 border-slate-200"
                  : "bg-slate-900 border-slate-800"
              )}
            >
              <button
                onClick={() => setTimelineFilter("7d")}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all cursor-pointer",
                  timelineFilter === "7d"
                    ? "bg-emerald-500 text-slate-950 font-semibold shadow-xs"
                    : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                )}
              >
                {t("overview_days_7")}
              </button>
              <button
                onClick={() => setTimelineFilter("30d")}
                className={cn(
                  "px-3 py-1 rounded-lg transition-all cursor-pointer",
                  timelineFilter === "30d"
                    ? "bg-emerald-500 text-slate-950 font-semibold shadow-xs"
                    : isLight
                      ? "text-slate-600 hover:text-slate-900"
                      : "text-slate-400 hover:text-white"
                )}
              >
                {t("overview_days_30")}
              </button>
            </div>
          </div>

          {/* Custom SVG Neon Bar Chart */}
          <div
            className={cn(
              "h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-4 pb-2 px-2 border-b transition-colors",
              isLight ? "border-slate-200" : "border-slate-800/60"
            )}
          >
            {analytics.daily_stats.map((stat, i) => {
              const viewsHeight = stat.views === 0 ? 4 : Math.max(15, (stat.views / maxStat) * 100);
              const clicksHeight = stat.clicks === 0 ? 4 : Math.max(12, (stat.clicks / maxStat) * 100);

              return (
                <div
                  key={stat.date}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-[11px] p-2 rounded-lg pointer-events-none mb-2 shadow-xl whitespace-nowrap z-20">
                    <div className="font-bold text-white mb-0.5">
                      {stat.date}
                    </div>
                    <div className="text-slate-300">
                      {t("overview_views")}:{" "}
                      <strong className="text-emerald-400">
                        {stat.views * (timelineFilter === "30d" ? 4 : 1)}
                      </strong>
                    </div>
                    <div className="text-slate-300">
                      {t("overview_clicks")}:{" "}
                      <strong className="text-cyan-400">
                        {stat.clicks * (timelineFilter === "30d" ? 4 : 1)}
                      </strong>
                    </div>
                  </div>

                  {/* Bars side-by-side */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-44">
                    {/* Views bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${viewsHeight}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className="w-1/2 max-w-[16px] rounded-t-md bg-gradient-to-t from-emerald-950 to-emerald-500 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all"
                    />
                    {/* Clicks bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${clicksHeight}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 + 0.05 }}
                      className="w-1/2 max-w-[16px] rounded-t-md bg-gradient-to-t from-cyan-950 to-cyan-500 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all"
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={cn(
                      "text-[11px] font-mono mt-2 transition-colors",
                      isLight ? "text-slate-600" : "text-slate-400"
                    )}
                  >
                    {formatDay(stat.date)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className={cn("transition-colors", isLight ? "text-slate-700" : "text-slate-300")}>
                {t("overview_impressions")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-500" />
              <span className={cn("transition-colors", isLight ? "text-slate-700" : "text-slate-300")}>
                {t("overview_clicks_label")}
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Device Breakdown & Referrers */}
        <div className="p-5 rounded-2xl bg-[#0a0e1a] border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h3
              className={cn(
                "text-base font-bold mb-1 transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              {t("overview_devices")}
            </h3>
            <p
              className={cn(
                "text-xs mb-4 transition-colors",
                isLight ? "text-slate-600" : "text-slate-400"
              )}
            >
              {t("overview_devices_desc")}
            </p>

            {/* Device progress bars */}
            <div className="space-y-4">
              {analytics.device_stats.map((dev) => {
                const Icon =
                  dev.device === "Mobile"
                    ? Smartphone
                    : dev.device === "Desktop"
                    ? Monitor
                    : Tablet;

                return (
                  <div key={dev.device} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div
                        className={cn(
                          "flex items-center gap-2 transition-colors",
                          isLight ? "text-slate-700" : "text-slate-300"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-medium">{getDeviceLabel(dev.device)}</span>
                      </div>
                      <span
                        className={cn(
                          "font-mono font-semibold transition-colors",
                          isLight ? "text-slate-900" : "text-white"
                        )}
                      >
                        {dev.percentage}%
                      </span>
                    </div>
                    <div
                      className={cn(
                        "w-full h-2 rounded-full overflow-hidden",
                        isLight ? "bg-slate-200" : "bg-slate-800"
                      )}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                        style={{ width: `${dev.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Referrers */}
          <div
            className={cn(
              "mt-6 pt-5 border-t",
              isLight ? "border-slate-200" : "border-slate-800"
            )}
          >
            <h4
              className={cn(
                "text-xs font-semibold uppercase tracking-wider mb-3 transition-colors",
                isLight ? "text-slate-700" : "text-slate-300"
              )}
            >
              {t("overview_top_channels")}
            </h4>
            <div className="space-y-2.5">
              {analytics.referral_stats.slice(0, 3).map((ref) => (
                <div
                  key={ref.source}
                  className="flex items-center justify-between text-xs"
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      isLight ? "text-slate-600" : "text-slate-400"
                    )}
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-500" />
                    <span className="truncate max-w-[140px]">{getReferralLabel(ref.source)}</span>
                  </div>
                  <span
                    className={cn(
                      "font-mono transition-colors",
                      isLight ? "text-slate-800" : "text-slate-200"
                    )}
                  >
                    {ref.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Top Performing Links Ranking */}
      <div
        className={cn(
          "p-5 rounded-2xl border transition-all",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={cn(
              "text-base font-bold flex items-center gap-2 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            <span>{t("overview_top_destinations")}</span>
            <span className="text-xs font-normal text-slate-400">
              {t("overview_by_clicks")}
            </span>
          </h3>
          <Link
            href="/dashboard/links"
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t("overview_manage_all")}</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {links
            .slice()
            .sort((a, b) => b.click_count - a.click_count)
            .slice(0, 6)
            .map((link, idx) => (
              <div
                key={link.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all text-xs",
                  isLight
                    ? "bg-slate-50/80 border-slate-200 hover:border-slate-300"
                    : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold shrink-0 transition-colors",
                      isLight ? "bg-slate-200 text-slate-700" : "bg-slate-800 text-slate-400"
                    )}
                  >
                    #{idx + 1}
                  </span>
                  <div className="truncate">
                    <div
                      className={cn(
                        "font-semibold truncate transition-colors",
                        isLight ? "text-slate-800" : "text-slate-200"
                      )}
                    >
                      {link.title}
                    </div>
                    <div
                      className={cn(
                        "text-[11px] font-mono truncate transition-colors",
                        isLight ? "text-slate-500" : "text-slate-400"
                      )}
                    >
                      {link.url}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-400 font-mono">
                    {formatNumber(link.click_count)}
                  </div>
                  <div className="text-[10px] text-slate-500">{t("overview_clicks")}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
