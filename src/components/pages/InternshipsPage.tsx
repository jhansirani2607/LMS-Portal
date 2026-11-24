"use client";

import * as React from "react";
import { ArrowRight, Search, Check, Clock, Award, Rocket, Briefcase, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Reveal } from "@/components/site/Reveal";
import { Icon } from "@/components/site/Icon";
import { Modal } from "@/components/site/Modal";
import { TechChips } from "@/components/site/TechMarquee";
import { FormField } from "@/components/site/FormField";
import { AVMButton } from "@/components/site/AVMButton";
import { CTASection } from "@/components/site/CTASection";
import { useFormSubmit } from "@/hooks/use-form-submit";
import {
  internshipDomains,
  eligibilityCriteria,
  internshipIncludes,
  programDurations,
  educationOptions,
  yearOfStudyOptions,
  programTypeOptions,
  domainOptions,
  type InternshipLevel,
} from "@/lib/data";
import type { NavigateFn } from "@/lib/navigation";

interface InternshipsPageProps {
  onNavigate: NavigateFn;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  yearOfStudy: string;
  domain: string;
  programType: string;
  startDate: string;
  resumeName: string;
  coverLetter: string;
}

const initial: FormData = {
  fullName: "",
  email: "",
  phone: "",
  education: "",
  yearOfStudy: "",
  domain: "",
  programType: "",
  startDate: "",
  resumeName: "",
  coverLetter: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,}$/;

const LEVELS: ("All" | InternshipLevel)[] = ["All", "Beginner", "Intermediate", "Advanced"];

