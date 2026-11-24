"use client";

import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * SectionTitle — reusable eyebrow + H2 + subtitle header with scroll reveal.
 */
export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionTitleProps) {
  const { ref } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "reveal max-w-3xl mb-12 md:mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gradient mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.5rem] font-bold leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
