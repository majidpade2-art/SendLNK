import Link from "next/link";
import { Zap, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#0b0f19] text-slate-100 text-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-sm shadow-emerald-500/10">
          <Zap className="w-7 h-7 text-emerald-400" />
        </div>

        <h1 className="text-6xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white mb-2">
          404
        </h1>

        <h2 className="text-xl font-bold text-white mb-2">
          Destination Coordinates Lost
        </h2>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          The link node or digital handle you are attempting to access does not
          exist in this sector of the linktree-note network.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white"
          >
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
