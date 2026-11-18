"use client";

export interface UserAccount {
  email: string;
  password: string;
  username: string;
  displayName: string;
  createdAt: string;
}

const ACCOUNTS_STORAGE_KEY = "sendlnk_registered_accounts_v1";
const CURRENT_SESSION_EMAIL_KEY = "sendlnk_session_email";

// Default seed accounts for testing
export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    email: "user@sendlnk.com",
    password: "password123",
    username: "sendlink",
    displayName: "SendLNK User",
    createdAt: new Date().toISOString(),
  },
  {
    email: "admin@sendlnk.com",
    password: "admin123",
    username: "admin",
    displayName: "Administrator",
    createdAt: new Date().toISOString(),
  },
];

export function getStoredAccounts(): UserAccount[] {
  if (typeof window === "undefined") return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function saveAccount(account: UserAccount): boolean {
  if (typeof window === "undefined") return false;
  try {
    const accounts = getStoredAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.email.toLowerCase() === account.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      accounts[existingIndex] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch {
    return false;
  }
}

export function registerAccount(account: UserAccount): { success: boolean; message: string } {
  const cleanEmail = account.email.trim().toLowerCase();
  const accounts = getStoredAccounts();

  const exists = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (exists) {
    return {
      success: false,
      message: "Email ini sudah terdaftar. Silakan masuk menggunakan email ini.",
    };
  }

  saveAccount({
    ...account,
    email: cleanEmail,
  });
  setCurrentUserEmail(cleanEmail);

  return {
    success: true,
    message: `Akun @${account.username} berhasil didaftarkan!`,
  };
}

export function verifyCredentials(
  email: string,
  pass: string
): { success: boolean; message: string; account?: UserAccount } {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!account) {
    return {
      success: false,
      message: "Email belum terdaftar. Silakan buat akun baru terlebih dahulu.",
    };
  }

  if (account.password !== pass) {
    return {
      success: false,
      message: "Kata sandi salah. Silakan periksa kembali kata sandi Anda.",
    };
  }

  setCurrentUserEmail(cleanEmail);
  return {
    success: true,
    message: `Selamat datang kembali, ${account.displayName || account.username}!`,
    account,
  };
}

export function getCurrentUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_SESSION_EMAIL_KEY);
}

export function isUserLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  const email = localStorage.getItem(CURRENT_SESSION_EMAIL_KEY);
  const cookieAuth = document.cookie.includes("app_auth=true");
  return Boolean(email && cookieAuth);
}

export function setCurrentUserEmail(email: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_SESSION_EMAIL_KEY, email.trim().toLowerCase());
  document.cookie = "app_auth=true; path=/; max-age=604800; SameSite=Lax";
}

export function updateAccountPassword(
  email: string,
  currentPass: string,
  newPass: string
): { success: boolean; message: string } {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!account) {
    return {
      success: false,
      message: "Akun pengguna tidak ditemukan.",
    };
  }

  if (account.password !== currentPass) {
    return {
      success: false,
      message: "Kata sandi saat ini salah.",
    };
  }

  account.password = newPass;
  saveAccount(account);
  return {
    success: true,
    message: "Kata sandi berhasil diperbarui!",
  };
}

const OTP_STORAGE_KEY = "sendlnk_reset_otp_v1";

interface StoredOtp {
  email: string;
  code: string;
  expiresAt: number;
}

export function generateResetCode(email: string): { success: boolean; code?: string; message: string } {
  if (typeof window === "undefined") {
    return { success: false, message: "Operasi hanya dapat dilakukan di browser." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!account) {
    return {
      success: false,
      message: "Email belum terdaftar. Silakan buat akun baru terlebih dahulu.",
    };
  }

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otpData: StoredOtp = {
    email: cleanEmail,
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // Valid 15 minutes
  };

  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));

  return {
    success: true,
    code,
    message: "Kode verifikasi 6 digit berhasil dibuat!",
  };
}

export function resetPasswordWithCode(
  email: string,
  code: string,
  newPass: string
): { success: boolean; message: string } {
  if (typeof window === "undefined") {
    return { success: false, message: "Operasi hanya dapat dilakukan di browser." };
  }

  const cleanEmail = email.trim().toLowerCase();
  const rawOtp = localStorage.getItem(OTP_STORAGE_KEY);

  if (!rawOtp) {
    return {
      success: false,
      message: "Tidak ada kode verifikasi aktif. Silakan minta kode baru.",
    };
  }

  try {
    const otpData: StoredOtp = JSON.parse(rawOtp);
    if (otpData.email !== cleanEmail) {
      return {
        success: false,
        message: "Email tidak sesuai dengan permintaan kode verifikasi.",
      };
    }

    if (Date.now() > otpData.expiresAt) {
      localStorage.removeItem(OTP_STORAGE_KEY);
      return {
        success: false,
        message: "Kode verifikasi telah kedaluwarsa. Silakan minta kode baru.",
      };
    }

    if (otpData.code !== code.trim()) {
      return {
        success: false,
        message: "Kode verifikasi salah. Silakan periksa kembali kode Anda.",
      };
    }

    const accounts = getStoredAccounts();
    const account = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!account) {
      return {
        success: false,
        message: "Akun pengguna tidak ditemukan.",
      };
    }

    account.password = newPass.trim();
    saveAccount(account);
    localStorage.removeItem(OTP_STORAGE_KEY);

    return {
      success: true,
      message: "Kata sandi berhasil diatur ulang! Silakan masuk dengan kata sandi baru.",
    };
  } catch {
    return {
      success: false,
      message: "Terjadi kesalahan saat memverifikasi kode.",
    };
  }
}
