"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  UserProfile,
  LinkItem,
  SocialAccount,
  AnalyticsSummary,
  ThemeConfig,
  LanguageCode,
} from "@/types";
import {
  INITIAL_USER,
  INITIAL_LINKS,
  INITIAL_SOCIALS,
  INITIAL_ANALYTICS,
} from "@/lib/mockData";
import { PRESET_THEMES } from "@/lib/constants/themes";
import { notify } from "@/lib/toast";
import { TranslationKey, getTranslation, SUPPORTED_LANGUAGES } from "@/lib/i18n";

interface AppContextType {
  user: UserProfile;
  links: LinkItem[];
  socials: SocialAccount[];
  analytics: AnalyticsSummary;
  isAuthenticated: boolean;
  isLoading: boolean;
  activeCategory: string;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  uiTheme: "light" | "dark";
  setUiTheme: (theme: "light" | "dark") => void;
  toggleUiTheme: () => void;
  t: (key: TranslationKey) => string;
  setActiveCategory: (cat: string) => void;
  // Link Operations
  addLink: (newLink: Omit<LinkItem, "id" | "profile_id" | "click_count" | "display_order" | "created_at" | "updated_at">) => void;
  updateLink: (id: string, updates: Partial<LinkItem>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (reordered: LinkItem[]) => void;
  toggleLinkStatus: (id: string) => void;
  toggleHighlight: (id: string) => void;
  // Profile & Theme Operations
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  updateSocials: (updatedSocials: SocialAccount[]) => void;
  // Analytics
  recordProfileView: () => void;
  recordLinkClick: (linkId: string) => void;
  // Auth simulation / operations
  loginUser: (email?: string) => void;
  logout: (redirectTo?: string) => void;
  resetToDefaults: (silent?: boolean | unknown) => void;
}

const STORAGE_KEY = "majidspace_data_v1";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  const [socials, setSocials] = useState<SocialAccount[]>(INITIAL_SOCIALS);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(INITIAL_ANALYTICS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [language, setLanguageState] = useState<LanguageCode>("id");
  const [uiTheme, setUiThemeState] = useState<"light" | "dark">("light");

  const t = (key: TranslationKey) => getTranslation(language, key);

  const toggleUiTheme = () => {
    const next = uiTheme === "light" ? "dark" : "light";
    setUiThemeState(next);
    notify.success(
      next === "light"
        ? (language === "id" ? "Beralih ke Mode Terang (Light Mode) ☀️" : "Switched to Light Mode ☀️")
        : (language === "id" ? "Beralih ke Mode Gelap (Dark Mode) 🌙" : "Switched to Dark Mode 🌙"),
      "theme-toggle"
    );
  };

  const setUiTheme = (mode: "light" | "dark") => {
    setUiThemeState(mode);
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setUser((prev) => ({ ...prev, language: lang }));
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("majidspace_lang", lang);
      } catch (e) {
        console.error("Failed to save language preference", e);
      }
    }
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    const msg =
      lang === "id"
        ? "Bahasa berhasil diubah ke Bahasa Indonesia!"
        : `Language switched to ${langObj?.name || lang}!`;
    notify.success(msg, "lang-switch");
  };

  // Load from local storage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedLang = localStorage.getItem("majidspace_lang") as LanguageCode | null;
        if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
          setLanguageState(savedLang);
        } else {
          setLanguageState("id"); // default to Indonesian as requested
        }

        const savedTheme = localStorage.getItem("majidspace_ui_theme") as "light" | "dark" | null;
        if (savedTheme === "dark" || savedTheme === "light") {
          setUiThemeState(savedTheme);
        } else {
          setUiThemeState("light"); // default to light as requested
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.user) {
            if (!parsed.user.avatar_url || parsed.user.avatar_url.includes("unsplash")) {
              parsed.user.avatar_url = "/avatar.png";
            }
            if (parsed.user.theme_config && (parsed.user.theme_config.accent_color === "#00ff88" || !parsed.user.theme_config.accent_color)) {
              parsed.user.theme_config.accent_color = "#10b981";
            }
            if (parsed.user.theme_config) {
              const preset = parsed.user.theme_config.theme_id
                ? PRESET_THEMES[parsed.user.theme_config.theme_id]
                : null;
              if (preset) {
                // If the user's theme is cyberpunk (the previous dark default), switch it to pearl_white (light)!
                if (parsed.user.theme_config.theme_id === "cyberpunk") {
                  parsed.user.theme_config = { ...PRESET_THEMES.pearl_white };
                } else {
                  parsed.user.theme_config.mode = preset.mode;
                  if (!parsed.user.theme_config.background_type) {
                    parsed.user.theme_config.background_type = preset.background_type;
                  }
                  if (!parsed.user.theme_config.background_value) {
                    parsed.user.theme_config.background_value = preset.background_value;
                  }
                }
              } else if (!parsed.user.theme_config.mode) {
                const inferred =
                  typeof parsed.user.theme_config.background_value === "string" &&
                  (parsed.user.theme_config.background_value.includes("#fa") || parsed.user.theme_config.background_value.includes("#ff"))
                    ? "light"
                    : "dark";
                parsed.user.theme_config.mode = inferred;
              }
            }
            if (!savedLang && parsed.user.language) {
              setLanguageState(parsed.user.language);
            }
            setUser(parsed.user);
          }
          if (parsed.links) setLinks(parsed.links);
          if (parsed.socials) setSocials(parsed.socials);
          if (parsed.analytics) setAnalytics(parsed.analytics);
        }

        // Validate active session
        if (typeof window !== "undefined") {
          const hasAuthCookie = document.cookie.includes("app_auth=true");
          const sessionEmail = localStorage.getItem("sendlnk_session_email");
          setIsAuthenticated(Boolean(hasAuthCookie && sessionEmail));
        }
      } catch (e) {
        console.error("Failed to parse saved state", e);
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", uiTheme);
      if (uiTheme === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
      try {
        localStorage.setItem("majidspace_ui_theme", uiTheme);
      } catch (e) {
        console.error("Failed to save theme mode", e);
      }
    }
  }, [uiTheme]);

  // Save to local storage on changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user, links, socials, analytics })
        );
      } catch (e) {
        console.error("Failed to save state", e);
      }
    }
  }, [user, links, socials, analytics, isLoading]);

  const addLink = (
    newLinkData: Omit<LinkItem, "id" | "profile_id" | "click_count" | "display_order" | "created_at" | "updated_at">
  ) => {
    const newLink: LinkItem = {
      ...newLinkData,
      id: `link_${Date.now()}`,
      profile_id: user.id,
      click_count: 0,
      display_order: links.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newLink, ...links];
    setLinks(updated);
    setAnalytics((prev) => ({
      ...prev,
      active_links_count: updated.filter((l) => l.is_active).length,
    }));

    // Sync with backend API
    if (typeof window !== "undefined") {
      fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      }).catch((e) => console.error("API link create sync failed", e));
    }

    notify.success("Link added successfully!", "link-add");
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id ? { ...link, ...updates, updated_at: new Date().toISOString() } : link
      )
    );

    // Sync with backend API
    if (typeof window !== "undefined") {
      fetch("/api/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      }).catch((e) => console.error("API link update sync failed", e));
    }

    notify.success("Link updated successfully!", `link-update-${id}`);
  };

  const deleteLink = (id: string) => {
    const target = links.find((l) => l.id === id);
    setLinks((prev) => prev.filter((link) => link.id !== id));
    setAnalytics((prev) => ({
      ...prev,
      active_links_count: Math.max(0, prev.active_links_count - (target?.is_active ? 1 : 0)),
    }));

    // Sync with backend API
    if (typeof window !== "undefined") {
      fetch(`/api/links?id=${id}`, {
        method: "DELETE",
      }).catch((e) => console.error("API link delete sync failed", e));
    }

    notify.success("Link deleted!", `link-del-${id}`);
  };

  const reorderLinks = (reordered: LinkItem[]) => {
    const updated = reordered.map((item, index) => ({
      ...item,
      display_order: index + 1,
    }));
    setLinks(updated);
  };

  const toggleLinkStatus = (id: string) => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === id) {
          const newState = !link.is_active;
          notify.info(newState ? "Link enabled" : "Link hidden", `link-toggle-${id}`);
          return { ...link, is_active: newState };
        }
        return link;
      })
    );
  };

  const toggleHighlight = (id: string) => {
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === id) {
          const newState = !link.is_highlighted;
          notify.info(newState ? "Link highlighted" : "Highlight removed", `link-hl-${id}`);
          return { ...link, is_highlighted: newState };
        }
        return link;
      })
    );
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updates, updated_at: new Date().toISOString() };
      if (updates.font_family) {
        nextUser.theme_config = {
          ...nextUser.theme_config,
          font_family: updates.font_family,
        };
      }
      return nextUser;
    });

    // Sync with backend API
    if (typeof window !== "undefined") {
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          ...updates,
          ...(updates.font_family ? { theme_config: { ...user.theme_config, font_family: updates.font_family } } : {}),
        }),
      }).catch((e) => console.error("API profile sync failed", e));
    }

    notify.success("Profile updated successfully!", "profile-save");
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setUser((prev) => {
      const nextUser = {
        ...prev,
        theme_config: { ...prev.theme_config, ...updates },
        updated_at: new Date().toISOString(),
      };
      if (updates.font_family) {
        nextUser.font_family = updates.font_family;
      }
      return nextUser;
    });

    // Sync theme updates with backend API
    if (typeof window !== "undefined") {
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          theme_config: updates,
          ...(updates.font_family ? { font_family: updates.font_family } : {}),
        }),
      }).catch((e) => console.error("API theme sync failed", e));
    }

    notify.success("Theme settings saved!", "theme-save");
  };

  const updateSocials = (updatedSocials: SocialAccount[]) => {
    setSocials(updatedSocials);

    // Sync socials with backend API
    if (typeof window !== "undefined") {
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          username: user.username,
          socials: updatedSocials,
        }),
      }).catch((e) => console.error("API socials sync failed", e));
    }

    notify.success("Social media channels saved!", "socials-save");
  };

  const recordProfileView = () => {
    setUser((prev) => ({ ...prev, views_count: prev.views_count + 1 }));

    // Dispatches real asynchronous telemetry view event to backend API
    if (typeof window !== "undefined") {
      fetch("/api/analytics/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: user.id,
          referrer: document.referrer || "direct",
          device_type: window.innerWidth < 768 ? "mobile" : "desktop",
        }),
      }).catch((e) => console.error("Analytics view sync failed", e));
    }

    setAnalytics((prev) => {
      const newTotal = prev.total_views + 1;
      const ctr = Number(((prev.total_clicks / newTotal) * 100).toFixed(1));
      return {
        ...prev,
        total_views: newTotal,
        ctr,
        recent_activity: [
          {
            id: `act_${Date.now()}`,
            type: "view",
            title: "Public profile viewed",
            location: "Direct visit",
            timestamp: "Just now",
          },
          ...prev.recent_activity.slice(0, 9),
        ],
      };
    });
  };

  const recordLinkClick = (linkId: string) => {
    let clickedTitle = "Link";
    setLinks((prev) =>
      prev.map((link) => {
        if (link.id === linkId) {
          clickedTitle = link.title;
          return { ...link, click_count: link.click_count + 1 };
        }
        return link;
      })
    );

    // Dispatches real asynchronous telemetry click event to backend API
    if (typeof window !== "undefined") {
      fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          link_id: linkId,
          profile_id: user.id,
        }),
      }).catch((e) => console.error("Analytics click sync failed", e));
    }

    setAnalytics((prev) => {
      const newTotalClicks = prev.total_clicks + 1;
      const ctr = Number(((newTotalClicks / prev.total_views) * 100).toFixed(1));
      return {
        ...prev,
        total_clicks: newTotalClicks,
        ctr,
        recent_activity: [
          {
            id: `act_${Date.now()}`,
            type: "click",
            title: `Clicked "${clickedTitle.replace(/^[^\w\s]+/, "").trim()}"`,
            location: "Browser visit",
            timestamp: "Just now",
          },
          ...prev.recent_activity.slice(0, 9),
        ],
      };
    });
  };

  const loginUser = (email?: string) => {
    setIsAuthenticated(true);
    if (typeof document !== "undefined") {
      document.cookie = "app_auth=true; path=/; max-age=604800; SameSite=Lax";
    }
    if (email && typeof localStorage !== "undefined") {
      localStorage.setItem("sendlnk_session_email", email.trim().toLowerCase());
    }
  };

  const logout = (redirectTo: string = "/auth/login") => {
    setIsAuthenticated(false);
    if (typeof document !== "undefined") {
      document.cookie = "app_auth=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "demo_user=; path=/; max-age=0";
    }
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("sendlnk_session_email");
    }
    notify.info(
      language === "id" ? "Berhasil keluar dari akun" : "Logged out successfully",
      "auth-logout"
    );
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
  };

  const resetToDefaults = (silent?: boolean | unknown) => {
    setUser(INITIAL_USER);
    setLinks(INITIAL_LINKS);
    setSocials(INITIAL_SOCIALS);
    setAnalytics(INITIAL_ANALYTICS);
    localStorage.removeItem(STORAGE_KEY);
    if (silent !== true) {
      notify.success(
        language === "id" ? "Data berhasil direset ke setelan awal!" : "Reset data to default profile!",
        "reset-defaults"
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        links,
        socials,
        analytics,
        isAuthenticated,
        isLoading,
        activeCategory,
        language,
        setLanguage,
        uiTheme,
        setUiTheme,
        toggleUiTheme,
        t,
        setActiveCategory,
        addLink,
        updateLink,
        deleteLink,
        reorderLinks,
        toggleLinkStatus,
        toggleHighlight,
        updateProfile,
        updateTheme,
        updateSocials,
        recordProfileView,
        recordLinkClick,
        loginUser,
        logout,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
