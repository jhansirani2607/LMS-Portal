"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Reveal } from "@/components/site/Reveal";
import { Icon } from "@/components/site/Icon";
import { AVMButton } from "@/components/site/AVMButton";
import { CTASection } from "@/components/site/CTASection";
import {
  avmCompanyInfo,
  visionMission,
  learningApproach,
  teamLeadership,
} from "@/lib/data";
import type { NavigateFn } from "@/lib/navigation";

interface AboutPageProps {
  onNavigate: NavigateFn;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="About AVM Smart Solutions"
        subtitle="A Kurnool-based engineering company building real products while training the next generation of developers through mentor-led internships."
      />

      {/* Company introduction */}
      <section className="px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal>
            <div className="space-y-5 text-[var(--text-secondary)] leading-relaxed">
              <p>
                <span className="text-[var(--text-primary)] font-semibold">AVM Smart Solutions</span>{" "}
                is a technology company based in {avmCompanyInfo.location}, founded by{" "}
                {avmCompanyInfo.founder.name}, {avmCompanyInfo.founder.title}. We build
                enterprise-grade digital products — websites, mobile apps, cloud
                platforms and AI/ML solutions — while running a structured,
                mentorship-driven internship and Learning Management System (LMS)
                for aspiring engineers.
              </p>
              <p>
                Our mission is to bridge the gap between academic learning and
                industry-ready engineering. Every intern is matched with a mentor
                from our {avmCompanyInfo.teamSize}-member engineering team, works on
                real production-style projects, and earns a verifiable certificate
                upon successful completion.
              </p>
              <p>
                We treat every student as a future colleague. Our curriculum is
                designed and continuously updated by engineers who ship production
                software daily, so what you learn here is exactly what employers
                are hiring for.
              </p>
              <p className="text-gradient font-semibold italic text-lg">
                &ldquo;{avmCompanyInfo.tagline}.&rdquo;
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-primary opacity-20 blur-2xl" />
              <img
                src="/images/about-team.jpg"
                alt="The AVM Smart Solutions engineering team"
                className="relative rounded-2xl border border-[var(--border)] w-full h-auto object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-4 sm:px-6 py-16 md:py-20 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="Our Compass"
            title="Vision &amp; Mission"
            subtitle="The principles that guide every product we build and every student we mentor."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visionMission.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="card-hover h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white">
                    <Icon name={item.icon} size={28} />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-[var(--text-primary)] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Approach */}
      <section className="px-4 sm:px-6 py-16 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="How We Teach"
            title="Our Learning Approach"
            subtitle="Four pillars that define how an AVM internship turns motivated learners into confident, industry-ready engineers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {learningApproach.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="card-hover h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-white">
                    <Icon name={item.icon} size={22} />
                  </div>
                  <h4 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="px-4 sm:px-6 py-16 md:py-24 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="Leadership"
            title="The people behind AVM"
            subtitle="An experienced founding team backed by an 11-member engineering organization."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamLeadership.map((leader, i) => (
              <Reveal key={leader.name} delay={i * 80}>
                <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-6 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-2xl font-bold text-white shadow-glow-indigo">
                    {leader.initials}
                  </div>
                  <h4 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                    {leader.name}
                  </h4>
                  <p className="mt-1 text-sm text-gradient font-semibold">{leader.role}</p>
                  <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {leader.expertise}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <div className="mt-10 flex items-center justify-center gap-2 rounded-xl border border-[rgba(99,102,241,0.3)] bg-[rgba(99,102,241,0.08)] py-4 px-6 max-w-2xl mx-auto text-center">
              <Icon name="Users" size={18} className="text-[var(--primary)] shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">
                Powered by an{" "}
                <span className="text-[var(--text-primary)] font-semibold">
                  11-member engineering team
                </span>{" "}
                across MERN, Java, AI/ML, Cloud/DevOps, UI/UX, Python and Data Analytics.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-4 sm:px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[1200px] flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:p-8">
          <div className="text-center sm:text-left">
            <h3 className="font-heading text-xl md:text-2xl font-semibold text-[var(--text-primary)]">
              Want to learn from our team?
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Explore 8 mentor-led internship domains and apply in minutes.
            </p>
          </div>
          <AVMButton
            size="lg"
            onClick={() => onNavigate("internships")}
            iconRight={<ArrowRight size={18} />}
          >
            Explore Internships
          </AVMButton>
        </div>
      </section>

      <CTASection onNavigate={onNavigate} />
    </>
  );
}
