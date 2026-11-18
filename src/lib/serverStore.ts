import fs from "fs";
import path from "path";
import { UserProfile, LinkItem, SocialAccount, AnalyticsSummary } from "@/types";
import { PRESET_THEMES } from "./constants/themes";
import {
  INITIAL_USER,
  INITIAL_LINKS,
  INITIAL_SOCIALS,
  INITIAL_ANALYTICS,
} from "./mockData";

export interface ServerAccount {
  email: string;
  password: string;
  username: string;
  displayName: string;
  createdAt: string;
}

export interface DatabaseSchema {
  profiles: UserProfile[];
  links: LinkItem[];
  socials: SocialAccount[];
  analytics: AnalyticsSummary;
  accounts?: ServerAccount[];
}

const DEFAULT_SERVER_ACCOUNTS: ServerAccount[] = [
  {
    email: "user@sendlnk.com",
    password: "password123",
    username: "sendlink",
    displayName: "SendLNK User",
    createdAt: new Date().toISOString(),
  },
  {
    email: "admin@sendlnk.com",
    password: "admin123",
    username: "admin",
    displayName: "Administrator",
    createdAt: new Date().toISOString(),
  },
];

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "store.json");

function getInitialDatabase(): DatabaseSchema {
  return {
    profiles: [
      INITIAL_USER,
      {
        ...INITIAL_USER,
        id: "usr_demo_jid",
        username: "jid",
        display_name: "Mazy",
        bio: "Creative Technologist & AI Architect. Crafting next-gen web systems, cyberpunk aesthetics, and intelligent workflows. ✨",
      },
    ],
    links: [...INITIAL_LINKS],
    socials: [...INITIAL_SOCIALS],
    analytics: { ...INITIAL_ANALYTICS },
    accounts: [...DEFAULT_SERVER_ACCOUNTS],
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }

    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content) as DatabaseSchema;
    if (!parsed.profiles || !Array.isArray(parsed.profiles)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    return parsed;
  } catch (error) {
    console.error("Error reading database store.json:", error);
    return getInitialDatabase();
  }
}

function saveDatabase(db: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database store.json:", error);
  }
}

// ==========================================
// PROFILE API
// ==========================================

export function getProfileByUsername(username: string): UserProfile | null {
  const db = loadDatabase();
  const normalized = username.toLowerCase().trim();
  const profile = db.profiles.find(
    (p) => p.username.toLowerCase().trim() === normalized
  );
  return profile || null;
}

export function getDefaultProfile(): UserProfile {
  const db = loadDatabase();
  return db.profiles[0] || INITIAL_USER;
}

export function saveOrUpdateProfile(
  updates: Partial<UserProfile> & { socials?: SocialAccount[] }
): UserProfile {
  const db = loadDatabase();
  if (updates.socials && Array.isArray(updates.socials)) {
    db.socials = updates.socials;
  }
  const { socials: _s, ...profileUpdates } = updates;
  void _s;

  const username = profileUpdates.username
    ? profileUpdates.username.toLowerCase().trim()
    : db.profiles[0]?.username || "majid";

  const existingIdx = db.profiles.findIndex(
    (p) =>
      p.username.toLowerCase().trim() === username ||
      (profileUpdates.id && p.id === profileUpdates.id)
  );

  const updatedTimestamp = new Date().toISOString();

  if (existingIdx >= 0) {
    const existing = db.profiles[existingIdx];
    const incomingTheme = profileUpdates.theme_config;
    let mergedTheme = existing.theme_config;

    if (incomingTheme) {
      const inferredMode =
        incomingTheme.mode ||
        (incomingTheme.theme_id ? PRESET_THEMES[incomingTheme.theme_id]?.mode : undefined) ||
        existing.theme_config?.mode ||
        "dark";

      mergedTheme = {
        ...existing.theme_config,
        ...incomingTheme,
        mode: inferredMode,
      };
    }

    const updated = {
      ...existing,
      ...profileUpdates,
      theme_config: mergedTheme,
      updated_at: updatedTimestamp,
    };
    db.profiles[existingIdx] = updated;
    saveDatabase(db);
    return updated;
  } else {
    const newProfile: UserProfile = {
      ...INITIAL_USER,
      ...profileUpdates,
      id: profileUpdates.id || `usr_${Date.now()}`,
      username: username,
      created_at: updatedTimestamp,
      updated_at: updatedTimestamp,
    };
    db.profiles.push(newProfile);
    saveDatabase(db);
    return newProfile;
  }
}

// ==========================================
// LINKS API
// ==========================================

export function getLinksByProfileId(profileId?: string): LinkItem[] {
  const db = loadDatabase();
  if (!profileId) {
    return db.links.sort((a, b) => a.display_order - b.display_order);
  }
  return db.links
    .filter((l) => l.profile_id === profileId)
    .sort((a, b) => a.display_order - b.display_order);
}

