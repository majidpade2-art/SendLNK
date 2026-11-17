"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Mail, ArrowLeft, KeyRound, Lock, ShieldCheck, RefreshCw } from "lucide-react";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { generateResetCode, resetPasswordWithCode } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { uiTheme, t } = useApp();
  const isLight = uiTheme === "light";

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request reset code
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const res = generateResetCode(email);
      setIsLoading(false);

      if (!res.success) {
        notify.error(res.message, "pwd-request-err");
        return;
      }

      setGeneratedCode(res.code || "");
      setStep(2);
      notify.success(
        `Kode verifikasi: ${res.code}. Masukkan kode ini untuk mereset kata sandi.`,
        "pwd-code"
      );
    }, 400);
  };

  // Step 2: Submit new password with code
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !newPassword.trim()) return;

    if (newPassword.length < 6) {
      notify.error(t("settings_pwd_len_err"), "pwd-len");
      return;
    }

    if (newPassword !== confirmPassword) {
      notify.error(t("settings_pwd_match_err"), "pwd-match");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = resetPasswordWithCode(email, code, newPassword);
      setIsLoading(false);

      if (!res.success) {
        notify.error(res.message, "pwd-reset-err");
        return;
      }

      notify.success(res.message, "pwd-reset-success");
      router.push("/auth/login");
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0b0f19] text-slate-100 relative overflow-hidden">
      {/* Top right language switch */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector variant="compact" />
      </div>

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
            {t("auth_forgot_subtitle")}
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
          {step === 1 ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                {t("auth_step1_desc")}
              </p>

              <Input
                type="email"
                label={t("auth_email_label")}
                placeholder={t("auth_email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="neon"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                {t("auth_send_reset")}
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/login"
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs transition-colors",
                    isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  )}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  {t("auth_return_login")}
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* OTP Simulation Notification Banner */}
              <div
                className={cn(
                  "p-3.5 rounded-2xl border transition-colors",
                  isLight
                    ? "bg-emerald-50 border-emerald-200 text-slate-800"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Kode Verifikasi Akun</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold">
                    OTP AKTIF
                  </span>
                </div>
                <div className="my-2 text-center">
                  <span className="text-2xl font-mono font-extrabold tracking-widest text-emerald-500 select-all">
                    {generatedCode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 text-center leading-tight">
                  Email: <strong>{email}</strong>
                </p>
              </div>

              <Input
                type="text"
                label={t("auth_otp_label")}
                placeholder={t("auth_otp_placeholder")}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                leftIcon={<KeyRound className="w-4 h-4 text-emerald-400" />}
                required
                maxLength={6}
              />

              <Input
                type="password"
                label={t("auth_new_pwd_label")}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                type="password"
                label={t("auth_confirm_pwd_label")}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="neon"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                {t("auth_reset_pwd_btn")}
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{t("auth_resend_code")}</span>
                </button>
                <Link
                  href="/auth/login"
                  className={cn(
                    "inline-flex items-center gap-1 transition-colors",
                    isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  )}
                >
                  <ArrowLeft className="w-3 h-3" />
                  {t("auth_return_login")}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
