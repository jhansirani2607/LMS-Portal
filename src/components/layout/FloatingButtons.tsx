"use client";

import { Phone, MessageCircle } from "lucide-react";
import { contactInfo } from "@/lib/data";

/**
 * FloatingButtons — fixed bottom-right phone + WhatsApp quick actions.
 * Real AVM numbers from data.ts (contactInfo).
 */
export function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={contactInfo.phoneHref}
        aria-label="Call us"
        title={`Call us: ${contactInfo.primaryPhone}`}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full btn-primary-gradient text-white shadow-glow-indigo pulse-ring"
      >
        <Phone size={22} />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
          Call: {contactInfo.primaryPhone}
        </span>
      </a>
      <a
        href={contactInfo.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title={`WhatsApp: ${contactInfo.whatsapp}`}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_1px_rgba(37,211,102,0.3),0_12px_40px_-10px_rgba(37,211,102,0.5)] hover:scale-105 transition-transform"
      >
        <MessageCircle size={22} />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
          WhatsApp: {contactInfo.whatsapp}
        </span>
      </a>
    </div>
  );
}
