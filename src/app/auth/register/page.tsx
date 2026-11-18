"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Lock, Mail, User, AtSign, Check } from "lucide-react";
import { notify } from "@/lib/toast";
import { registerAccount } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { updateProfile, loginUser, uiTheme, t, resetToDefaults } = useApp();
  const isLight = uiTheme === "light";

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) return;

    if (password.length < 6) {
      notify.error("Kata sandi minimal 6 karakter.", "auth-register-err");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      const res = registerAccount({
        email: email.trim().toLowerCase(),
        password: password.trim(),
        username: cleanUsername,
        displayName: displayName || cleanUsername,
        createdAt: new Date().toISOString(),
      });

      if (!res.success) {
        notify.error(res.message, "auth-register-err");
        setIsLoading(false);
        return;
      }

      resetToDefaults(true);
      updateProfile({
        username: cleanUsername,
        display_name: displayName || cleanUsername,
        views_count: 0,
      });
      loginUser(email.trim().toLowerCase());
      notify.success(res.message, "auth-register");
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0b0f19] text-slate-100 relative overflow-hidden">
      {/* Top right language switch */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector variant="compact" />
      </div>

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-3 group">
            <div className="w-11 h-11 rounded-full flex items-center justify-center drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform overflow-hidden border border-emerald-500/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="SendLNK Logo" className="w-11 h-11 object-cover rounded-full" />
            </div>
            <span
              className={cn(
                "font-extrabold text-2xl tracking-wider transition-colors",
                isLight ? "text-slate-900" : "text-white"
              )}
            >
              SendLNK
            </span>
          </Link>
          <p className="text-xs text-slate-400">
            {t("auth_register_subtitle")}
          </p>
        </div>

        <div
          className={cn(
            "p-6 sm:p-8 rounded-3xl backdrop-blur-xl border transition-all",
            isLight
              ? "bg-white border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
              : "bg-[#0a0f1d]/80 border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          )}
        >
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input
                label={t("auth_handle_label")}
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                leftIcon={<AtSign className="w-4 h-4 text-emerald-400" />}
                helperText={`${t("auth_handle_helper")}: sendlnk.net/${
                  username.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "handle"
                }`}
                required
              />
            </div>

            <Input
              label={t("auth_display_name_label")}
              placeholder={t("auth_display_name_placeholder")}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              type="email"
              label={t("auth_email_label")}
              placeholder={t("auth_email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              type="password"
              label={t("auth_password_label")}
              placeholder={t("auth_password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <div
              className={cn(
                "p-3 rounded-xl border text-[11px] space-y-1 transition-colors",
                isLight
                  ? "bg-slate-50 border-slate-200 text-slate-600"
                  : "bg-slate-900/50 border-slate-800 text-slate-400"
              )}
            >
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className={isLight ? "text-slate-700" : "text-slate-300"}>
                  {t("auth_feature_free")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className={isLight ? "text-slate-700" : "text-slate-300"}>
                  {t("auth_feature_access")}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="neon"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              {t("auth_register_button")}
            </Button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-6">
            {t("auth_have_account")}{" "}
            <Link
              href="/auth/login"
              className="text-emerald-400 font-semibold hover:underline"
            >
              {t("auth_signin_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
