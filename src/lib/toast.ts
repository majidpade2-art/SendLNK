import { toast as sonnerToast } from "sonner";

// Cooldown tracker to prevent duplicate or stacked toasts when double-clicking
const cooldownMap = new Map<string, number>();

function canNotify(key: string, cooldownMs = 800): boolean {
  const now = Date.now();
  const lastTime = cooldownMap.get(key) || 0;
  if (now - lastTime < cooldownMs) {
    return false; // Throttled / debounced
  }
  cooldownMap.set(key, now);

  // Periodic cleanup
  if (cooldownMap.size > 50) {
    for (const [k, timestamp] of cooldownMap.entries()) {
      if (now - timestamp > 5000) {
        cooldownMap.delete(k);
      }
    }
  }
  return true;
}

/**
 * Deduplicated, debounced notification helper.
 * Prevents multiple overlapping toasts and visual glitches when buttons or UI elements are double-clicked.
 */
export const notify = {
  success: (message: string, id?: string) => {
    const toastId = id || message.slice(0, 35).toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (!canNotify(toastId)) return toastId;
    return sonnerToast.success(message, {
      id: toastId,
      duration: 2200,
    });
  },
  info: (message: string, id?: string) => {
    const toastId = id || message.slice(0, 35).toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (!canNotify(toastId)) return toastId;
    return sonnerToast.info(message, {
      id: toastId,
      duration: 2200,
    });
  },
  error: (message: string, id?: string) => {
    const toastId = id || message.slice(0, 35).toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (!canNotify(toastId)) return toastId;
    return sonnerToast.error(message, {
      id: toastId,
      duration: 2800,
    });
  },
  dismiss: (id?: string) => {
    return sonnerToast.dismiss(id);
  },
};
