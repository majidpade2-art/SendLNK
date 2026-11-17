# ⚡ MAJIDSPACE — Premium Social Media Link Hub

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Futuristic, cyberpunk-inspired link-in-bio platform engineered with Next.js 15+, React 19, TypeScript, Tailwind CSS, and Supabase.**

MajidSpace provides content creators, engineers, developers, and founders with a high-fidelity digital identity hub. It features live theme customization, interactive phone previews, physics-based drag-and-drop link reordering, privacy-first telemetry analytics, vector QR code generation, and 13+ social channel integrations.

---

## ✨ Core Highlights

- **🛸 Futuristic Cyberpunk Aesthetics:** Deep black backgrounds (`#07090e`), glowing neon borders (`#00ff88`), glassmorphic frosted cards, and subtle animated ambient meshes.
- **📱 Real-Time Interactive Phone Frame:** Side-by-side Linktree-style interactive phone mockup that syncs and previews edits to profile, links, and styling in real-time.
- **🎨 Live Appearance Engine:** 8 preset themes (*Cyberpunk Neon, Midnight Void, Royal Amethyst, Crimson Cyber, Aurora Teal, Solar Flare, Matrix Code, Minimalist Onyx*), custom accent pickers, button geometries, and typography selectors.
- **🔀 Physics Drag-and-Drop:** Intuitive reordering using Framer Motion with category tabs (Featured, Projects, Code, Community, etc.).
- **📊 Deep Telemetry & Analytics:** Real-time visitor counts, link click trajectories, click-through rates (CTR), device category distributions (Mobile, Desktop, Tablet), and referral tracking with CSV export.
- **🌐 Omnichannel Social Bar:** Native glowing icons for 13+ platforms: Instagram, TikTok, YouTube, X (Twitter), GitHub, Discord, WhatsApp, Telegram, Spotify, LinkedIn, Twitch, Facebook, and Email.
- **🏷️ QR Code Generator:** Live vector QR code canvas with single-click PNG download for business cards and conferences.
- **🛡️ Enterprise Database Architecture:** Complete PostgreSQL schema with Supabase Row Level Security (RLS) policies, atomic view/click increment triggers, and user provisioning.
- **⚡ Dual Engine (Demo & Cloud):** Operates immediately out-of-the-box with persistent local state and pre-seeded demo profile (`@majid`), and seamlessly connects to Supabase when environment variables are supplied.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15+ / 16 (App Router, Server & Client Components)
- **UI & Runtime:** React 19, TypeScript 5
- **Styling:** Tailwind CSS v4, Glassmorphism, CSS Custom Properties
- **Motion & Interactions:** Framer Motion (Transitions, Physics Reorder, AnimatePresence)
- **Icons:** Lucide React + Custom SVG Brand Vectors
- **Database & Auth:** Supabase PostgreSQL with RLS (`@supabase/supabase-js`, `@supabase/ssr`)
- **Forms & Validation:** React Hook Form, Zod
- **Notifications:** Sonner
- **Utilities:** QRCode.react, Canvas Confetti

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/majidspace.git
cd majidspace
npm install
```

### 2. Configure Environment (Optional)

MajidSpace runs out-of-the-box in local demo mode without needing third-party keys. To link your own Supabase project:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Paste your Supabase project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Run the SQL schema found in [`supabase/schema.sql`](./supabase/schema.sql) in your Supabase SQL Editor.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or configured port) in your browser:
- **Landing Page:** `http://localhost:3000`
- **Live Demo Profile:** `http://localhost:3000/majid`
- **Studio Dashboard:** `http://localhost:3000/dashboard`

---

## 📡 REST API Reference

MajidSpace includes built-in API endpoints for profile resolution and event telemetry:

