-- =========================================================
-- SENDLINK DATABASE SCHEMA FOR SUPABASE POSTGRESQL
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    verified BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT TRUE,
    font_family TEXT DEFAULT 'Space Grotesk',
    views_count INTEGER DEFAULT 0,
    theme_config JSONB DEFAULT '{
      "theme_id": "cyberpunk",
      "name": "Cyberpunk Neon",
      "mode": "dark",
      "background_type": "gradient",
      "background_value": "linear-gradient(135deg, #070b12 0%, #0d1527 50%, #06101e 100%)",
      "accent_color": "#00ff88",
      "button_style": "neon-glow",
      "card_style": "glass",
      "border_radius": "lg",
      "font_family": "Space Grotesk"
    }'::jsonb,
    plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'vip')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. LINKS TABLE
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_highlighted BOOLEAN DEFAULT FALSE,
    click_count INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    category TEXT DEFAULT 'General',
    scheduled_start TIMESTAMP WITH TIME ZONE,
    scheduled_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_links_profile_id ON public.links(profile_id);
CREATE INDEX IF NOT EXISTS idx_links_display_order ON public.links(display_order);

-- 3. SOCIAL ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_socials_profile_id ON public.social_accounts(profile_id);

-- 4. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    link_id UUID REFERENCES public.links(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'link_click')),
    device_type TEXT DEFAULT 'desktop' CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
    referrer TEXT DEFAULT 'direct',
    country TEXT DEFAULT 'unknown',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_profile_id ON public.analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);

-- 5. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_tier TEXT DEFAULT 'free' CHECK (plan_tier IN ('free', 'pro', 'vip')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled')),
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, only owners can update/insert
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Links: Anyone can read active links, owners can manage all
CREATE POLICY "Public links are viewable by everyone."
  ON public.links FOR SELECT USING (
    is_active = true OR auth.uid() = profile_id
  );

CREATE POLICY "Users can manage their own links."
  ON public.links FOR ALL USING (auth.uid() = profile_id);

-- Social Accounts: Public viewable, owner manageable
CREATE POLICY "Public socials are viewable by everyone."
  ON public.social_accounts FOR SELECT USING (
    is_active = true OR auth.uid() = profile_id
  );

CREATE POLICY "Users can manage their own social accounts."
  ON public.social_accounts FOR ALL USING (auth.uid() = profile_id);

-- Analytics: Anyone can insert (track visits/clicks), only owner can read stats
CREATE POLICY "Anyone can record analytics events."
  ON public.analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view analytics for their own profile."
  ON public.analytics_events FOR SELECT USING (auth.uid() = profile_id);

-- Subscriptions: Users can view their own subscription
CREATE POLICY "Users can view their own subscription."
  ON public.subscriptions FOR SELECT USING (auth.uid() = profile_id);

-- =========================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- =========================================================

-- Trigger to create a profile automatically when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Atomic increment for profile views
CREATE OR REPLACE FUNCTION increment_profile_views(target_profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET views_count = views_count + 1
  WHERE id = target_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic increment for link clicks
CREATE OR REPLACE FUNCTION increment_link_clicks(target_link_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE id = target_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
