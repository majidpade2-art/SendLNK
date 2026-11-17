"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { cn } from "@/lib/utils";
import {
  Shield,
  Key,
  Download,
  AlertTriangle,
  RefreshCw,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { notify } from "@/lib/toast";
import { getCurrentUserEmail, updateAccountPassword } from "@/lib/auth";

export function SettingsTab() {
  const { user, links, socials, analytics, resetToDefaults, uiTheme, setUiTheme, t } = useApp();
  const isLight = uiTheme === "light";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [userEmail, setUserEmail] = useState("user@sendlnk.com");

  useEffect(() => {
    setUserEmail(getCurrentUserEmail());
  }, []);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      notify.error("Silakan masukkan kata sandi saat ini.", "pwd-current");
      return;
    }
    if (newPassword.length < 6) {
      notify.error(t("settings_pwd_len_err"), "pwd-len");
      return;
    }
    if (newPassword !== confirmPassword) {
      notify.error(t("settings_pwd_match_err"), "pwd-match");
      return;
    }

    const res = updateAccountPassword(userEmail, currentPassword, newPassword);
    if (!res.success) {
      notify.error(res.message, "pwd-update-err");
      return;
    }

    notify.success(res.message, "pwd-success");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleExportData = () => {
    const exportData = {
      profile: user,
      links,
      socials,
      analytics,
      exported_at: new Date().toISOString(),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `majidspace-backup-${user.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify.success(t("settings_backup_success"), "export-backup");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2
          className={cn(
            "text-lg font-bold flex items-center gap-2 transition-colors",
            isLight ? "text-slate-900" : "text-white"
          )}
        >
          <span>{t("settings_title")}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t("settings_subtitle")}
        </p>
      </div>

      {/* UI Mode Selection (Light / Dark) */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <div className="flex items-center justify-between">
          <h3
            className={cn(
              "text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
              isLight ? "text-slate-700" : "text-slate-300"
            )}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Theme Display Mode</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {uiTheme === "light" ? "Light Mode Active" : "Dark Mode Active"}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Switch between clean, modern Light Mode and cyberpunk Dark Mode across the entire platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setUiTheme("light")}
            className={cn(
              "p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer",
              uiTheme === "light"
                ? "bg-amber-500/10 border-amber-500/50 shadow-sm"
                : isLight
                ? "bg-slate-50 border-slate-200 hover:bg-slate-100"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <div
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isLight ? "text-slate-900" : "text-white"
                  )}
                >
                  Light Mode
                </div>
                <div className="text-[11px] text-slate-500">
                  Clean, high-contrast daylight aesthetic
                </div>
              </div>
            </div>
            {uiTheme === "light" && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setUiTheme("dark")}
            className={cn(
              "p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer",
              uiTheme === "dark"
                ? "bg-cyan-500/10 border-cyan-500/50 shadow-sm"
                : isLight
                ? "bg-slate-50 border-slate-200 hover:bg-slate-100"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    isLight ? "text-slate-900" : "text-white"
                  )}
                >
                  Dark Mode
                </div>
                <div className="text-[11px] text-slate-500">
                  Deep slate & neon cyberpunk atmosphere
                </div>
              </div>
            </div>
            {uiTheme === "dark" && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {/* Language Selection Card */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <div className="flex items-center justify-between">
          <h3
            className={cn(
              "text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
              isLight ? "text-slate-700" : "text-slate-300"
            )}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{t("settings_language_title")}</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {t("settings_language_badge")}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {t("settings_language_desc")}
        </p>

        {/* Visual Language Picker Grid */}
        <LanguageSelector variant="grid" />
      </div>

      {/* Account Info */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <h3
          className={cn(
            "text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
            isLight ? "text-slate-700" : "text-slate-300"
          )}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          {t("settings_account_info")}
        </h3>

        <div className="space-y-3">
          <Input
            label={t("settings_email")}
            value={userEmail}
            readOnly
            disabled
          />
          <Input
            label={t("settings_user_id")}
            value={user.id}
            readOnly
            disabled
            className="font-mono text-xs"
          />
        </div>
      </div>

      {/* Change Password Form */}
      <form
        onSubmit={handlePasswordUpdate}
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <h3
          className={cn(
            "text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
            isLight ? "text-slate-700" : "text-slate-300"
          )}
        >
          <Key className="w-4 h-4 text-cyan-400" />
          {t("settings_password_title")}
        </h3>

        <Input
          type="password"
          label={t("settings_current_pwd")}
          placeholder="••••••••"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="password"
            label={t("settings_new_pwd")}
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            label={t("settings_confirm_pwd")}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="neon" size="sm" type="submit">
            {t("settings_btn_update_pwd")}
          </Button>
        </div>
      </form>

      {/* Data Export & Reset */}
      <div
        className={cn(
          "p-5 rounded-2xl border space-y-4 transition-colors",
          isLight ? "bg-white border-slate-200/90 shadow-sm" : "bg-[#0a0e1a] border-slate-800/80"
        )}
      >
        <h3
          className={cn(
            "text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors",
            isLight ? "text-slate-700" : "text-slate-300"
          )}
        >
          <Download className="w-4 h-4 text-purple-400" />
          {t("settings_data_title")}
        </h3>

        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border transition-colors",
            isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"
          )}
        >
          <div>
            <div
              className={cn(
                "text-sm font-semibold transition-colors",
                isLight ? "text-slate-900" : "text-slate-200"
              )}
            >
              {t("settings_backup_title")}
            </div>
            <div className="text-xs text-slate-400">
              {t("settings_backup_desc")}
            </div>
          </div>
          <Button
            variant="glass"
            size="sm"
            onClick={handleExportData}
            className="gap-2 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            {t("settings_backup_btn")}
          </Button>
        </div>

        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border transition-colors",
            isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900/60 border-slate-800"
          )}
        >
          <div>
            <div
              className={cn(
                "text-sm font-semibold transition-colors",
                isLight ? "text-slate-900" : "text-slate-200"
              )}
            >
              {t("settings_reset_title")}
            </div>
            <div className="text-xs text-slate-400">
              {t("settings_reset_desc")}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => resetToDefaults()}
            className="gap-2 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t("settings_reset_btn")}
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
        <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {t("settings_danger_title")}
        </h3>
        <p className="text-xs text-slate-400">
          {t("settings_danger_desc")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div>
            <div
              className={cn(
                "text-sm font-semibold transition-colors",
                isLight ? "text-slate-900" : "text-slate-200"
              )}
            >
              {t("settings_delete_title")}
            </div>
            <div className="text-xs text-slate-400">
              {t("settings_delete_desc")}
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            className="shrink-0 cursor-pointer"
          >
            {t("settings_delete_btn")}
          </Button>
        </div>
      </div>

      {/* Confirmation Modal for Permanent Delete */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfirmation("");
        }}
        title={t("settings_delete_title")}
        description={t("settings_delete_desc")}
      >
        <div className="space-y-4">
          <p className={cn("text-xs transition-colors", isLight ? "text-slate-600" : "text-slate-300")}>
            Ketik <strong className="font-mono text-red-500">DELETE</strong> untuk mengonfirmasi:
          </p>
          <Input
            placeholder="DELETE"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmation("");
              }}
            >
              {t("common_cancel")}
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleteConfirmation !== "DELETE"}
              onClick={() => {
                resetToDefaults();
                setIsDeleteModalOpen(false);
                notify.success("Account data cleared.", "reset-defaults");
              }}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
