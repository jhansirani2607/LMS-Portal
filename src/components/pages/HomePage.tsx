"use client";

import * as React from "react";
import { ArrowRight, Sparkles, Rocket, Users, ClipboardCheck, Award, CalendarClock } from "lucide-react";
import { TechMarquee } from "@/components/site/TechMarquee";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Reveal } from "@/components/site/Reveal";
import { Icon } from "@/components/site/Icon";
import { AVMButton } from "@/components/site/AVMButton";
import {
  homeStats,
  internshipDomains,
  internshipBenefits,
  howItWorksSteps,
  avmCompanyInfo,
} from "@/lib/data";
import type { NavigateFn } from "@/lib/navigation";

interface HomePageProps {
  onNavigate: NavigateFn;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const featuredDomains = internshipDomains.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image + dark overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-1.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,14,26,0.85)] via-[rgba(10,14,26,0.78)] to-[var(--bg-base)]" />
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>
        {/* glow orbs */}
        <div className="glow-orb top-[-80px] left-[-60px] h-72 w-72 bg-[var(--primary)]" />
        <div className="glow-orb bottom-[-80px] right-[-60px] h-72 w-72 bg-[var(--accent)]" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 pt-36 pb-24 md:pt-48 md:pb-32 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(99,102,241,0.4)] bg-[rgba(99,102,241,0.1)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]">
              <Sparkles size={14} className="text-[var(--accent)]" />
              AVM Smart Internship &amp; LMS Platform
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-[var(--text-primary)]">
              Learn. Build.{" "}
              <span className="text-gradient">Get Job-Ready.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
              Mentor-led internships across 8 in-demand engineering domains.
              Real projects, weekly code reviews, a verifiable certificate and
              placement assistance — all from {avmCompanyInfo.location}.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <AVMButton
                size="lg"
                onClick={() => onNavigate("register")}
                icon={<Rocket size={18} />}
              >
                Register Now
              </AVMButton>
              <AVMButton
                size="lg"
                variant="outline"
                onClick={() => onNavigate("internships")}
                iconRight={<ArrowRight size={18} />}
              >
                Explore Internships
              </AVMButton>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-5 text-xs text-[var(--text-secondary)]">
              {avmCompanyInfo.tagline} • Founded by {avmCompanyInfo.founder.name}
            </p>
          </Reveal>
        </div>
      </section>

     

      {/* About AVM Smart snippet + stats */}
      <section className="px-4 sm:px-6 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-14">
            <Reveal>
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gradient mb-3">
                About AVM Smart
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight text-[var(--text-primary)]">
                Bridging academia and industry through mentorship.
              </h2>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                AVM Smart Solutions is a Kurnool-based engineering company that
                ships real products and trains the next generation of developers.
                Our internship platform pairs every student with an industry mentor
                from our 11-member engineering team, so you learn exactly what
                employers need — by building real software, not watching tutorials.
              </p>
              <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                Founded by {avmCompanyInfo.founder.name}, {avmCompanyInfo.founder.title},
                we combine enterprise product development with structured,
                project-based learning and verifiable certifications.
              </p>
              <div className="mt-6">
                <AVMButton
                  variant="outline"
                  onClick={() => onNavigate("about")}
                  iconRight={<ArrowRight size={16} />}
                >
                  Learn More
                </AVMButton>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {homeStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 sm:p-6 text-center"
                  >
                    <div className="font-heading text-4xl md:text-5xl font-bold text-gradient">
                      {stat.value}
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{stat.label}</p>
                  </div>
                ))}
                {/* 4th stat card — Mentors */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 sm:p-6 text-center">
                  <div className="font-heading text-4xl md:text-5xl font-bold text-gradient">11</div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Industry Mentors</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="Internship Domains"
            title="Choose your Internship track"
            subtitle="Eight industry-aligned internship programs with structured curriculum, real projects and verifiable certificates."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredDomains.map((domain, i) => (
              <Reveal key={domain.id} delay={i * 70}>
                <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white">
                    <Icon name={domain.icon} size={24} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                      {domain.duration}
                    </span>
                    <span
                      className={
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                        (domain.level === "Beginner"
                          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                          : domain.level === "Intermediate"
                          ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                          : "border-red-500/30 bg-red-500/15 text-red-300")
                      }
                    >
                      {domain.level}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {domain.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 flex-1">
                    {domain.description}
                  </p>
                  <div className="mt-4">
                    <AVMButton
                      size="sm"
                      variant="outline"
                      fullWidth
                      onClick={() => onNavigate("internships")}
                      iconRight={<ArrowRight size={15} />}
                    >
                      Apply Now
                    </AVMButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <AVMButton
              variant="secondary"
              size="md"
              onClick={() => onNavigate("internships")}
              iconRight={<ArrowRight size={16} />}
            >
              View All 8 Domains
            </AVMButton>
          </div>
        </div>
      </section>

      {/* Internship Benefits */}
      <section className="px-4 sm:px-6 py-20 md:py-28">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="Why AVM"
            title="What you get as an AVM intern"
            subtitle="Every internship is designed around real outcomes — portfolio, mentorship, certificate and placement support."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {internshipBenefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 70}>
                <div className="card-hover h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-white">
                    <Icon name={benefit.icon} size={22} />
                  </div>
                  <h4 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-20 md:py-28 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="How It Works"
            title="From registration to certificate"
            subtitle="Four simple steps take you from signing up to a verifiable certificate and placement assistance."
          />
          <div className="relative">
            {/* connecting line */}
            <div className="hidden lg:block absolute top-7 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-40" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
              {howItWorksSteps.map((step, i) => (
                <Reveal key={step.step} delay={i * 100} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(99,102,241,0.4)] bg-[var(--bg-elevated)] text-[var(--primary)] shadow-glow-indigo">
                      <Icon name={step.icon} size={26} />
                    </div>
                    <div className="mt-4 text-xs font-semibold text-[var(--accent)]">
                      Step {step.step}
                    </div>
                    <h4 className="mt-1 font-heading text-lg font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </h4>
                    <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="relative overflow-hidden rounded-3xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[#1a2238] via-[#2a1f4d] to-[#3d1a52] px-6 py-14 md:px-14 md:py-20 text-center">
            <div className="glow-orb top-[-60px] left-[-60px] h-48 w-48 bg-[var(--primary)]" />
            <div className="glow-orb bottom-[-60px] right-[-60px] h-48 w-48 bg-[var(--accent)]" />
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 text-amber-300">
                {[Rocket, Users, ClipboardCheck, Award, CalendarClock].map((Ic, idx) => (
                  <Ic key={idx} size={20} />
                ))}
              </div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-2xl">
                Ready to start your Internship journey?
              </h2>
              <p className="text-base md:text-lg text-white/80 max-w-xl">
                Register as a student, get matched with an industry mentor, and
                start building real projects from day one.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                <AVMButton size="lg" onClick={() => onNavigate("register")} icon={<Rocket size={18} />}>
                  Register Now
                </AVMButton>
                <AVMButton
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate("internships")}
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Explore Internships
                </AVMButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
