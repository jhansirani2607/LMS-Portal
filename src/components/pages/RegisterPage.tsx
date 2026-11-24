"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User, ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { FormField } from "@/components/site/FormField";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { useFormSubmit } from "@/hooks/use-form-submit";
import {
  educationOptions,
  yearOfStudyOptions,
  domainOptions,
  hearAboutOptions,
} from "@/lib/data";
import type { NavigateFn } from "@/lib/navigation";

interface RegisterPageProps {
  onNavigate: NavigateFn;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  education: string;
  yearOfStudy: string;
  preferredDomain: string;
  hearAbout: string;
  agreeTerms: boolean;
}

const initial: FormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  education: "",
  yearOfStudy: "",
  preferredDomain: "",
  hearAbout: "",
  agreeTerms: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,}$/;

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const toast = useAVMToast();
  const { submit, loading } = useFormSubmit();
  const [data, setData] = React.useState<FormData>(initial);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});
  const [showPw, setShowPw] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const set = (key: keyof FormData) => (value: string) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleTerms = () => {
    setData((d) => ({ ...d, agreeTerms: !d.agreeTerms }));
    setErrors((e) => ({ ...e, agreeTerms: undefined }));
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!data.fullName.trim()) errs.fullName = "Full name is required";
    if (!data.email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(data.email)) errs.email = "Enter a valid email";
    if (!data.phone.trim()) errs.phone = "Phone is required";
    else if (!PHONE_RE.test(data.phone)) errs.phone = "Enter a valid phone number";
    if (!data.password) errs.password = "Password is required";
    else if (data.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (data.confirmPassword !== data.password) errs.confirmPassword = "Passwords do not match";
    if (!data.education) errs.education = "Select your education";
    if (!data.yearOfStudy) errs.yearOfStudy = "Select your year of study";
    if (!data.preferredDomain) errs.preferredDomain = "Select a preferred domain";
    if (!data.hearAbout) errs.hearAbout = "Tell us how you heard about us";
    if (!data.agreeTerms) errs.agreeTerms = "You must agree to the terms to register";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submit(
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        education: data.education,
        yearOfStudy: data.yearOfStudy,
        preferredDomain: data.preferredDomain,
        hearAbout: data.hearAbout,
      },
      {
        endpoint: "/api/register",
        successTitle: "Registration successful!",
        successDescription: "Please login with your new account.",
        onSuccess: () => {
          setData(initial);
          onNavigate("login", { role: "student" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[var(--bg-base)]">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="glow-orb top-[-100px] right-[-80px] h-72 w-72 bg-[var(--primary)]" />
      <div className="glow-orb bottom-[-100px] left-[-80px] h-72 w-72 bg-[var(--accent)]" />

      <Reveal className="relative z-10 w-full max-w-2xl">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:p-8 shadow-2xl">
          {/* Logo + heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2.5 mb-4"
              aria-label="AVM Smart Solutions home"
            >
              <img src="/images/avm-logo.svg" alt="AVM Smart Solutions" className="h-12 w-12" />
              <span className="font-heading text-xl font-bold text-[var(--text-primary)]">
                AVM<span className="text-gradient"> Smart</span>
              </span>
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(99,102,241,0.4)] bg-[rgba(99,102,241,0.1)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)] mb-3">
              <GraduationCap size={14} className="text-[var(--primary)]" />
              Student Registration
            </div>
            <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              Create your student account
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Register to access internships, courses and verifiable certificates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>
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
              id="preferredDomain"
              label="Preferred Domain"
              type="select"
              required
              value={data.preferredDomain}
              onChange={set("preferredDomain")}
              error={errors.preferredDomain}
              placeholder="Select domain"
              options={domainOptions}
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[var(--text-primary)]">
                Password <span className="text-[var(--accent)]">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => set("password")(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.password)}
                  className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs text-red-400">{errors.password}</p>
              ) : (
                <p className="text-xs text-[var(--text-secondary)]/80">Minimum 6 characters.</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--text-primary)]">
                Confirm Password <span className="text-[var(--accent)]">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={data.confirmPassword}
                  onChange={(e) => set("confirmPassword")(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-xs text-red-400">{errors.confirmPassword}</p>
              ) : (
                data.confirmPassword.length > 0 &&
                data.confirmPassword === data.password && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Passwords match
                  </p>
                )
              )}
            </div>

            <div className="sm:col-span-2">
              <FormField
                id="hearAbout"
                label="How did you hear about us?"
                type="select"
                required
                value={data.hearAbout}
                onChange={set("hearAbout")}
                error={errors.hearAbout}
                placeholder="Select source"
                options={hearAboutOptions}
              />
            </div>

            {/* Terms */}
            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.agreeTerms}
                  onChange={toggleTerms}
                  className="mt-1 h-4 w-4 rounded border-[var(--border)] bg-[var(--bg-base)] accent-[var(--primary)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">
                  I agree to the{" "}
                  <span className="text-[var(--primary)] font-medium">Terms of Service</span> and{" "}
                  <span className="text-[var(--primary)] font-medium">Privacy Policy</span>, and consent
                  to be contacted about my internship application.
                </span>
              </label>
              {errors.agreeTerms && <p className="text-xs text-red-400 mt-1">{errors.agreeTerms}</p>}
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <p className="text-xs text-[var(--text-secondary)] text-center sm:text-left">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onNavigate("login")}
                  className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                >
                  Login
                </button>
              </p>
              <AVMButton
                type="submit"
                size="lg"
                disabled={loading}
                iconRight={<ArrowRight size={18} />}
              >
                {loading ? "Registering..." : "Register"}
              </AVMButton>
            </div>
          </form>

          <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3 text-xs text-[var(--text-secondary)] text-center">
            Registration is for <span className="text-[var(--text-primary)] font-semibold">Students</span>.
            Mentors &amp; admins are created internally by the AVM team.
          </div>
        </div>
      </Reveal>
    </div>
  );
}
