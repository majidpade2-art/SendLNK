"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Lock, Mail } from "lucide-react";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { verifyCredentials } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, updateProfile, uiTheme, t } = useApp();
  const isLight = uiTheme === "light";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      const result = verifyCredentials(email, password);
      if (!result.success) {
        notify.error(result.message, "auth-err");
        setIsLoading(false);
        return;
      }

      if (result.account) {
        updateProfile({
          username: result.account.username,
          display_name: result.account.displayName || result.account.username,
        });
      }

      loginUser(email.trim().toLowerCase());
      notify.success(result.message, "auth-login");
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0b0f19] text-slate-100 relative overflow-hidden">
      {/* Top right language switch */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector variant="compact" />
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
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
            {t("auth_login_subtitle")}
          </p>
        </div>

        {/* Card */}
        <div
          className={cn(
            "p-6 sm:p-8 rounded-3xl backdrop-blur-xl border transition-all",
            isLight
              ? "bg-white border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
              : "bg-[#0a0f1d]/80 border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          )}
        >
          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-0"
                />
                <span>{t("auth_remember_me")}</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {t("auth_forgot_password")}
              </Link>
            </div>

            <Button
              type="submit"
              variant="outline"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              {t("auth_signin_button")}
            </Button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-6">
            {t("auth_no_account")}{" "}
            <Link
              href="/auth/register"
              className="text-emerald-400 font-semibold hover:underline"
            >
              {t("auth_claim_link")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
