import type { Metadata } from "next";
import { Space_Grotesk, Outfit, Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Sendlink — Social Media Link Hub",
  description:
    "Premium link-in-bio platform with deep analytics, neon cyberpunk themes, real-time live preview, and high-performance profile pages.",
  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Sendlink — Social Media Link Hub",
    description: "One Link. Infinite Possibilities. Claim your link hub today.",
    siteName: "Sendlink",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Sendlink Digital Identity Hub",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable} light`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-emerald-500/30 selection:text-emerald-600 transition-colors">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
