"use client";

import React, { useState, useMemo } from "react";
import { IconRenderer } from "./IconRenderer";
import { Search, X, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconItem {
  name: string;
  label: string;
  category: "popular" | "social" | "media" | "commerce" | "general";
  keywords: string[];
}

export const CURATED_ICONS: IconItem[] = [
  // --- Populer & Utama ---
  { name: "Globe", label: "Website", category: "popular", keywords: ["web", "situs", "url", "internet", "link"] },
  { name: "Youtube", label: "YouTube", category: "popular", keywords: ["video", "yt", "channel", "vlog", "stream"] },
  { name: "Tiktok", label: "TikTok", category: "popular", keywords: ["vt", "fy", "fyp", "short", "video", "dance"] },
  { name: "Instagram", label: "Instagram", category: "popular", keywords: ["ig", "foto", "feed", "reels", "story"] },
  { name: "Twitter", label: "X / Twitter", category: "popular", keywords: ["x", "cuit", "tweet", "post"] },
  { name: "WhatsApp", label: "WhatsApp", category: "popular", keywords: ["wa", "chat", "pesan", "kontak", "direct"] },
  { name: "Discord", label: "Discord", category: "popular", keywords: ["komunitas", "server", "gamer", "voice"] },
  { name: "Spotify", label: "Spotify", category: "popular", keywords: ["lagu", "musik", "playlist", "audio"] },
  { name: "Github", label: "GitHub", category: "popular", keywords: ["repo", "kode", "code", "dev", "program"] },
  { name: "DollarSign", label: "Saweria / Donasi", category: "popular", keywords: ["uang", "saweria", "donasi", "tip", "cuan", "rupiah", "money"] },
  { name: "Link", label: "Tautan / Link", category: "popular", keywords: ["url", "web", "tautan"] },
  { name: "Mail", label: "Email", category: "popular", keywords: ["surat", "inbox", "kontak", "pesan"] },

  // --- Sosial & Chat ---
  { name: "Telegram", label: "Telegram", category: "social", keywords: ["tg", "channel", "grup", "chat"] },
  { name: "Facebook", label: "Facebook", category: "social", keywords: ["fb", "meta", "page"] },
  { name: "Linkedin", label: "LinkedIn", category: "social", keywords: ["karir", "pekerjaan", "profesional", "cv"] },
  { name: "Twitch", label: "Twitch", category: "social", keywords: ["stream", "live", "game", "gaming"] },
  { name: "Phone", label: "Telepon", category: "social", keywords: ["call", "nomor", "kontak", "hp"] },
  { name: "MessageSquare", label: "Pesan / Chat", category: "social", keywords: ["chat", "komentar", "diskusi"] },
  { name: "Send", label: "Kirim / DM", category: "social", keywords: ["dm", "pesan", "share"] },
  { name: "Share2", label: "Bagikan", category: "social", keywords: ["share", "sebar", "sosial"] },

  // --- Kreator, Media & Musik ---
  { name: "Music", label: "Musik", category: "media", keywords: ["lagu", "sound", "audio", "nada"] },
  { name: "Headphones", label: "Headphone", category: "media", keywords: ["audio", "listen", "dengar", "podcast"] },
  { name: "Podcast", label: "Podcast", category: "media", keywords: ["rekaman", "talkshow", "audio"] },
  { name: "Video", label: "Video", category: "media", keywords: ["film", "tonton", "movie", "cam"] },
  { name: "Camera", label: "Kamera", category: "media", keywords: ["foto", "potret", "fotografi", "lens"] },
  { name: "Mic", label: "Mikrofon", category: "media", keywords: ["suara", "sing", "vokal", "rekam"] },
  { name: "Radio", label: "Radio", category: "media", keywords: ["broadcast", "siaran", "fm"] },
  { name: "Play", label: "Putar / Play", category: "media", keywords: ["tonton", "start", "video"] },
  { name: "Film", label: "Film / Sinema", category: "media", keywords: ["movie", "layar", "bioskop"] },
  { name: "Tv", label: "Televisi", category: "media", keywords: ["layar", "tontonan", "broadcast"] },
  { name: "Gamepad2", label: "Game / Gaming", category: "media", keywords: ["game", "main", "play", "esport", "stream"] },

  // --- Toko, Finansial & Donasi ---
  { name: "ShoppingBag", label: "Tas Belanja", category: "commerce", keywords: ["toko", "shop", "beli", "produk", "jual", "olshop"] },
  { name: "ShoppingCart", label: "Keranjang", category: "commerce", keywords: ["cart", "order", "pesan", "checkout"] },
  { name: "Store", label: "Toko Fisik / Online", category: "commerce", keywords: ["toko", "warung", "lapak", "merchant"] },
  { name: "CreditCard", label: "Pembayaran / Kartu", category: "commerce", keywords: ["bayar", "rekening", "kartu", "pay"] },
  { name: "Wallet", label: "Dompet Digital", category: "commerce", keywords: ["ewallet", "dana", "gopay", "ovo", "saldo"] },
  { name: "Coffee", label: "Traktir Kopi / Trakteer", category: "commerce", keywords: ["kopi", "trakteer", "donasi", "tip", "saweria"] },
  { name: "Gift", label: "Hadiah / Giveaway", category: "commerce", keywords: ["kado", "bonus", "reward"] },
  { name: "HeartHandshake", label: "Dukungan / Charity", category: "commerce", keywords: ["bantu", "donasi", "amal", "peduli"] },
  { name: "Tag", label: "Promo / Diskon", category: "commerce", keywords: ["diskon", "kupon", "sale", "voucher"] },
  { name: "Briefcase", label: "Portofolio / Jasa", category: "commerce", keywords: ["kerja", "proyek", "bisnis", "layanan"] },

  // --- Umum & Kreatif ---
  { name: "Sparkles", label: "Spesial / Kilau", category: "general", keywords: ["kilau", "bintang", "ajaib", "magic", "unggulan"] },
  { name: "Flame", label: "Populer / Trending", category: "general", keywords: ["api", "hot", "terpopuler", "viral"] },
  { name: "Heart", label: "Favorit / Love", category: "general", keywords: ["suka", "love", "cinta", "favorit"] },
  { name: "Star", label: "Bintang / Review", category: "general", keywords: ["bintang", "rating", "top", "unggulan"] },
  { name: "Zap", label: "Kilat / Petir", category: "general", keywords: ["energi", "cepat", "fast", "flash"] },
  { name: "Award", label: "Penghargaan", category: "general", keywords: ["juara", "piala", "prestasi", "medali"] },
  { name: "BookOpen", label: "Buku / Bacaan", category: "general", keywords: ["baca", "artikel", "blog", "edukasi"] },
  { name: "FileText", label: "Dokumen / PDF", category: "general", keywords: ["berkas", "surat", "catatan", "cv", "resume"] },
  { name: "Code", label: "Kode Pemrograman", category: "general", keywords: ["source", "script", "coding", "web"] },
  { name: "Terminal", label: "Terminal / CLI", category: "general", keywords: ["konsol", "command", "bash"] },
  { name: "Palette", label: "Desain & Seni", category: "general", keywords: ["warna", "art", "desain", "kreatif"] },
  { name: "Download", label: "Unduhan / Download", category: "general", keywords: ["unduh", "file", "gratis"] },
  { name: "MapPin", label: "Lokasi / Alamat", category: "general", keywords: ["peta", "maps", "lokasi", "tempat"] },
  { name: "Calendar", label: "Kalender / Event", category: "general", keywords: ["jadwal", "acara", "tanggal"] },
  { name: "Clock", label: "Waktu / Jam", category: "general", keywords: ["jam", "jadwal", "durasi"] },
  { name: "Shield", label: "Keamanan / Verifikasi", category: "general", keywords: ["aman", "proteksi", "terpercaya"] },
  { name: "Smile", label: "Komunitas / Ramah", category: "general", keywords: ["senyum", "happy", "seru"] },
];

export interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  isLight?: boolean;
  language?: string;
}

