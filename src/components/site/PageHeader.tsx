"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * PageHeader — consistent hero header for inner pages.
 * Includes glow orbs and grid background.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  className,
  children,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-surface)] pt-32 pb-16 md:pt-40 md:pb-20",
        className
      )}
    >
      {/* glow orbs */}
      <div className="glow-orb top-[-80px] left-[-60px] h-56 w-56 bg-[var(--primary)]" />
      <div className="glow-orb bottom-[-80px] right-[-60px] h-56 w-56 bg-[var(--accent)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 text-center">
        {eyebrow && (
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gradient mb-3">
            {eyebrow}
          </span>
        )}
        <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
