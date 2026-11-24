"use client";

import * as React from "react";
import { Mail, ArrowLeft, ArrowRight, MailCheck } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { useAVMToast } from "@/hooks/use-avm-toast";
import type { NavigateFn } from "@/lib/navigation";

interface ForgotPasswordPageProps {
  onNavigate: NavigateFn;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const toast = useAVMToast();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError(undefined);
    setSubmitted(true);
    toast.success(
      "Reset instructions sent",
      "If an account exists for this email, reset instructions will arrive shortly."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[var(--bg-base)]">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="glow-orb top-[-100px] left-[-80px] h-72 w-72 bg-[var(--primary)]" />
      <div className="glow-orb bottom-[-100px] right-[-80px] h-72 w-72 bg-[var(--accent)]" />

      <Reveal className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:p-8 shadow-2xl">
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
            <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              Reset Your Password
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Enter your email and we&apos;ll send you reset instructions.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                <MailCheck size={24} />
              </div>
              <p className="text-sm font-semibold text-emerald-300">Check your inbox</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                If an account exists for{" "}
                <span className="font-mono text-[var(--text-primary)]">{email}</span>, you&apos;ll
                receive an email with reset instructions shortly.
              </p>
              <AVMButton
                variant="outline"
                size="md"
                className="mt-4"
                onClick={() => onNavigate("login")}
                icon={<ArrowLeft size={16} />}
              >
                Back to Login
              </AVMButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(undefined);
                    }}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(error)}
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
                  />
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>

              <AVMButton type="submit" size="lg" fullWidth iconRight={<ArrowRight size={18} />}>
                Send Reset Instructions
              </AVMButton>
            </form>
          )}

          {!submitted && (
            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigate("login")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ArrowLeft size={14} /> Back to Login
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
