export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "twitter" // X
  | "discord"
  | "whatsapp"
  | "telegram"
  | "github"
  | "twitch"
  | "spotify"
  | "linkedin"
  | "email";

export type BackgroundType = "solid" | "gradient" | "mesh" | "radial" | "image";
export type ButtonStyle = "neon-glow" | "glass" | "solid-pill" | "outline" | "minimal";
export type CardStyle = "glass" | "solid" | "bordered";
export type BorderRadius = "sm" | "md" | "lg" | "full";

export interface ThemeConfig {
  theme_id: string;
  name: string;
  mode: "dark" | "light";
  background_type: BackgroundType;
  background_value: string;
  accent_color: string;
  button_style: ButtonStyle;
  card_style: CardStyle;
  border_radius: BorderRadius;
  font_family: string;
  hide_branding?: boolean;
  custom_css?: string;
}

export type LanguageCode = "en" | "id" | "ja" | "es" | "ar" | "fr";

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  verified: boolean;
  is_online: boolean;
  font_family: string;
  views_count: number;
  theme_config: ThemeConfig;
  plan_tier: "free" | "pro" | "vip";
  language?: LanguageCode;
  created_at?: string;
  updated_at?: string;
}

export interface LinkItem {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  thumbnail_url?: string;
  is_active: boolean;
  is_highlighted: boolean;
  click_count: number;
  display_order: number;
  category?: string;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SocialAccount {
  id: string;
  profile_id: string;
  platform: SocialPlatform;
  url: string;
  is_active: boolean;
  display_order: number;
}

export interface AnalyticsEvent {
  id: string;
  profile_id: string;
  link_id?: string | null;
  event_type: "profile_view" | "link_click";
  device_type: "mobile" | "desktop" | "tablet";
  referrer?: string;
  country?: string;
  created_at: string;
}

export interface TopLinkStat {
  id: string;
  title: string;
  url: string;
  clicks: number;
  ctr: number;
}

export interface DailyStat {
  date: string;
  views: number;
  clicks: number;
}

export interface DeviceStat {
  device: "Mobile" | "Desktop" | "Tablet";
  percentage: number;
  count: number;
}

export interface ReferralStat {
  source: string;
  visits: number;
  percentage: number;
}

export interface ActivityItem {
  id: string;
  type: "view" | "click";
  title: string;
  location?: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  total_views: number;
  total_clicks: number;
  ctr: number;
  active_links_count: number;
  top_links: TopLinkStat[];
  daily_stats: DailyStat[];
  device_stats: DeviceStat[];
  referral_stats: ReferralStat[];
  recent_activity: ActivityItem[];
}