export function addLinkItem(item: Omit<LinkItem, "id" | "created_at"> & { id?: string }): LinkItem {
  const db = loadDatabase();
  const newLink: LinkItem = {
    ...item,
    id: item.id || `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    display_order: item.display_order ?? db.links.length + 1,
    click_count: item.click_count ?? 0,
    is_active: item.is_active ?? true,
    is_highlighted: item.is_highlighted ?? false,
    created_at: new Date().toISOString(),
  };

  db.links.unshift(newLink);
  saveDatabase(db);
  return newLink;
}

export function updateLinkItem(id: string, updates: Partial<LinkItem>): LinkItem | null {
  const db = loadDatabase();
  const index = db.links.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const updated: LinkItem = {
    ...db.links[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  db.links[index] = updated;
  saveDatabase(db);
  return updated;
}

export function deleteLinkItem(id: string): boolean {
  const db = loadDatabase();
  const beforeLen = db.links.length;
  db.links = db.links.filter((l) => l.id !== id);
  if (db.links.length !== beforeLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ==========================================
// SOCIALS API
// ==========================================

export function getSocialsByProfileId(profileId?: string): SocialAccount[] {
  const db = loadDatabase();
  if (!profileId) return db.socials;
  return db.socials.filter((s) => s.profile_id === profileId);
}

export function updateSocialsList(updatedSocials: SocialAccount[]): SocialAccount[] {
  const db = loadDatabase();
  db.socials = updatedSocials;
  saveDatabase(db);
  return db.socials;
}

// ==========================================
// ANALYTICS API
// ==========================================

export function getAnalyticsSummary(): AnalyticsSummary {
  const db = loadDatabase();
  return db.analytics;
}

export function incrementViewCount(usernameOrId?: string): number {
  const db = loadDatabase();
  db.analytics.total_views = (db.analytics.total_views || 0) + 1;
  const today = new Date().toISOString().split("T")[0];
  const todayStat = db.analytics.daily_stats.find((d) => d.date === today);
  if (todayStat) {
    todayStat.views += 1;
  } else if (db.analytics.daily_stats.length > 0) {
    db.analytics.daily_stats[db.analytics.daily_stats.length - 1].views += 1;
  }

  if (usernameOrId) {
    const profile = db.profiles.find(
      (p) => p.username === usernameOrId || p.id === usernameOrId
    );
    if (profile) {
      profile.views_count = (profile.views_count || 0) + 1;
    }
  }

  saveDatabase(db);
  return db.analytics.total_views;
}

export function incrementLinkClick(linkId: string): number {
  const db = loadDatabase();
  db.analytics.total_clicks = (db.analytics.total_clicks || 0) + 1;
  const link = db.links.find((l) => l.id === linkId);
  let linkClicks = 0;
  if (link) {
    link.click_count = (link.click_count || 0) + 1;
    linkClicks = link.click_count;
  }

  const today = new Date().toISOString().split("T")[0];
  const todayStat = db.analytics.daily_stats.find((d) => d.date === today);
  if (todayStat) {
    todayStat.clicks += 1;
  } else if (db.analytics.daily_stats.length > 0) {
    db.analytics.daily_stats[db.analytics.daily_stats.length - 1].clicks += 1;
  }

  saveDatabase(db);
  return linkClicks;
}

// ==========================================
// CENTRALIZED AUTHENTICATION API
// ==========================================

export function getServerAccounts(): ServerAccount[] {
  const db = loadDatabase();
  if (!db.accounts || !Array.isArray(db.accounts)) {
    db.accounts = [...DEFAULT_SERVER_ACCOUNTS];
    saveDatabase(db);
  }
  return db.accounts;
}

export function registerServerAccount(account: ServerAccount): {
  success: boolean;
  message: string;
  account?: ServerAccount;
} {
  const db = loadDatabase();
  if (!db.accounts || !Array.isArray(db.accounts)) {
    db.accounts = [...DEFAULT_SERVER_ACCOUNTS];
  }

  const cleanEmail = account.email.trim().toLowerCase();
  const exists = db.accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (exists) {
    return {
      success: false,
      message: "Email ini sudah terdaftar di server. Silakan masuk.",
    };
  }

  const newAccount: ServerAccount = {
    ...account,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
  };

  db.accounts.push(newAccount);
  saveDatabase(db);

  return {
    success: true,
    message: "Akun berhasil didaftarkan di server!",
    account: newAccount,
  };
}

export function verifyServerCredentials(
  email: string,
  pass: string
): { success: boolean; message: string; account?: ServerAccount } {
  const accounts = getServerAccounts();
  const cleanEmail = email.trim().toLowerCase();
  const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!found) {
    return {
      success: false,
      message: "Email belum terdaftar. Silakan buat akun baru terlebih dahulu.",
    };
  }

  if (found.password !== pass) {
    return {
      success: false,
      message: "Kata sandi salah. Silakan coba lagi.",
    };
  }

  return {
    success: true,
    message: "Login berhasil!",
    account: found,
  };
}
