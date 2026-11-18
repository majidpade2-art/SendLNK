"use client";

import React, { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PhonePreviewFrame } from "@/components/dashboard/PhonePreviewFrame";
import { useApp } from "@/context/AppContext";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const { user, links, socials, isAuthenticated, isLoading, uiTheme, t } = useApp();
  const isLight = uiTheme === "light";
  const pathname = usePathname();
  const router = useRouter();

  // Authentication Guard: require login / registered account before accessing dashboard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

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

  if (isLoading || !isAuthenticated) {
    return (
      <div
        className={cn(
          "min-h-screen w-full flex items-center justify-center transition-colors",
          isLight ? "bg-[#f8fafc] text-slate-900" : "bg-[#07090e] text-slate-100"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-slate-400">
            MEMERIKSA AUTENTIKASI...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-screen w-full max-w-[100vw] overflow-x-hidden transition-colors",
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
      <div className="flex-1 flex flex-col h-full min-w-0 w-full overflow-hidden">
        <DashboardHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onToggleMobilePreview={() => setMobilePreviewOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        {/* Center Content & Right Phone Preview Container */}
        <div className="flex-1 flex overflow-hidden min-w-0 w-full">
          {/* Active Tab Content (Scrollable) */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 min-w-0 w-full">
            <div className="max-w-4xl mx-auto w-full">{children}</div>
          </main>

          {/* Desktop Right Side Phone Preview Frame */}
          <aside
            data-desktop-preview="true"
            className={cn(
              "desktop-phone-aside hidden xl:flex xl:w-[400px] shrink-0 h-full items-center justify-center p-6 border-l overflow-y-auto no-scrollbar transition-colors",
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
