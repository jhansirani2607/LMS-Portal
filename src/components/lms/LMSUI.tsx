"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

/**
 * LMS progress bar — indigo→purple gradient fill on a dark track.
 * Reused across My Courses, Course View, Lesson Player, Dashboard.
 */
export function ProgressBar({
  value,
  className,
  showLabel,
  size = "md",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs font-semibold text-[var(--text-primary)] tabular-nums">
          {pct}%
        </span>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const badgeVariants: Record<NonNullable<StatusBadgeProps["variant"]>, string> = {
  neutral: "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border)]",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  danger: "bg-red-500/15 text-red-300 border-red-500/30",
  info: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
};

export function StatusBadge({ status, variant = "neutral", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
        badgeVariants[variant],
        className
      )}
    >
      {status}
    </span>
  );
}

interface CourseThumbProps {
  gradient: string; // tailwind gradient class like "from-[#f59e0b] to-[#ef4444]"
  category: string;
  className?: string;
}

/**
 * Renders a course thumbnail as a gradient banner with the category label.
 */
export function CourseThumb({ gradient, category, className }: CourseThumbProps) {
  return (
    <div
      className={cn(
        "relative h-28 w-full overflow-hidden rounded-xl bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute bottom-2 left-3">
        <span className="rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
          {category}
        </span>
      </div>
    </div>
  );
}