| Endpoint | Method | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/profile/[username]` | `GET` | Fetches user public profile, active links, and social accounts | `params: { username }` | `{ success: true, profile, links, socials }` |
| `/api/analytics/view` | `POST` | Ingests a profile page impression event | `{ profile_id, referrer, device_type }` | `{ success: true, message: "View recorded" }` |
| `/api/analytics/click` | `POST` | Ingests a destination link click event | `{ link_id, profile_id }` | `{ success: true, message: "Click recorded" }` |

---

## 🗄️ Database & Supabase Storage Setup

### Database Tables (PostgreSQL)

The included [`supabase/schema.sql`](./supabase/schema.sql) provisions:
- `profiles`: User information, display names, custom theme configurations (JSONB), and verification badges.
- `links`: Title, URL, description, category, scheduling timestamps, and click counts.
- `social_accounts`: URLs and active toggles for 13+ social media networks.
- `analytics_events`: Event logs for impressions and link clicks with device and referrer categorization.
- `subscriptions`: Pro plan tier tracking and modular subscription records.
- **Row Level Security (RLS):** Fully enabled across all tables so users can only manage their own resources while allowing anonymous public profile viewing and view/click recording.

### Supabase Storage Buckets Setup

To enable user avatar and link thumbnail uploads in your Supabase project:
1. Navigate to **Storage** in your Supabase Dashboard.
2. Create two public buckets:
   - `avatars` (Max file size: 2MB, Allowed MIME types: `image/jpeg, image/png, image/webp`)
   - `thumbnails` (Max file size: 5MB, Allowed MIME types: `image/jpeg, image/png, image/webp`)
3. Run the following Storage RLS policy in the SQL editor:
   ```sql
   -- Allow public read access to avatars and thumbnails
   CREATE POLICY "Public avatar access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'thumbnails'));

   -- Allow authenticated users to upload to their own folder
   CREATE POLICY "User upload access" ON storage.objects FOR INSERT WITH CHECK (
     bucket_id IN ('avatars', 'thumbnails') AND auth.role() = 'authenticated'
   );
   ```

---

## 📁 Project Architecture

```
├── public/                 # Static assets
├── supabase/
│   └── schema.sql          # Complete Supabase PostgreSQL schema with RLS & functions
├── src/
│   ├── app/                # Next.js 15+ App Router
│   │   ├── [username]/     # Dynamic public profile page (/[username])
│   │   ├── auth/           # Login, Register, Forgot Password
│   │   ├── dashboard/      # Studio Admin Dashboard
│   │   │   ├── links/      # Link management system (reorder, add, edit, schedule)
│   │   │   ├── profile/    # Avatar, bio, verified badge, online status
│   │   │   ├── socials/    # 13+ social media integrations
│   │   │   ├── appearance/ # Preset themes, neon glow, custom geometry
│   │   │   ├── analytics/  # Detailed engagement telemetry & CSV export
│   │   │   └── settings/   # Credentials, backups, and pro tier management
│   │   ├── api/            # Route handlers (profile, analytics view/click)
│   │   ├── globals.css     # Cyberpunk styling, neon glow utilities
│   │   ├── layout.tsx      # Root layout with fonts & client providers
│   │   ├── page.tsx        # Modern high-converting SaaS landing page
│   │   └── not-found.tsx   # Custom 404 matrix page
│   ├── components/
│   │   ├── dashboard/      # Sidebar, Header, PhonePreviewFrame, Tab Views
│   │   ├── profile/        # PublicProfileView, LinkCard, SocialIconsBar, ShareModal
│   │   ├── providers/      # ClientProviders (Sonner Toaster, AppContext)
│   │   └── ui/             # Reusable UI primitives (Button, Input, Switch, Modal, Badge, SocialBrandIcons)
│   ├── context/
│   │   └── AppContext.tsx  # Central state management with persistent storage
│   ├── lib/
│   │   ├── constants/      # 8 Preset Themes, Fonts, Neon Palette
│   │   ├── mockData.ts     # High-fidelity seed profile (@majid)
│   │   ├── supabase/       # SSR Browser, Server & Middleware clients
│   │   └── utils.ts        # Helper functions & clsx/twMerge
│   ├── middleware.ts       # Next.js route protection & session refresh
│   └── types/              # Comprehensive TypeScript interfaces
└── README.md
```

---

## 🔧 Windows & PowerShell Troubleshooting

If you encounter script execution restrictions when running `npm` commands on Windows PowerShell:
- **Execution Policy Fix:** Run PowerShell as Administrator or in the current session:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  ```
  Or invoke npm directly using `npm.cmd` (e.g., `npm.cmd run dev`).
- **Port Conflict (`EADDRINUSE: 3000`):** Start the server on an alternative port:
  ```bash
  npm run start -- -p 3001
  ```

---

## 🗺️ Future Roadmap

- [ ] **Custom Domain DNS Automation:** Automated CNAME mapping via Vercel Domains API.
- [ ] **Billing Webhook Integrations:** Automated subscription lifecycle management via Stripe / LemonSqueezy.
- [ ] **Rich Media Embeds:** In-line playable Spotify audio tracks and YouTube video embeds inside link cards.
- [ ] **Custom CSS Editor:** Live code editor for advanced Pro users to write custom styles.

---

## 🚢 Deployment to Vercel

MajidSpace is production-ready for deployment on **Vercel**:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Set your Supabase environment variables in Vercel Project Settings.
4. Deploy! Next.js will automatically compile and optimize static routes, server components, and edge assets.

---

## 📄 License

MIT © MajidSpace Platform. Built with passion for the creator economy.
