"use client";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li" | "span";
}

/**
 * Reveal — wraps children with the `.reveal` class and applies a staggered
 * transition delay. Visibility is toggled by the global useReveal hook when
 * the element scrolls into view. Pairs with the `.is-visible` CSS rule.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  // We attach reveal + is-visible via a small inline IntersectionObserver
  // using a ref callback so this component is self-contained.
  const ref = (node: HTMLElement | null) => {
    if (!node) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("is-visible");
            obs.unobserve(node);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
  };

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
