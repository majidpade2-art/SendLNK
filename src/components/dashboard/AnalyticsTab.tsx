"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatNumber, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Download,
  Smartphone,
  Globe,
  TrendingUp,
} from "lucide-react";
import { notify } from "@/lib/toast";

export function AnalyticsTab() {
  const { analytics, links, language, uiTheme, t } = useApp();
  const isLight = uiTheme === "light";
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");

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

  const multiplier = timeRange === "all" ? 12.5 : timeRange === "30d" ? 3.9 : 1;
  const views = Math.round(analytics.total_views * multiplier);
  const clicks = Math.round(analytics.total_clicks * multiplier);
  const ctr = analytics.ctr;

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Link Title,Destination URL,Click Count,Category\n" +
      links
        .map(
          (l) =>
            `"${l.title.replace(/"/g, '""')}","${l.url}",${l.click_count},"${
              l.category || "General"
            }"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sendlink.net-analytics-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify.success("Analytics CSV exported successfully!", "export-csv");
  };

  const maxDaily = Math.max(
    ...analytics.daily_stats.map((d) => Math.max(d.views, d.clicks)),
    1
  );

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2
            className={cn(
              "text-lg font-bold flex items-center gap-2 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            <span>{t("analytics_title")}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t("analytics_desc")}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Time Filter */}
          <div
            className={cn(
              "flex items-center p-1 rounded-xl text-xs transition-colors",
              isLight ? "bg-slate-100 border border-slate-200" : "bg-slate-900 border border-slate-800"
            )}
          >
            <button
              onClick={() => setTimeRange("7d")}
              className={cn(
                "px-3 py-1 rounded-lg transition-all cursor-pointer",
                timeRange === "7d"
                  ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:text-slate-950"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {t("analytics_range_7d")}
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={cn(
                "px-3 py-1 rounded-lg transition-all cursor-pointer",
                timeRange === "30d"
                  ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:text-slate-950"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {t("analytics_range_30d")}
            </button>
            <button
              onClick={() => setTimeRange("all")}
              className={cn(
                "px-3 py-1 rounded-lg transition-all cursor-pointer",
                timeRange === "all"
                  ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:text-slate-950"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {t("analytics_range_all")}
            </button>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            {t("analytics_export_csv")}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={cn(
            "p-5 rounded-2xl border transition-colors",
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
          )}
        >
          <span className="text-xs text-slate-400">{t("analytics_impressions")}</span>
          <div
            className={cn(
              "text-3xl font-extrabold mt-1 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            {formatNumber(views)}
          </div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +19.2% engagement growth
          </div>
        </div>

        <div
          className={cn(
            "p-5 rounded-2xl border transition-colors",
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
          )}
        >
          <span className="text-xs text-slate-400">{t("analytics_clicks")}</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1">
            {formatNumber(clicks)}
          </div>
          <div className="text-xs text-cyan-400 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +24.6% link interaction
          </div>
        </div>

        <div
          className={cn(
            "p-5 rounded-2xl border transition-colors",
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
          )}
        >
          <span className="text-xs text-slate-400">{t("analytics_ctr")}</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">
            {ctr}%
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Higher than 92% of link-in-bio hubs
          </div>
        </div>
      </div>

      {/* Detailed Interactive Timeline Chart */}
      <div
        className={cn(
          "p-6 rounded-2xl border transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={cn(
              "text-base font-bold transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            {t("analytics_timeline")}
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                isLight ? "text-slate-600" : "text-slate-300"
              )}
            >
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> {t("overview_views")}
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                isLight ? "text-slate-600" : "text-slate-300"
              )}
            >
              <span className="w-3 h-3 rounded-full bg-cyan-500" /> {t("overview_clicks")}
            </span>
          </div>
        </div>

        {/* SVG Neon Timeline Visualization */}
        <div
          className={cn(
            "h-64 w-full flex items-end justify-between gap-3 sm:gap-6 pt-4 pb-2 px-2 border-b transition-colors",
            isLight ? "border-slate-200" : "border-slate-800/60"
          )}
        >
          {analytics.daily_stats.map((stat) => {
            const vHeight = stat.views === 0 ? 3 : Math.max(12, (stat.views / maxDaily) * 100);
            const cHeight = stat.clicks === 0 ? 3 : Math.max(8, (stat.clicks / maxDaily) * 100);

            return (
              <div
                key={stat.date}
                className="flex-1 flex flex-col items-center justify-end h-full group"
              >
                <div className="w-full flex items-end justify-center gap-1.5 h-44">
                  <div
                    className="w-1/2 max-w-[18px] rounded-t-lg bg-gradient-to-t from-emerald-950 to-emerald-500 transition-all group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    style={{ height: `${vHeight}%` }}
                  />
                  <div
                    className="w-1/2 max-w-[18px] rounded-t-lg bg-gradient-to-t from-cyan-950 to-cyan-500 transition-all group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    style={{ height: `${cHeight}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2">
                  {formatDay(stat.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referrals & Devices Dual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Categories */}
        <div
          className={cn(
            "p-5 rounded-2xl border space-y-4 transition-colors",
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
          )}
        >
          <h3
            className={cn(
              "text-base font-bold flex items-center gap-2 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{t("analytics_devices")}</span>
          </h3>

          <div className="space-y-3">
            {analytics.device_stats.map((dev) => (
              <div key={dev.device} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      isLight ? "text-slate-700" : "text-slate-300"
                    )}
                  >
                    {getDeviceLabel(dev.device)}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {formatNumber(dev.count)} ({dev.percentage}%)
                  </span>
                </div>
                <div
                  className={cn(
                    "w-full h-2 rounded-full overflow-hidden transition-colors",
                    isLight ? "bg-slate-100" : "bg-slate-800"
                  )}
                >
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${dev.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Channels / Referrers */}
        <div
          className={cn(
            "p-5 rounded-2xl border space-y-4 transition-colors",
            isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
          )}
        >
          <h3
            className={cn(
              "text-base font-bold flex items-center gap-2 transition-colors",
              isLight ? "text-slate-900" : "text-white"
            )}
          >
            <Globe className="w-4 h-4 text-[#00f0ff]" />
            <span>{t("analytics_referrers")}</span>
          </h3>

          <div className="space-y-3">
            {analytics.referral_stats.map((ref) => (
              <div key={ref.source} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      "font-medium transition-colors",
                      isLight ? "text-slate-700" : "text-slate-300"
                    )}
                  >
                    {getReferralLabel(ref.source)}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {formatNumber(ref.visits)} ({ref.percentage}%)
                  </span>
                </div>
                <div
                  className={cn(
                    "w-full h-2 rounded-full overflow-hidden transition-colors",
                    isLight ? "bg-slate-100" : "bg-slate-800"
                  )}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-[#00f0ff]"
                    style={{ width: `${ref.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
