"use client";

import { useToast } from "@/hooks/use-toast";

/**
 * useAVMToast — thin wrapper around the shadcn toaster that returns
 * helpers for success / error / info messages used by all forms.
 */
export function useAVMToast() {
  const { toast } = useToast();

  return {
    success(title: string, description?: string) {
      toast({
        title,
        description,
        className:
          "bg-[var(--bg-surface)] border-[rgba(34,197,94,0.4)] text-[var(--text-primary)]",
      });
    },
    error(title: string, description?: string) {
      toast({
        variant: "destructive",
        title,
        description,
      });
    },
    info(title: string, description?: string) {
      toast({
        title,
        description,
        className:
          "bg-[var(--bg-surface)] border-[rgba(99,102,241,0.4)] text-[var(--text-primary)]",
      });
    },
  };
}
