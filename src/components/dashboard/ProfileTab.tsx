"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { AVAILABLE_FONTS } from "@/lib/constants/themes";
import { cn } from "@/lib/utils";
import {
  Image as ImageIcon,
  Check,
  UploadCloud,
  FolderOpen,
  Camera,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { notify } from "@/lib/toast";

const AVATAR_PRESETS = [
  "/avatar.png",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&h=400&q=80",
];

export function ProfileTab() {
  const { user, updateProfile, uiTheme, t } = useApp();
  const isLight = uiTheme === "light";

  const [displayName, setDisplayName] = useState(user.display_name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url);
  const [verified, setVerified] = useState(user.verified);
  const [isOnline, setIsOnline] = useState(user.is_online);
  const [fontFamily, setFontFamily] = useState(user.font_family || user.theme_config?.font_family || "Space Grotesk");

  useEffect(() => {
    setDisplayName(user.display_name);
    setUsername(user.username);
    setBio(user.bio);
    setAvatarUrl(user.avatar_url);
    setVerified(user.verified);
    setIsOnline(user.is_online);
    setFontFamily(user.font_family || user.theme_config?.font_family || "Space Grotesk");
  }, [user]);

  const [imageSourceMode, setImageSourceMode] = useState<"upload" | "url">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection from File Explorer
  const processSelectedFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify.error("Hanya file gambar (PNG, JPG, WEBP, GIF) yang didukung.", "avatar-format-err");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify.error("Ukuran file terlalu besar! Maksimal 5MB.", "avatar-size-err");
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    // 1. Instant local preview via FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setAvatarUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload file to backend /api/upload
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.url) {
        setAvatarUrl(result.url);
        notify.success(`Gambar "${file.name}" berhasil diunggah!`, "avatar-upload-success");
      } else {
        notify.success("Foto profil diperbarui dari file lokal.", "avatar-local-fallback");
      }
    } catch {
      // Fallback: data URL is already set and works locally
      notify.success("Foto profil diperbarui dari file lokal.", "avatar-local-fallback");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      display_name: displayName,
      username: username.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
      bio,
      avatar_url: avatarUrl,
      verified,
      is_online: isOnline,
      font_family: fontFamily,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <div>
        <h2
          className={cn(
            "text-lg font-bold flex items-center gap-2 transition-colors",
            isLight ? "text-slate-900" : "text-white"
          )}
        >
          <span>{t("profile_title")}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t("profile_desc")}
        </p>
      </div>

      {/* Avatar Section */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <div className="flex items-center justify-between">
          <label
            className={cn(
              "block text-xs font-semibold uppercase tracking-wider transition-colors",
              isLight ? "text-slate-700" : "text-slate-300"
            )}
          >
            {t("profile_avatar_label")}
          </label>
          {/* Source Mode Toggle */}
          <div
            className={cn(
              "flex items-center p-1 rounded-xl text-[11px] transition-colors",
              isLight ? "bg-slate-100 border border-slate-200" : "bg-slate-900 border border-slate-800"
            )}
          >
            <button
              type="button"
              onClick={() => setImageSourceMode("upload")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer",
                imageSourceMode === "upload"
                  ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:text-slate-950"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>{t("profile_file_explorer")}</span>
            </button>
            <button
              type="button"
              onClick={() => setImageSourceMode("url")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer",
                imageSourceMode === "url"
                  ? "bg-emerald-500 text-slate-950 font-semibold shadow-sm"
                  : isLight
                  ? "text-slate-600 hover:text-slate-950"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{t("profile_url_mode")}</span>
            </button>
          </div>
        </div>

        {/* Hidden native file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar Preview with Click-to-Upload Camera Overlay */}
          <div
            onClick={() => fileInputRef.current?.click()}
            title="Klik untuk memilih foto dari File Explorer"
            className="relative group shrink-0 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full p-0.5 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)] overflow-hidden bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl || AVATAR_PRESETS[0]}
                alt="Avatar Preview"
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium pointer-events-none">
              <Camera className="w-5 h-5 text-emerald-400 mb-0.5" />
              <span>Ganti</span>
            </div>

            {isUploading && (
              <div className="absolute inset-0 rounded-full bg-black/75 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Right Input Area: File Explorer Upload vs URL Mode */}
          <div className="flex-1 w-full space-y-2">
            {imageSourceMode === "upload" ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center",
                  isDragging
                    ? "border-emerald-500 bg-emerald-500/10"
                    : isLight
                    ? "border-slate-300 bg-slate-50 hover:border-emerald-500 hover:bg-slate-100"
                    : "border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs font-semibold transition-colors",
                    isLight ? "text-slate-800" : "text-slate-200"
                  )}
                >
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>
                    {uploadedFileName
                      ? `Terpilih: ${uploadedFileName}`
                      : "Pilih file dari File Explorer"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Klik untuk jelajahi file komputer Anda atau Drag & Drop ke sini
                </p>
                <span className="text-[10px] text-slate-500 font-mono">
                  Mendukung PNG, JPG, WEBP, GIF (Maks. 5MB)
                </span>
              </div>
            ) : (
              <Input
                placeholder={t("profile_url_placeholder")}
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                  setUploadedFileName("");
                }}
                leftIcon={<ImageIcon className="w-4 h-4" />}
              />
            )}

            {/* Quick Preset Selector */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className={cn("text-[11px] transition-colors", isLight ? "text-slate-600" : "text-slate-400")}>
                  {t("profile_presets")}:
                </span>
                <div className="flex items-center gap-1.5">
                  {AVATAR_PRESETS.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        setAvatarUrl(url);
                        setUploadedFileName("");
                      }}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                        avatarUrl === url
                          ? "border-emerald-500 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.35)]"
                          : "border-slate-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="Preset"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset to Default Logo */}
              <button
                type="button"
                onClick={() => {
                  setAvatarUrl("/avatar.png");
                  setUploadedFileName("");
                  notify.info("Mengembalikan ke logo utama.", "avatar-reset-logo");
                }}
                className={cn(
                  "text-[11px] transition-colors cursor-pointer",
                  isLight ? "text-slate-600 hover:text-emerald-600" : "text-slate-400 hover:text-emerald-400"
                )}
              >
                {t("profile_use_default_logo")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Profile Details */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t("profile_display_name")}
            placeholder={t("profile_name_placeholder")}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <Input
            label={t("profile_username")}
            placeholder={t("profile_username_placeholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText={`${t("profile_public_url")}: sendlnk.net/${username || "username"}`}
            required
          />
        </div>

        {/* Bio */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className={cn(
                "text-xs font-medium transition-colors",
                isLight ? "text-slate-700" : "text-slate-300"
              )}
            >
              {t("profile_bio")}
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {bio.length}/180
            </span>
          </div>
          <textarea
            rows={3}
            maxLength={180}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t("profile_bio_placeholder")}
            className={cn(
              "w-full border rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30",
              isLight
                ? "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                : "bg-[#090d18] border-slate-800 text-slate-100 placeholder-slate-500"
            )}
          />
        </div>

        {/* Font Family Selection */}
        <div>
          <label
            className={cn(
              "block text-xs font-medium mb-1.5 transition-colors",
              isLight ? "text-slate-700" : "text-slate-300"
            )}
          >
            {t("profile_font")}
          </label>
          <select
            value={fontFamily}
            onChange={(e) => {
              const newFont = e.target.value;
              setFontFamily(newFont);
              updateProfile({ font_family: newFont });
            }}
            className={cn(
              "w-full border rounded-xl px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:border-emerald-500/60",
              isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-[#090d18] border-slate-800 text-slate-100"
            )}
          >
            {AVAILABLE_FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status & Badges Section */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <label
          className={cn(
            "block text-xs font-semibold uppercase tracking-wider transition-colors",
            isLight ? "text-slate-700" : "text-slate-300"
          )}
        >
          {t("profile_badges")}
        </label>

        <Switch
          label={t("profile_verified")}
          description={t("profile_verified_desc")}
          checked={verified}
          onCheckedChange={setVerified}
        />

        <div
          className={cn(
            "pt-2 border-t transition-colors",
            isLight ? "border-slate-200" : "border-slate-800/80"
          )}
        >
          <Switch
            label={t("profile_online")}
            description={t("profile_online_desc")}
            checked={isOnline}
            onCheckedChange={setIsOnline}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="neon" size="md" type="submit" className="gap-2">
          {isSaved ? (
            <>
              <Check className="w-4 h-4 text-[#07090e]" />
              {t("profile_saved")}
            </>
          ) : (
            t("profile_btn_save")
          )}
        </Button>
      </div>
    </form>
  );
}
