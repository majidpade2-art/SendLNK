"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PhonePreviewFrame } from "@/components/dashboard/PhonePreviewFrame";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const { user, links, socials, uiTheme, t } = useApp();
  const isLight = uiTheme === "light";
  const pathname = usePathname();

  // Page title mapping
  const getPageInfo = () => {
    if (pathname.includes("/profile")) {
      return { title: t("layout_profile_title"), subtitle: t("layout_profile_sub") };
    }
    if (pathname.includes("/links")) {
      return { title: t("layout_links_title"), subtitle: t("layout_links_sub") };
    }
    if (pathname.includes("/socials")) {
      return { title: t("layout_socials_title"), subtitle: t("layout_socials_sub") };
    }
    if (pathname.includes("/appearance")) {
      return { title: t("layout_appearance_title"), subtitle: t("layout_appearance_sub") };
    }
    if (pathname.includes("/analytics")) {
      return { title: t("layout_analytics_title"), subtitle: t("layout_analytics_sub") };
    }
    if (pathname.includes("/settings")) {
      return { title: t("layout_settings_title"), subtitle: t("layout_settings_sub") };
    }
    return { title: t("layout_overview_title"), subtitle: t("layout_overview_sub") };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div
      className={cn(
        "flex h-screen w-screen overflow-hidden transition-colors",
        isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#07090e] text-slate-100"
      )}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0 h-full">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <DashboardSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace (Header + Active Content + Live Phone Frame) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <DashboardHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onToggleMobilePreview={() => setMobilePreviewOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        {/* Center Content & Right Phone Preview Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Active Tab Content (Scrollable) */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">{children}</div>
          </main>

          {/* Desktop Right Side Phone Preview Frame */}
          <aside
            className={cn(
              "hidden xl:flex w-[400px] shrink-0 h-full items-center justify-center p-6 border-l overflow-y-auto no-scrollbar transition-colors",
              isLight
                ? "border-slate-200 bg-slate-50/70"
                : "border-slate-800/80 bg-[#080c14]/40"
            )}
          >
            <PhonePreviewFrame user={user} links={links} socials={socials} />
          </aside>
        </div>
      </div>

      {/* Mobile / Tablet Live Preview Modal */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 xl:hidden bg-black/80 backdrop-blur-md">
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => setMobilePreviewOpen(false)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-slate-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <PhonePreviewFrame user={user} links={links} socials={socials} />
          </div>
        </div>
      )}
    </div>
  );
}
