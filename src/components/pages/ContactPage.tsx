"use client";

import * as React from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Reveal } from "@/components/site/Reveal";
import { FormField } from "@/components/site/FormField";
import { AVMButton } from "@/components/site/AVMButton";
import { CTASection } from "@/components/site/CTASection";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { contactInfo, faqs } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/lib/navigation";

interface ContactPageProps {
  onNavigate: NavigateFn;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initial: FormData = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactPage({ onNavigate }: ContactPageProps) {
  const { submit, loading } = useFormSubmit();
  const [data, setData] = React.useState<FormData>(initial);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const set = (key: keyof FormData) => (value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!data.name.trim()) errs.name = "Name is required";
    if (!data.email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(data.email)) errs.email = "Enter a valid email";
    if (!data.subject.trim()) errs.subject = "Subject is required";
    if (!data.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submit(data, {
      endpoint: "/api/contact",
      successTitle: "Message sent!",
      successDescription: "We'll get back to you within 1 business day.",
      onSuccess: () => setData(initial),
    });
  };

  const contactCards = [
    {
      icon: Mail,
      label: "Email",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      color: "from-[#6366f1] to-[#a855f7]",
    },
    {
      icon: Phone,
      label: "Phones",
      value: contactInfo.phones.join(" • "),
      href: contactInfo.phoneHref,
      color: "from-[#22d3ee] to-[#6366f1]",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: contactInfo.whatsapp,
      href: contactInfo.whatsappHref,
      color: "from-[#22c55e] to-[#10b981]",
    },
    {
      icon: MapPin,
      label: "Address",
      value: contactInfo.address,
      href: "#map",
      color: "from-[#f59e0b] to-[#ef4444]",
    },
  ];

  const socials = [
    { icon: Instagram, label: "Instagram", href: contactInfo.social.instagram, color: "hover:text-pink-400" },
    { icon: Facebook, label: "Facebook", href: contactInfo.social.facebook, color: "hover:text-[#1877f2]" },
    { icon: Twitter, label: "X / Twitter", href: contactInfo.social.twitter, color: "hover:text-slate-300" },
    { icon: Linkedin, label: "LinkedIn", href: contactInfo.social.linkedin, color: "hover:text-[#0a66c2]" },
    { icon: Youtube, label: "YouTube", href: contactInfo.social.youtube, color: "hover:text-red-500" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        subtitle="Questions about internships, certificates or anything else? We're here to help — reach us via the form, email, phone or WhatsApp."
      />

      {/* Contact cards */}
      <section className="px-4 sm:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.label} delay={i * 70}>
                  <a
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="card-hover block h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                      <Icon size={22} />
                    </div>
                    <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                      {card.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--text-primary)] break-words">
                      {card.value}
                    </p>
                  </a>
                </Reveal>
              );
            })}
          </div>

          {/* Office hours */}
          <Reveal delay={200}>
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] py-3 px-4 text-sm text-[var(--text-secondary)]">
              <Clock size={15} className="text-[var(--primary)]" />
              Office Hours: {contactInfo.officeHours}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Form + Socials */}
      <section className="px-4 sm:px-6 py-16 md:py-20 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Reveal>
            <div>
              <SectionTitle
                eyebrow="Contact Form"
                title="Send us a message"
                align="left"
              />
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
                noValidate
              >
                <FormField
                  id="name"
                  label="Name"
                  required
                  value={data.name}
                  onChange={set("name")}
                  error={errors.name}
                  placeholder="Your name"
                />
                <FormField
                  id="email"
                  label="Email"
                  required
                  inputType="email"
                  value={data.email}
                  onChange={set("email")}
                  error={errors.email}
                  placeholder="you@example.com"
                />
                <div className="sm:col-span-2">
                  <FormField
                    id="subject"
                    label="Subject"
                    required
                    value={data.subject}
                    onChange={set("subject")}
                    error={errors.subject}
                    placeholder="What's this about?"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FormField
                    id="message"
                    label="Message"
                    type="textarea"
                    required
                    rows={5}
                    value={data.message}
                    onChange={set("message")}
                    error={errors.message}
                    placeholder="Type your message..."
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <AVMButton
                    type="submit"
                    size="lg"
                    disabled={loading}
                    icon={<Send size={18} />}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </AVMButton>
                </div>
              </form>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div>
              <SectionTitle
                eyebrow="Follow Us"
                title="Stay connected"
                align="left"
              />
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-6 md:p-8">
                <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
                  Follow AVM Smart Solutions on social media for internship
                  announcements, student project showcases, tutorials from{" "}
                  <span className="text-[var(--text-primary)] font-medium">
                    {contactInfo.email}
                  </span>{" "}
                  and career tips.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[rgba(99,102,241,0.5)]",
                          s.color
                        )}
                      >
                        <Icon size={18} className="text-[var(--primary)]" />
                        <span className="flex-1">{s.label}</span>
                        {s.href === contactInfo.social.instagram && (
                          <span className="text-xs text-[var(--text-secondary)]">@avmsmart</span>
                        )}
                      </a>
                    );
                  })}
                </div>
                <div className="mt-5 pt-5 border-t border-[var(--border)] flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:text-[var(--text-primary)]">
                    <Mail size={15} className="text-[var(--primary)]" /> {contactInfo.email}
                  </a>
                  <a href={contactInfo.phoneHref} className="flex items-center gap-2 hover:text-[var(--text-primary)]">
                    <Phone size={15} className="text-[var(--primary)]" /> {contactInfo.primaryPhone}
                  </a>
                  <span className="flex items-start gap-2">
                    <MapPin size={15} className="text-[var(--primary)] mt-0.5" /> {contactInfo.address}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-4 sm:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="FAQs"
            title="Frequently asked questions"
            subtitle="Everything you need to know about AVM internships, certificates, mentorship and more."
          />
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={i} delay={i * 40}>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                      aria-expanded={open}
                    >
                      <span className="text-sm md:text-base font-semibold text-[var(--text-primary)]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={cn(
                          "shrink-0 text-[var(--text-secondary)] transition-transform",
                          open && "rotate-180"
                        )}
                      />
                    </button>
                    {open && (
                      <div className="px-5 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="px-4 sm:px-6 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]">
            <iframe
              title="AVM Smart Solutions — Kurnool, Andhra Pradesh"
              src="https://www.openstreetmap.org/export/embed.html?bbox=78.0%2C15.78%2C78.20%2C15.88&layer=mapnik&marker=15.83%2C78.10"
              className="w-full h-[360px] grayscale-[0.3]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <CTASection onNavigate={onNavigate} />
    </>
  );
}
