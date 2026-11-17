# ⚡ MAJIDSPACE — PANDUAN LENGKAP FITUR PLATFORM

> **MAJIDSPACE** adalah platform *link-in-bio* premium generasi terbaru yang dirancang khusus untuk kreator konten, pengembang perangkat lunak, dan profesional teknologi. Platform ini menggabungkan kesederhanaan Linktree dengan estetika futuristik bertema *cyberpunk*, visual *glassmorphism*, simulator *smartphone* interaktif langsung, serta sistem analitik mendalam.

---

## 📑 DAFTAR ISI

1. [Identitas Visual & Desain](#1-identitas-visual--desain)
2. [Halaman Profil Publik](#2-halaman-profil-publik-username)
3. [Sistem Manajemen Link](#3-sistem-manajemen-link)
4. [Integrasi Media Sosial](#4-integrasi-media-sosial)
5. [Studio Dashboard & Live Phone Preview](#5-studio-dashboard--live-phone-preview)
6. [Sistem Kustomisasi & Tema](#6-sistem-kustomisasi--tema)
7. [Sistem Analitik & Telemetri](#7-sistem-analitik--telemetri)
8. [Generator QR Code & Fitur Berbagi](#8-generator-qr-code--fitur-berbagi)
9. [Autentikasi & Arsitektur Database](#9-autentikasi--arsitektur-database)
10. [Pengaturan Akun & Keamanan](#10-pengaturan-akun--keamanan)
11. [Spesifikasi Teknis](#11-spesifikasi-teknis)

---

## 1. IDENTITAS VISUAL & DESAIN

- **Tema Standar Gelap (Dark Mode First):** Menggunakan latar belakang hitam pekat (`#07090e`) dan biru dongker malam (`#0d121f`).
- **Aksen Neon Cyberpunk:** Aksen warna utama hijau neon emerald (`#00ff88`), dipadukan dengan gradasi sian (`#00f0ff`) dan ungu lavender (`#c084fc`).
- **Efek Glassmorphism:** Panel tembus pandang dengan efek blur latar (*frosted glass*), garis tepi halus (*subtle glowing border*), dan bayangan neon menyala.
- **Kisi Latar Ambient (Cyber Grid):** Pola kisi digital interaktif yang memberikan kesan modern layaknya produk SaaS teknologi tinggi.
- **Responsif Penuh:** Tampilan menyesuaikan otomatis dan sempurna di perangkat ponsel pintar, tablet, maupun layar desktop resolusi tinggi.

---

## 2. HALAMAN PROFIL PUBLIK (`/[username]`)

Setiap pengguna memiliki halaman profil publik unik (`majidspace.me/[username]`):

- **Foto Profil & Indikator Status Online:** Avatar profil dengan bingkai neon bercahaya dan radar dot hijau menyala yang berdenyut (*pulsing online indicator*) secara real-time.
- **Lencana Kreator Terverifikasi (Verified Badge):** Ikon centang biru-neon eksklusif untuk menandai profil terverifikasi.
- **Nama Tampilan & Handle Unik:** Penulisan nama tebal dan handle format `@username` dengan tipografi futuristik.
- **Biografi Pengguna:** Teks perkenalan ringkas dengan batas hingga 180 karakter.
- **Pencarian Link Cepat (Search Bar):** Kolom pencarian otomatis yang menyaring judul dan deskripsi link secara instan saat pengguna mengetik.
- **Filter Kategori (Category Tabs):** Tombol pil kategori (*Featured, Projects, Code, Community, Music, dll.*) untuk memudahkan navigasi link.
- **Penghitung Pengunjung (Views Counter):** Lencana transparan yang menampilkan akumulasi impresi profil (contoh: *24.8k views*).
- **Tombol Share Mengambang:** Akses cepat untuk menyalin URL dan menampilkan kode QR profil.
- **Branding Platform Opsional:** Footer "Powered by MAJIDSPACE" yang dapat dinonaktifkan oleh pengguna paket Pro.

---

## 3. SISTEM MANAJEMEN LINK

Pengguna memiliki kendali penuh atas tautan destinasi di dashboard:

- **Tambah Link Tanpa Batas:** Menambahkan tautan sebanyak yang diinginkan tanpa limitasi kuota.
- **Drag-and-Drop (Pengurutan Fisika):** Mengurutkan posisi link ke atas atau ke bawah secara mulus menggunakan animasi berbasis fisika dari *Framer Motion*.
- **Sorot Link (Neon Glow Highlight):** Mengaktifkan efek bingkai neon bersinar dan lencana *Featured* khusus untuk link yang paling penting.
- **Pilihan Ikon & Thumbnail Kustom:**
  - Pemilih ikon Lucide terintegrasi (Youtube, GitHub, Globe, Music, Shopping, dll.).
  - Mendukung input URL gambar thumbnail eksternal.
- **Penjadwalan Tautan (Link Scheduling - Fitur Pro):**
  - Mengatur tanggal & jam mulai tampil (*Start Date*).
  - Mengatur batas waktu kedaluwarsa tautan (*Expiration Date*).
  - Tautan otomatis tersembunyi jika berada di luar jadwal yang ditentukan.
- **Pengelompokan Kategori:** Membagi link ke dalam grup seperti *Work, Projects, Community, Music, Shop, dll.*
- **Sakelar Aktif/Nonaktif Instan:** Menyembunyikan link sementara dari publik hanya dengan satu klik sakelar (*switch*).
- **Statistik Klik per Link:** Menampilkan angka total klik secara transparan pada setiap kartu link di dashboard.

---

## 4. INTEGRASI MEDIA SOSIAL

Mendukung bilah ikon mengambang dengan ikon SVG vektor resmi dan animasi saat kursor diarahkan (*hover glow*):

1. **Instagram** (`https://instagram.com/username`)
2. **TikTok** (`https://tiktok.com/@username`)
3. **YouTube** (`https://youtube.com/@channel`)
4. **X / Twitter** (`https://x.com/username`)
5. **GitHub** (`https://github.com/username`)
6. **Discord** (`https://discord.gg/invite`)
7. **WhatsApp** (`https://wa.me/nomor`)
8. **Telegram** (`https://t.me/username`)
9. **Spotify** (`https://open.spotify.com/...`)
10. **LinkedIn** (`https://linkedin.com/in/username`)
11. **Twitch** (`https://twitch.tv/username`)
12. **Facebook** (`https://facebook.com/username`)
13. **Email Kontak** (`mailto:nama@domain.com`)

Setiap media sosial memiliki sakelar aktif/nonaktif mandiri dan hanya akan muncul di profil publik jika diaktifkan.

---

## 5. STUDIO DASHBOARD & LIVE PHONE PREVIEW

Ruang kerja terpadu bagi pemilik akun untuk mengelola seluruh aspek profil:

- **Sidebar Navigasi Modern:** Menu navigasi samping dengan penanda aktif menyala, ringkasan status langganan Pro, tautan langsung ke situs publik, dan tombol keluar (*Sign Out*).
- **Simulator Phone Frame Real-Time (Side-by-Side):**
  - Rangka ponsel pintar futuristik di sisi kanan layar desktop lengkap dengan *Dynamic Island*, tombol samping, dan bilah home indicator.
  - Setiap perubahan teks, warna tema, penambahan link, atau pengurutan link **langsung ter-update seketika** di dalam layar ponsel tanpa perlu memuat ulang halaman (*zero latency*).
  - Dilengkapi tombol *preview modal* untuk layar perangkat ponsel dan tablet.
- **Ringkasan Kartu Metrik (Overview):**
  - Total Impresi Profil (*Total Profile Views*).
  - Total Klik Tautan (*Total Destination Clicks*).
  - Rata-rata Konversi (*Click-Through Rate / CTR*).
  - Jumlah Destinasi Aktif.
- **Grafik Batang Neon Interaktif:** Membandingkan trafik *views* vs *clicks* dalam rentang waktu 7 hari atau 30 hari.
- **Peringkat Link Terpopuler:** Daftar 5 tautan dengan performa interaksi tertinggi.
- **Stream Aktivitas Real-Time:** Menampilkan log interaksi terbaru pengunjung (contoh: *"Clicked GitHub Repos from Tokyo, JP - 12 mins ago"*).

---

## 6. SISTEM KUSTOMISASI & TEMA

Menyediakan kebebasan visual untuk mencerminkan kepribadian digital:

- **8 Preset Tema Futuristik:**
  1. **Cyberpunk Neon:** Latar gradasi navy gelap, aksen hijau neon menyala, kartu glassmorphism.
  2. **Midnight Void:** Latar radial obsidian pekat, aksen sian elektrik, tombol pil halus.
  3. **Royal Amethyst:** Latar ungu malam mendalam, aksen violet bercahaya.
  4. **Crimson Cyber:** Latar pitch black gelap, aksen ruby merah menyala, garis tepi tegas.
  5. **Aurora Teal:** Latar nuansa teal kehijauan, aksen toska lembut.
  6. **Solar Flare:** Latar gradasi amber keemasan, aksen oranye matahari.
  7. **Matrix Code:** Latar hitam kode terminal, aksen hijau matriks, tipografi monospace.
  8. **Minimalist Onyx:** Latar matte hitam bersih, aksen putih minimalis monokrom.
- **Pemilih Warna Aksen Bebas:** Opsi warna hijau neon, biru elektrik, ungu, merah delima, oranye surya, dan putih.
- **Variasi Model Tombol:**
  - *Neon Glow* (efek berpendar dengan bayangan cahaya neon)
  - *Glassmorphism* (kaca transparan kabur buram)
  - *Solid Matte* (warna gelap solid dengan pinggiran presisi)
  - *Cyber Outline* (garis tepi neon dengan latar tembus pandang)
  - *Minimalist* (gaya datar monokrom)
- **Geometri Sudut (Border Radius):** Pilihan sudut tajam (4px), melengkung sedang (12px), membulat ekstra (20px), hingga pil penuh (*full pill*).
- **Pilihan Tipografi Modern:** Mendukung font *Space Grotesk, Outfit, Plus Jakarta Sans, Inter, dan JetBrains Mono*.
- **Hapus Branding Platform:** Opsi menyembunyikan label kredit MajidSpace untuk pengguna Pro.

---

## 7. SISTEM ANALITIK & TELEMETRI

Sistem telemetri mendalam yang ramah privasi (tanpa pelacak cookie invasif):

- **Filter Rentang Waktu:** Pilihan analisis 7 Hari Terakhir, 30 Hari Terakhir, dan Sepanjang Waktu (*All Time*).
- **Grafik Garis Waktu Trafik:** Visualisasi interaktif tren kunjungan dan interaksi harian.
- **Distribusi Kategori Perangkat:** Menampilkan persentase dan jumlah pengunjung berdasarkan perangkat:
  - *Mobile* (Ponsel Pintar)
  - *Desktop* (Komputer / Laptop)
  - *Tablet*
- **Sumber Rujukan Trafik (Referral Sources):** Pelacakan asal kedatangan pengunjung (*Instagram Bio, X/Twitter, Direct/QR Scan, YouTube, LinkedIn, dll.*).
- **Ekspor Data ke CSV:** Tombol ekspor satu klik untuk mengunduh seluruh data interaksi link ke dalam file spreadsheet `.csv`.

---

## 8. GENERATOR QR CODE & FITUR BERBAGI

- **Generator Kode QR Vektor Terintegrasi:** Menghasilkan kode QR presisi tinggi yang terhubung langsung ke URL publik pengguna.
- **Unduh QR Code (PNG):** Tombol simpan instan berformat gambar PNG resolusi tajam untuk keperluan kartu nama, presentasi, atau media cetak.
- **Salin URL Cepat:** Tombol salin satu klik dengan notifikasi toast dark-theme (*"Profile URL copied to clipboard"*).
- **Pemicu Native Web Share API:** Mendukung pembagian tautan langsung melalui dialog sistem operasi perangkat (Android / iOS / macOS / Windows).
- **Pintasan Berbagi Sosial:** Tombol kirim langsung ke X (Twitter), WhatsApp, LinkedIn, dan Facebook dengan template teks otomatis.

---

## 9. AUTENTIKASI & ARSITEKTUR DATABASE

- **Mode Ganda (Dual-Engine Ready):**
  1. *Mode Demo Instan:* Dapat diuji dan digunakan langsung 100% tanpa perlu konfigurasi API eksternal dengan data seed realistis (`@majid`).
  2. *Mode Cloud Supabase:* Langsung beralih ke database PostgreSQL nyata saat kredensial `.env.local` disematkan.
- **Fitur Autentikasi Pengguna:**
  - Registrasi Akun baru dengan validasi ketersediaan handle unik.
  - Halaman Masuk (*Login*) dengan opsi 1-Klik Akun Demo.
  - Alur Lupa Kata Sandi (*Forgot Password*).
  - Logout (*Sign Out*) aman.
- **Struktur Tabel PostgreSQL Lengkap (`supabase/schema.sql`):**
  - Tabel `profiles`: Data pengguna, status verifikasi, preferensi tema JSONB.
  - Tabel `links`: Tautan, penjadwalan, kategori, hitungan klik.
  - Tabel `social_accounts`: Platform sosial dan status tampil.
  - Tabel `analytics_events`: Pencatatan impresi dan klik per perangkat dan negara.
  - Tabel `subscriptions`: Tingkatan paket langganan (Free, Pro, VIP).
- **Row Level Security (RLS):** Kebijakan ketat di tingkat basis data yang memastikan pengguna hanya dapat mengubah data miliknya sendiri, sementara profil publik dan pencatatan event tetap dapat diakses anonim.
- **Trigger & Function Otomatis:**
  - Pemicu `on_auth_user_created` untuk pembuatan profil otomatis saat registrasi.
  - Fungsi atomik `increment_profile_views` dan `increment_link_clicks` guna mencegah *race condition*.

---

## 10. PENGATURAN AKUN & KEAMANAN

- **Informasi Kredensial:** Melihat status email terdaftar, ID pengguna unik, dan tingkatan paket langganan saat ini.
- **Pembaruan Kata Sandi:** Form penggantian password terenkripsi dengan konfirmasi sandi baru.
- **Ekspor Cadangan Profil (JSON Backup):** Mengunduh seluruh konfigurasi akun, daftar link, dan riwayat tema dalam bentuk berkas JSON lengkap.
- **Reset ke Data Bawaan (Reset Demo State):** Mengembalikan pengaturan ke data demo futuristik awal dengan satu klik.
- **Zona Berbahaya (Danger Zone):** Fitur hapus akun permanen dengan dialog konfirmasi pengetikan kata kunci untuk mencegah ketidaksengajaan.

---

## 11. SPESIFIKASI TEKNIS

| Komponen | Teknologi |
| :--- | :--- |
| **Framework Utama** | Next.js 16 (App Router, Server Components & Dynamic Rendering) |
| **Pustaka Antarmuka** | React 19 & TypeScript 5 |
| **Styling & Desain** | Tailwind CSS v4, Glassmorphism, CSS Custom Properties |
| **Animasi & Interaksi** | Framer Motion (Transisi Halus, Drag & Drop Reorder) |
| **Set Ikon** | Lucide React + Ikon Vektor SVG Khusus Brand |
| **Basis Data & Auth** | Supabase PostgreSQL dengan Row Level Security (RLS) |
| **Pengelolaan Form** | React Hook Form & Zod Schema Validation |
| **Sistem Notifikasi** | Sonner Toaster (Dark Cyber Theme) |
| **Utilitas QR Code** | `qrcode.react` (HTML5 Canvas Engine) |
| **Target Deployment** | Siap dideploy langsung ke **Vercel** |

---

*© MAJIDSPACE Platform. Diciptakan untuk memberdayakan identitas digital para kreator modern.*
