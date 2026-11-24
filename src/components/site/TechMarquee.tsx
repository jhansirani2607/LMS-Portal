"use client";

import { cn } from "@/lib/utils";

// Local list of technologies shown in the public marquee.
// (Centralized data.ts no longer exports a `technologies` array — this list
// reflects the stacks covered across our internship programs.)
const technologies: string[] = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Java",
  "Spring Boot",
  "Python",
  "Django",
  "Flask",
  "Flutter",
  "Dart",
  "AWS",
  "Docker",
  "Kubernetes",
  "GitHub Actions",
  "Terraform",
  "Tailwind CSS",
  "Figma",
  "scikit-learn",
  "TensorFlow",
  "Power BI",
];

/**
 * TechMarquee — infinite horizontal scroll of technology chips.
 * Pure CSS animation, pauses on hover, respects reduced-motion.
 */
export function TechMarquee({ className }: { className?: string }) {
  // Duplicate the list so the translateX(-50%) loop is seamless.
  const items = [...technologies, ...technologies];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        className
      )}
      aria-label="Technologies we work with"
    >
      {/* edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg-base)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--bg-base)] to-transparent" />

      <div className="marquee-track gap-3 py-2">
        {items.map((tech, i) => (
          <span
            key={`${tech}-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] whitespace-nowrap"
          >
            <span className="h-2 w-2 rounded-full bg-gradient-primary" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * TechChips — static (non-animated) chip cloud for service detail pages.
 */
export function TechChips({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {items.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-sm text-[var(--text-primary)] hover:border-[rgba(99,102,241,0.5)] transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-primary" />
          {t}
        </span>
      ))}
    </div>
  );
}

/**
 * StarRating — display a 1-5 star rating.
 */
export function StarRating({
  rating,
  size = 16,
  onChange,
  className,
}: {
  rating: number;
  size?: number;
  onChange?: (n: number) => void;
  className?: string;
}) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = Boolean(onChange);
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {stars.map((n) => {
        const filled = n <= rating;
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className={cn(
              interactive && "hover:scale-110 transition-transform cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#fbbf24" : "none"}
              stroke={filled ? "#fbbf24" : "#475569"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

/**
 * SampleBadge — small pill marking sample/placeholder content.
 */
export function SampleBadge({ label = "Sample", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400",
        className
      )}
    >
      {label}
    </span>
  );
}
