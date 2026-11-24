"use client";

import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Reveal } from "@/components/site/Reveal";
import { Icon } from "@/components/site/Icon";
import { AVMButton } from "@/components/site/AVMButton";
import { CTASection } from "@/components/site/CTASection";
import { learningFeatures, learningExtraFeatures, learningSteps } from "@/lib/data";
import type { NavigateFn } from "@/lib/navigation";

interface LearningPageProps {
  onNavigate: NavigateFn;
}

export function LearningPage({ onNavigate }: LearningPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Learning"
        title="Our Learning Management System"
        subtitle="A structured, mentor-reviewed LMS that powers every AVM internship — from video lessons and assignments to quizzes, projects and verifiable certificates."
      />

      {/* Intro */}
      <section className="px-4 sm:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white">
              <Icon name="Sparkles" size={28} />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
              Everything you need to learn, build &amp; get certified.
            </h2>
            <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
              The AVM Smart LMS brings together structured learning materials,
              hands-on assignments, auto-graded quizzes, real projects and a
              transparent progress dashboard — all reviewed by your dedicated
              mentor from our engineering team. Once you complete a course, you
              earn a verifiable certificate with a unique ID recruiters can
              validate online.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-4 sm:px-6 py-16 md:py-20 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="Features"
            title="A complete learning experience"
            subtitle="Five core features that turn passive watching into active, mentor-reviewed engineering practice."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {learningFeatures.map((feature, i) => (
              <Reveal
                key={feature.title}
                delay={i * 70}
                className={i === learningFeatures.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <div className="card-hover h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white">
                    <Icon name={feature.icon} size={24} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Extra features strip */}
      <section className="px-4 sm:px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6">
              Plus everything you need to stay on track
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {learningExtraFeatures.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)]"
                >
                  <Icon name={item.icon} size={16} className="text-[var(--primary)]" />
                  {item.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* How students learn */}
      <section className="px-4 sm:px-6 py-16 md:py-24 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="How Students Learn"
            title="From lesson to certified"
            subtitle="A simple three-step loop that repeats across every module of your internship."
          />
          <div className="relative">
            <div className="hidden lg:block absolute top-7 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-40" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {learningSteps.map((step, i) => (
                <Reveal key={step.step} delay={i * 100}>
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
            <div className="relative z-10 flex flex-col items-center gap-6">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white max-w-2xl">
                Register to access the LMS
              </h2>
              <p className="text-base md:text-lg text-white/80 max-w-xl">
                Create your student account and start learning from day one. Free to register — apply to an internship to unlock full course content.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <AVMButton size="lg" onClick={() => onNavigate("register")} iconRight={<ArrowRight size={18} />}>
                  Register to Access
                </AVMButton>
                <AVMButton
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate("login")}
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Login
                </AVMButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
