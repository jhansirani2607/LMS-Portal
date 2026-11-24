"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, Mail, GraduationCap, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { useAVMToast } from "@/hooks/use-avm-toast";
import type { NavigateFn, Role } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface LoginPageProps {
  onNavigate: NavigateFn;
  onLogin: (role: Role) => void;
  initialRole?: Role;
}

const ROLES: { id: Role; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "student", label: "Student", icon: GraduationCap, desc: "Access courses, assignments & certificates" },
  { id: "mentor", label: "Mentor", icon: Users, desc: "Evaluate students & review projects" },
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage students, mentors & platform" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage({ onNavigate, onLogin, initialRole }: LoginPageProps) {
  const toast = useAVMToast();
  const [selectedRole, setSelectedRole] = React.useState<Role>(initialRole ?? "student");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  // Sync role if navigated here with a different preselected role.
  React.useEffect(() => {
    if (initialRole) setSelectedRole(initialRole);
  }, [initialRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email or username is required";
    else if (!EMAIL_RE.test(email) && email.length < 3)
      errs.email = "Enter a valid email or username";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    toast.success(
      `Welcome to the ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal`,
      "Logged in successfully."
    );
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[var(--bg-base)]">
      {/* background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="glow-orb top-[-100px] left-[-80px] h-72 w-72 bg-[var(--primary)]" />
      <div className="glow-orb bottom-[-100px] right-[-80px] h-72 w-72 bg-[var(--accent)]" />

      <Reveal className="relative z-10 w-full max-w-md">
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
            <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Sign in to access your portal
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-2 block">
              Select your role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-semibold transition-colors",
                      active
                        ? "border-[var(--primary)] bg-[rgba(99,102,241,0.15)] text-[var(--text-primary)] shadow-glow-indigo"
                        : "border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[rgba(99,102,241,0.4)]"
                    )}
                  >
                    <Icon size={18} className={active ? "text-[var(--primary)]" : ""} />
                    {r.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)] text-center">
              {ROLES.find((r) => r.id === selectedRole)?.desc}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">
                Email or Username
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[var(--text-primary)]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: undefined }));
                  }}
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
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            <AVMButton type="submit" size="lg" fullWidth iconRight={<ArrowRight size={18} />}>
              Login as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </AVMButton>
          </form>

          {/* Demo hint */}
          <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            <strong className="font-semibold">Demo mode:</strong> Use any email + a 6-character password.
            Your selected role determines which portal you enter.
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => onNavigate("register")}
              className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
            >
              Register
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-[var(--text-secondary)]">
            Registration is for students. Mentors &amp; admins are created internally.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
