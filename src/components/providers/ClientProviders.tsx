"use client";

import React from "react";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        visibleToasts={1}
        expand={false}
        duration={2200}
        closeButton={false}
        toastOptions={{
          style: {
            background: "#0f172a",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            color: "#f8fafc",
            borderRadius: "14px",
            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 15px rgba(16, 185, 129, 0.1)",
            padding: "12px 16px",
            fontSize: "13px",
            userSelect: "none",
            cursor: "pointer",
          },
          className: "select-none transition-all duration-200",
        }}
      />
    </AppProvider>
  );
}
