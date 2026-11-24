"use client";

import * as React from "react";
import { useAVMToast } from "@/hooks/use-avm-toast";

interface SubmitOptions {
  endpoint: string;
  // Optional port override (not used here — all routes served on 3000)
  port?: number;
  successTitle?: string;
  successDescription?: string;
  onSuccess?: () => void;
}

/**
 * useFormSubmit — handles POST to an API route with loading + toast states.
 * Degrades gracefully: even if the fetch fails, we surface a friendly message.
 */
export function useFormSubmit() {
  const toast = useAVMToast();
  const [loading, setLoading] = React.useState(false);

  const submit = React.useCallback(
    async (payload: Record<string, unknown>, options: SubmitOptions) => {
      setLoading(true);
      try {
        const res = await fetch(options.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json().catch(() => ({}))) as {
          success?: boolean;
          error?: string;
        };
        if (res.ok && data.success !== false) {
          toast.success(
            options.successTitle ?? "Submitted successfully!",
            options.successDescription ?? "We'll be in touch with you soon."
          );
          options.onSuccess?.();
          return true;
        }
        // The API is designed to always return success:true even on DB failure,
        // so this branch is mostly defensive.
        toast.error(
          "Submission failed",
          data.error ?? "Please try again in a moment."
        );
        return false;
      } catch {
        // Network / unexpected error — surface friendly message.
        toast.error(
          "Network error",
          "Please check your connection and try again."
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { submit, loading };
}
