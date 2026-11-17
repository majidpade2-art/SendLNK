import React from "react";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";
import {
  YouTubeIcon,
  GitHubIcon,
  XTwitterIcon,
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
  TikTokIcon,
  DiscordIcon,
  SpotifyIcon,
  TwitchIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "./SocialBrandIcons";

interface IconRendererProps extends LucideProps {
  name?: string;
  fallback?: React.ComponentType<LucideProps>;
}

export function IconRenderer({
  name,
  fallback = Icons.Link,
  className = "w-5 h-5",
  ...props
}: IconRendererProps) {
  if (!name) {
    const Fallback = fallback;
    return <Fallback className={className} {...props} />;
  }

  const cleanName = name.trim().toLowerCase();

  // Custom brand icon mappings
  switch (cleanName) {
    case "youtube":
      return <YouTubeIcon className={className} />;
    case "github":
      return <GitHubIcon className={className} />;
    case "twitter":
    case "x":
      return <XTwitterIcon className={className} />;
    case "instagram":
      return <InstagramIcon className={className} />;
    case "facebook":
      return <FacebookIcon className={className} />;
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "tiktok":
      return <TikTokIcon className={className} />;
    case "discord":
      return <DiscordIcon className={className} />;
    case "spotify":
      return <SpotifyIcon className={className} />;
    case "twitch":
      return <TwitchIcon className={className} />;
    case "telegram":
      return <TelegramIcon className={className} />;
    case "whatsapp":
      return <WhatsAppIcon className={className} />;
  }

  // Lookup in Lucide
  const exactName = name.trim();
  const allIcons = Icons as unknown as Record<string, React.ComponentType<LucideProps>>;

  if (allIcons[exactName]) {
    const Component = allIcons[exactName];
    return <Component className={className} {...props} />;
  }

  // Case-insensitive lookup in Lucide
  const matchedKey = Object.keys(Icons).find(
    (k) => k.toLowerCase() === cleanName
  );
  if (matchedKey && allIcons[matchedKey]) {
    const Component = allIcons[matchedKey];
    return <Component className={className} {...props} />;
  }

  const Fallback = fallback;
  return <Fallback className={className} {...props} />;
}
