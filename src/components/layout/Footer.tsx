"use client";

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { contactInfo, avmCompanyInfo, internshipDomains } from "@/lib/data";
import type { NavigateFn, Page } from "@/lib/navigation";

interface FooterProps {
  onNavigate: NavigateFn;
}

export function Footer({ onNavigate }: FooterProps) {
  const socials = [
    { icon: Instagram, label: "Instagram", href: contactInfo.social.instagram },
    { icon: Facebook, label: "Facebook", href: contactInfo.social.facebook },
    { icon: Twitter, label: "X / Twitter", href: contactInfo.social.twitter },
    { icon: Linkedin, label: "LinkedIn", href: contactInfo.social.linkedin },
    { icon: Youtube, label: "YouTube", href: contactInfo.social.youtube },
  ];

  const quickLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Internships", page: "internships" },
    { label: "Learning", page: "learning" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <footer className="relative mt-auto border-t border-[var(--border)] bg-[var(--bg-surface)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-60" />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2.5 w-fit"
              aria-label="AVM Smart Solutions home"
            >
              <img src="/images/avm-logo.svg" alt="AVM Smart Solutions" className="h-10 w-10" />
              <span className="font-heading text-lg font-bold text-[var(--text-primary)]">
                AVM<span className="text-gradient"> Smart Solutions</span>
              </span>
            </button>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {avmCompanyInfo.tagline}. An internship-to-career platform based in
              Kurnool, Andhra Pradesh — building real engineering skills through
              mentor-led programs, project-based learning and verifiable certificates.
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-gradient font-semibold">
              &ldquo;{avmCompanyInfo.tagline}&rdquo;
            </p>
            <div className="flex items-center gap-2 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="rounded-lg p-2 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[rgba(99,102,241,0.5)] hover:bg-[rgba(99,102,241,0.1)] transition-colors"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => onNavigate(l.page)}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-left"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Internship Programs
            </h3>
            <ul className="flex flex-col gap-2.5">
              {internshipDomains.slice(0, 6).map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => onNavigate("internships")}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-left"
                  >
                    {d.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <button
                  onClick={() => onNavigate("register")}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-left"
                >
                  Register
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("login")}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-left"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("verify")}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-left"
                >
                  Verify Certificate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-left"
                >
                  FAQs
                </button>
              </li>
            </ul>

            <div className="mt-2 flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors"
              >
                <Mail size={15} className="text-[var(--primary)] shrink-0" />
                <span className="truncate">{contactInfo.email}</span>
              </a>
              <a
                href={contactInfo.phoneHref}
                className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors"
              >
                <Phone size={15} className="text-[var(--primary)] shrink-0" />
                {contactInfo.primaryPhone}
              </a>
              <a
                href={contactInfo.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors"
              >
                <MessageCircle size={15} className="text-[#25D366] shrink-0" />
                WhatsApp: {contactInfo.whatsapp}
              </a>
              <span className="flex items-start gap-2">
                <MapPin size={15} className="text-[var(--primary)] shrink-0 mt-0.5" />
                {contactInfo.address}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-secondary)] text-center sm:text-left">
            &copy; 2024-2026 AVM Smart Solutions. All rights reserved.{" "}
            <span className="text-gradient font-semibold">
              &ldquo;People Build Possibilities.&rdquo;
            </span>
          </p>
          <div className="flex items-center gap-5">
            <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Privacy Policy
            </button>
            <button className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}




