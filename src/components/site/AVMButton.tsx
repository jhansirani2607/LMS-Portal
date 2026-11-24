"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
 * AVM Button — wraps behavior with AVM gradient / outline / ghost styles.
 * Built on top of native button so we keep full control of styling.
 * ------------------------------------------------------------------ */

type Variant = "primary" | "outline" | "ghost" | "secondary";
type Size = "sm" | "md" | "lg";

interface AVMButtonProps extends React.ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm md:text-base",
  lg: "h-12 px-8 text-base",
};

const variantClasses: Record<Variant, string> = {
  primary:
    "btn-primary-gradient rounded-xl font-semibold shadow-glow-indigo",
  outline:
    "rounded-xl font-semibold border border-[rgba(99,102,241,0.5)] text-[var(--text-primary)] bg-transparent hover:bg-[rgba(99,102,241,0.1)] transition-colors",
  secondary:
    "rounded-xl font-semibold bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[rgba(99,102,241,0.5)] transition-colors",
  ghost:
    "rounded-xl font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors",
};

export function AVMButton({
  variant = "primary",
  size = "md",
  fullWidth,
  icon,
  iconRight,
  className,
  children,
  ...props
}: AVMButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap outline-none transition-all disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