export function IconPicker({
  value,
  onChange,
  isLight = false,
  language = "id",
}: IconPickerProps) {
  const isIndo = language === "id";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "popular" | "social" | "media" | "commerce" | "general"
  >("all");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");

  const categories = useMemo(
    () => [
      { id: "all" as const, label: isIndo ? "Semua" : "All" },
      { id: "popular" as const, label: isIndo ? "Populer" : "Popular" },
      { id: "social" as const, label: isIndo ? "Sosial & Chat" : "Social" },
      { id: "media" as const, label: isIndo ? "Media & Musik" : "Media" },
      { id: "commerce" as const, label: isIndo ? "Toko & Donasi" : "Shop & Donate" },
      { id: "general" as const, label: isIndo ? "Umum" : "General" },
    ],
    [isIndo]
  );

  // Filtered icons
  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();

    return CURATED_ICONS.filter((item) => {
      // Category match
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Search query match
      if (!q) return true;

      const nameMatch = item.name.toLowerCase().includes(q);
      const labelMatch = item.label.toLowerCase().includes(q);
      const kwMatch = item.keywords.some((kw) => kw.toLowerCase().includes(q));

      return nameMatch || labelMatch || kwMatch;
    });
  }, [search, selectedCategory]);

  const activeItem = useMemo(() => {
    return (
      CURATED_ICONS.find(
        (i) => i.name.toLowerCase() === (value || "").toLowerCase()
      ) || { name: value || "Globe", label: value || "Globe" }
    );
  }, [value]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      onChange(customName.trim());
      setCustomName("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Active Icon Bar & Quick Switch */}
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-2xl border transition-all",
          isLight
            ? "bg-slate-50 border-slate-200/90"
            : "bg-[#090d18] border-slate-800"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform",
              isLight
                ? "bg-emerald-50 border-emerald-300 text-emerald-600 shadow-xs"
                : "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            )}
          >
            <IconRenderer name={value || "Globe"} className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-bold text-sm",
                  isLight ? "text-slate-900" : "text-white"
                )}
              >
                {activeItem.label}
              </span>
              <span
                className={cn(
                  "text-[10px] font-mono px-2 py-0.5 rounded-full border",
                  isLight
                    ? "bg-slate-200 text-slate-700 border-slate-300"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                )}
              >
                {value || "Globe"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isIndo
                ? "Ikon ini akan ditampilkan pada tombol tautan Anda"
                : "This icon will be displayed on your link button"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className={cn(
            "text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer",
            isLight
              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
          )}
        >
          {showCustomInput
            ? (isIndo ? "Tutup Kustom" : "Close Custom")
            : (isIndo ? "+ Nama Kustom" : "+ Custom Name")}
        </button>
      </div>

      {/* Optional Custom Icon Input */}
      {showCustomInput && (
        <form
          onSubmit={handleApplyCustom}
          className={cn(
            "p-3 rounded-xl border flex items-center gap-2 transition-all",
            isLight
              ? "bg-white border-emerald-200"
              : "bg-slate-900/90 border-emerald-500/30"
          )}
        >
          <input
            type="text"
            placeholder={
              isIndo
                ? "Ketik nama ikon Lucide (cth. Rocket, Coffee, Cpu, Flame)..."
                : "Enter Lucide icon name (e.g. Rocket, Coffee, Cpu, Flame)..."
            }
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className={cn(
              "flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none font-mono",
              isLight
                ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500"
                : "bg-[#0b101c] border-slate-700 text-slate-100 focus:border-emerald-500"
            )}
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-all cursor-pointer"
          >
            {isIndo ? "Terapkan" : "Apply"}
          </button>
        </form>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search
          className={cn(
            "w-3.5 h-3.5 absolute left-3 top-2.5",
            isLight ? "text-slate-400" : "text-slate-500"
          )}
        />
        <input
          type="text"
          placeholder={
            isIndo
              ? "Cari ikon (cth. tiktok, whatsapp, musik, toko, saweria, yt)..."
              : "Search icon (e.g. tiktok, whatsapp, music, shop, donate, yt)..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "w-full pl-8 pr-8 py-2 text-xs rounded-xl border transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/30",
            isLight
              ? "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500"
              : "bg-[#090d18] border-slate-800 text-slate-100 placeholder-slate-500 focus:border-emerald-500/60"
          )}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer",
              selectedCategory === cat.id
                ? "bg-emerald-500 text-slate-950 font-bold shadow-xs"
                : isLight
                ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Curated Grid Selection */}
      <div
        className={cn(
          "grid grid-cols-6 sm:grid-cols-8 md:grid-cols-9 gap-2 p-3 border rounded-2xl max-h-40 overflow-y-auto overscroll-contain transition-colors",
          isLight
            ? "bg-slate-50/80 border-slate-200"
            : "bg-slate-900/40 border-slate-800"
        )}
      >
        {filteredIcons.length > 0 ? (
          filteredIcons.map((item) => {
            const isSelected =
              value.toLowerCase() === item.name.toLowerCase();

            return (
              <button
                type="button"
                key={item.name}
                onClick={() => onChange(item.name)}
                className={cn(
                  "group relative p-2.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer aspect-square",
                  isSelected
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400"
                    : isLight
                    ? "bg-white border border-slate-200/90 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:shadow-xs"
                    : "bg-[#0a0f1d] border border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-white hover:bg-slate-850"
                )}
                title={`${item.label} (${item.name})`}
              >
                <IconRenderer
                  name={item.name}
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                />
                <span
                  className={cn(
                    "text-[9px] mt-1 font-medium truncate max-w-full leading-none",
                    isSelected
                      ? "text-slate-950 font-bold"
                      : isLight
                      ? "text-slate-500"
                      : "text-slate-400"
                  )}
                >
                  {item.label.split(" ")[0]}
                </span>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center text-[9px]">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-6 text-center text-xs text-slate-400">
            <Sparkles className="w-4 h-4 mx-auto mb-1 text-slate-500" />
            <p>
              {isIndo
                ? "Tidak menemukan ikon yang cocok."
                : "No matching icons found."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="mt-1 text-emerald-400 hover:underline cursor-pointer"
            >
              {isIndo ? "Reset pencarian" : "Reset search"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