export function InternshipsPage({ onNavigate }: InternshipsPageProps) {
  const { submit, loading } = useFormSubmit();
  const [data, setData] = React.useState<FormData>(initial);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});
  const [query, setQuery] = React.useState("");
  const [level, setLevel] = React.useState<(typeof LEVELS)[number]>("All");
  const [activeDomainId, setActiveDomainId] = React.useState<string | null>(null);

  const set = (key: keyof FormData) => (value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const filteredDomains = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return internshipDomains.filter((d) => {
      const matchesLevel = level === "All" || d.level === level;
      const matchesQuery =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.technologies.some((t) => t.toLowerCase().includes(q));
      return matchesLevel && matchesQuery;
    });
  }, [query, level]);

  const activeDomain = activeDomainId
    ? internshipDomains.find((d) => d.id === activeDomainId) ?? null
    : null;

  const scrollToForm = (domainId?: string) => {
    if (domainId) {
      setData((d) => ({ ...d, domain: domainId }));
    }
    setActiveDomainId(null);
    if (typeof document !== "undefined") {
      const el = document.getElementById("apply-form");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!data.fullName.trim()) errs.fullName = "Full name is required";
    if (!data.email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(data.email)) errs.email = "Enter a valid email address";
    if (!data.phone.trim()) errs.phone = "Phone number is required";
    else if (!PHONE_RE.test(data.phone)) errs.phone = "Enter a valid phone number";
    if (!data.education) errs.education = "Select your education";
    if (!data.yearOfStudy) errs.yearOfStudy = "Select your year of study";
    if (!data.domain) errs.domain = "Select an internship domain";
    if (!data.programType) errs.programType = "Select a program type";
    if (!data.startDate) errs.startDate = "Pick a preferred start date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const domainLabel =
      domainOptions.find((d) => d.value === data.domain)?.label ?? data.domain;
    const programLabel =
      programTypeOptions.find((p) => p.value === data.programType)?.label ?? data.programType;
    submit(
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        education: data.education,
        yearOfStudy: data.yearOfStudy,
        fieldOfInterest: domainLabel,
        domain: domainLabel,
        internshipType: programLabel,
        programType: programLabel,
        startDate: data.startDate,
        resumeName: data.resumeName,
        coverLetter: data.coverLetter,
      },
      {
        endpoint: "/api/internship",
        successTitle: "Application submitted!",
        successDescription: "Our team will review your application and contact you within 2 business days.",
        onSuccess: () => setData(initial),
      }
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Internships"
        title="Industry Internship Programs"
        subtitle="Eight mentor-led engineering domains. Real projects, weekly code reviews, verifiable certificates and placement assistance."
      />

      {/* Explore Internships */}
      <section className="px-4 sm:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="Explore"
            title="Find your domain"
            subtitle="Search and filter across all 8 internship tracks. Click any card for full curriculum details."
            align="left"
          />

          {/* Search + filter */}
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, technology or keyword..."
                  aria-label="Search internships"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setLevel(lv)}
                    className={
                      "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors " +
                      (level === lv
                        ? "bg-gradient-primary text-white border-transparent shadow-glow-indigo"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)]")
                    }
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Domain grid */}
          {filteredDomains.length === 0 ? (
            <Reveal>
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] py-16 text-center">
                <p className="text-base font-semibold text-[var(--text-primary)]">No domains match your filters</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Try clearing the search or selecting a different level.</p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDomains.map((domain, i) => (
                <Reveal key={domain.id} delay={i * 60}>
                  <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white">
                      <Icon name={domain.icon} size={24} />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                        <Clock size={11} /> {domain.duration}
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
                    <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] mb-2">
                      {domain.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-3 flex-1">
                      {domain.description}
                    </p>
                    <div className="mb-4">
                      <TechChips items={domain.technologies.slice(0, 4)} />
                    </div>
                    <div className="flex gap-2">
                      <AVMButton
                        size="sm"
                        variant="outline"
                        fullWidth
                        onClick={() => setActiveDomainId(domain.id)}
                      >
                        View Details
                      </AVMButton>
                      <AVMButton
                        size="sm"
                        fullWidth
                        onClick={() => scrollToForm(domain.id)}
                        icon={<ArrowRight size={15} />}
                      >
                        Apply Now
                      </AVMButton>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Domain chips summary */}
      <section className="px-4 sm:px-6 py-8 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4">
            All Internship Domains
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {internshipDomains.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDomainId(d.id)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:border-[rgba(99,102,241,0.5)] transition-colors"
              >
                <Icon name={d.icon} size={14} className="text-[var(--primary)]" />
                {d.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Program Durations */}
      <section className="px-4 sm:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="Program Duration"
            title="Choose the right length for you"
            subtitle="Short-term intensive programs fit semester breaks; long-term internships go deeper with a major capstone."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programDurations.map((p, i) => (
              <Reveal key={p.type} delay={i * 100}>
                <div className="card-hover h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white">
                    <Icon name={p.type === "Short-term" ? "Clock" : "CalendarClock"} size={26} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                    {p.type}
                  </h3>
                  <p className="mt-2 font-heading text-3xl font-bold text-gradient">{p.duration}</p>
                  <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {p.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="px-4 sm:px-6 py-16 md:py-20 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="Eligibility"
            title="Who can apply?"
            subtitle="Our internships are designed for students and recent graduates passionate about building real engineering skills."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {eligibilityCriteria.map((item, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <Check size={14} />
                  </div>
                  <p className="text-sm text-[var(--text-primary)]">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Includes */}
      <section className="px-4 sm:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle
            eyebrow="What&apos;s Included"
            title="Everything you get as an AVM intern"
            subtitle="A complete, structured experience designed around real outcomes — portfolio, mentorship, certificate and placement support."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {internshipIncludes.map((item, i) => (
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

      {/* Apply Form */}
      <section id="apply-form" className="px-4 sm:px-6 py-16 md:py-20 bg-[var(--bg-surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-3xl">
          <SectionTitle
            eyebrow="Apply Now"
            title="Apply for an internship"
            subtitle="Fill out the form below and our team will get back to you within 2 business days."
          />
          <Reveal>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
              noValidate
            >
              <FormField
                id="fullName"
                label="Full Name"
                required
                value={data.fullName}
                onChange={set("fullName")}
                error={errors.fullName}
                placeholder="Aarav Sharma"
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
              <FormField
                id="phone"
                label="Phone"
                required
                inputType="tel"
                value={data.phone}
                onChange={set("phone")}
                error={errors.phone}
                placeholder="+91 90000 00000"
              />
              <FormField
                id="education"
                label="Education"
                type="select"
                required
                value={data.education}
                onChange={set("education")}
                error={errors.education}
                placeholder="Select education"
                options={educationOptions}
              />
              <FormField
                id="yearOfStudy"
                label="Year of Study"
                type="select"
                required
                value={data.yearOfStudy}
                onChange={set("yearOfStudy")}
                error={errors.yearOfStudy}
                placeholder="Select year"
                options={yearOfStudyOptions}
              />
              <FormField
                id="domain"
                label="Internship Domain"
                type="select"
                required
                value={data.domain}
                onChange={set("domain")}
                error={errors.domain}
                placeholder="Select domain"
                options={domainOptions}
              />
              <FormField
                id="programType"
                label="Program Type"
                type="select"
                required
                value={data.programType}
                onChange={set("programType")}
                error={errors.programType}
                placeholder="Select program type"
                options={programTypeOptions}
              />
              <FormField
                id="startDate"
                label="Preferred Start Date"
                required
                inputType="date"
                value={data.startDate}
                onChange={set("startDate")}
                error={errors.startDate}
              />
              <FormField
                id="resumeName"
                label="Resume (PDF/DOCX)"
                type="file"
                accept=".pdf,.doc,.docx"
                value={data.resumeName}
                onChange={set("resumeName")}
                helper="Upload your latest resume (UI only — not stored)."
              />
              <div className="sm:col-span-2">
                <FormField
                  id="coverLetter"
                  label="Cover Letter"
                  type="textarea"
                  rows={4}
                  value={data.coverLetter}
                  onChange={set("coverLetter")}
                  placeholder="Tell us why you're interested in this internship and what you hope to achieve..."
                />
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  By submitting, you agree to be contacted by AVM Smart Solutions about your application.
                </p>
                <AVMButton
                  type="submit"
                  size="lg"
                  disabled={loading}
                  icon={<Rocket size={18} />}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </AVMButton>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      <CTASection onNavigate={onNavigate} />

      {/* Domain details modal */}
      <Modal
        open={activeDomain !== null}
        onClose={() => setActiveDomainId(null)}
        title={activeDomain?.title}
        className="max-w-2xl"
      >
        {activeDomain && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                <Clock size={12} /> {activeDomain.duration}
              </span>
              <span
                className={
                  "rounded-full border px-2.5 py-0.5 text-xs font-semibold " +
                  (activeDomain.level === "Beginner"
                    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                    : activeDomain.level === "Intermediate"
                    ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                    : "border-red-500/30 bg-red-500/15 text-red-300")
                }
              >
                {activeDomain.level}
              </span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {activeDomain.description}
            </p>

            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Technologies</h4>
              <TechChips items={activeDomain.technologies} />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <Briefcase size={15} className="text-[var(--primary)]" /> Syllabus Modules
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeDomain.syllabusModules.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[10px] font-bold text-[var(--primary)]">
                      {i + 1}
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-[var(--accent)]" /> Prerequisites
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {activeDomain.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                  <Award size={15} className="text-amber-300" /> Outcomes
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {activeDomain.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" onClick={() => setActiveDomainId(null)}>
                Close
              </AVMButton>
              <AVMButton onClick={() => scrollToForm(activeDomain.id)} icon={<ArrowRight size={16} />}>
                Apply Now
              </AVMButton>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
