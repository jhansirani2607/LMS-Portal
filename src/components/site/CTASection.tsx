"use client";

import { AVMButton } from "@/components/site/AVMButton";
import type { NavigateFn } from "@/lib/navigation";

interface CTASectionProps {
  heading?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryPage?: Parameters<NavigateFn>[0];
  secondaryLabel?: string;
  secondaryPage?: Parameters<NavigateFn>[0];
  onNavigate: NavigateFn;
}

/**
 * CTASection — gradient banner used at the bottom of most pages.
 * Uses a CSS gradient background (no cta-bg.jpg dependency).
 */
export function CTASection({
  heading = "Ready to start your engineering journey?",
  subtitle = "Register as a student, get matched with an industry mentor, and start building real projects from day one.",
  primaryLabel = "Register Now",
  primaryPage = "register",
  secondaryLabel = "Explore Internships",
  secondaryPage = "internships",
  onNavigate,
}: CTASectionProps) {
  return (
    <section className="px-4 sm:px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="relative overflow-hidden rounded-3xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[#1a2238] via-[#2a1f4d] to-[#3d1a52] px-6 py-14 md:px-14 md:py-20 text-center">
          {/* glow orbs */}
          <div className="glow-orb top-[-60px] left-[-60px] h-48 w-48 bg-[var(--primary)]" />
          <div className="glow-orb bottom-[-60px] right-[-60px] h-48 w-48 bg-[var(--accent)]" />
          <div className="absolute inset-0 bg-grid opacity-30" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-2xl">
              {heading}
            </h2>
            <p className="text-base md:text-lg text-white/80 max-w-xl">{subtitle}</p>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <AVMButton size="lg" onClick={() => onNavigate(primaryPage)}>
                {primaryLabel}
              </AVMButton>
              <AVMButton
                size="lg"
                variant="outline"
                onClick={() => onNavigate(secondaryPage)}
                className="border-white/40 text-white hover:bg-white/10"
              >
                {secondaryLabel}
              </AVMButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
