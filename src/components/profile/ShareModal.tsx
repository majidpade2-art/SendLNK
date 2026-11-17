"use client";

import React, { useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, Download, Share2 } from "lucide-react";
import {
  XTwitterIcon,
  WhatsAppIcon,
  LinkedInIcon,
  FacebookIcon,
} from "@/components/ui/SocialBrandIcons";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  displayName: string;
}

export function ShareModal({
  isOpen,
  onClose,
  username,
  displayName,
}: ShareModalProps) {
  const { t, uiTheme } = useApp();
  const isLight = uiTheme === "light";
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${username}`
      : `/${username}`;
  const canWebShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      notify.success(t("share_copied_btn"), "copy-link");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      notify.error("Gagal menyalin tautan", "copy-link-err");
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} on MajidSpace`,
          text: `Check out ${displayName}'s links and digital hub on MajidSpace!`,
          url: profileUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          notify.error("Could not share link", "webshare-err");
        }
      }
    }
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${username}-majidspace-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    notify.success("QR code downloaded!", "download-qr");
  };

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: XTwitterIcon,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out ${displayName}'s links on MajidSpace: ${profileUrl}`
      )}`,
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${displayName}'s profile: ${profileUrl}`
      )}`,
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        profileUrl
      )}`,
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        profileUrl
      )}`,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("share_modal_title")}
      description={t("share_modal_desc")}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Copy Link Section */}
        <div
          className={cn(
            "flex items-center gap-2 p-2 rounded-xl border transition-colors",
            isLight ? "bg-slate-50 border-slate-200" : "bg-[#080d18] border-slate-800"
          )}
        >
          <input
            type="text"
            readOnly
            value={profileUrl}
            className={cn(
              "bg-transparent text-xs px-2 flex-1 focus:outline-none select-all font-mono transition-colors",
              isLight ? "text-slate-800" : "text-slate-300"
            )}
          />
          <Button
            size="sm"
            variant={copied ? "glass" : "neon"}
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                {t("share_copied_btn")}
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                {t("share_copy_btn")}
              </>
            )}
          </Button>
        </div>

        {/* QR Code Section */}
        <div
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-2xl border transition-colors",
            isLight
              ? "bg-slate-50 border-slate-200"
              : "bg-[#090e1c]/80 border-slate-800/80"
          )}
        >
          <div
            ref={qrRef}
            className="p-4 bg-white rounded-2xl shadow-lg flex items-center justify-center"
          >
            <QRCodeCanvas
              value={profileUrl || `https://sendlnk.net/${username}`}
              size={180}
              bgColor="#ffffff"
              fgColor="#0b0f19"
              level="H"
              includeMargin={false}
            />
          </div>
          <span
            className={cn(
              "text-xs mt-3 font-mono transition-colors",
              isLight ? "text-slate-600" : "text-slate-400"
            )}
          >
            @{username}
          </span>

          <Button
            variant="glass"
            size="sm"
            onClick={downloadQRCode}
            className="mt-4 gap-2 text-xs"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            {t("share_download_qr")}
          </Button>
        </div>

        {/* Web Share & Social Share Links */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-400">Share to:</div>
          <div className="grid grid-cols-4 gap-2">
            {shareLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800 transition-all text-slate-300 hover:text-white group"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors mb-1" />
                  <span className="text-[11px] font-medium">{item.name}</span>
                </a>
              );
            })}
          </div>

          {canWebShare && (
            <Button
              variant="outline"
              size="md"
              onClick={handleWebShare}
              className="w-full mt-3 gap-2"
            >
              <Share2 className="w-4 h-4" />
              More Share Options
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
