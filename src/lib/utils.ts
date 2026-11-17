import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

export function truncateUrl(url: string, maxLength: number = 35): string {
  try {
    const parsed = new URL(url);
    const domainAndPath = parsed.hostname + (parsed.pathname !== "/" ? parsed.pathname : "");
    if (domainAndPath.length > maxLength) {
      return domainAndPath.substring(0, maxLength) + "...";
    }
    return domainAndPath;
  } catch {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  }
}
