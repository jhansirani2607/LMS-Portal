"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, Mail, GraduationCap, Users, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { useAVMToast } from "@/hooks/use-avm-toast";
import type { NavigateFn, Role } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
  authenticateUser,
  setCurrentUser,
  DEMO_CREDENTIALS,
  type AuthUser,
} from "@/lib/portal-store";

interface LoginPageProps {
  onNavigate: NavigateFn;
  onLogin: (role: Role, user?: AuthUser) => void;
  initialRole?: Role;
}

const ROLES: { id: Role; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "student", label: "Student", icon: GraduationCap, desc: "Access courses, assignments, projects & certificates" },
  { id: "mentor", label: "Mentor", icon: Users, desc: "Evaluate student assignments & review projects" },
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Manage students, mentors, applications & certificates" },
];

export function LoginPage({ onNavigate, onLogin, initialRole }: LoginPageProps) {
  const toast = useAVMToast();
  const [selectedRole, setSelectedRole] = React.useState<Role>(initialRole ?? "student");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingNotice, setPendingNotice] = React.useState<string | null>(null);
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  // Sync role if navigated here with a different preselected role.
  React.useEffect(() => {
    if (initialRole) setSelectedRole(initialRole);
    setPendingNotice(null);
  }, [initialRole]);

  // Quick fill helper for demo/testing
  const fillCredentials = (role: Role) => {
    setSelectedRole(role);
    setPendingNotice(null);
    if (role === "student") {
      setEmail(DEMO_CREDENTIALS.student.email);
      setPassword(DEMO_CREDENTIALS.student.password);
    } else if (role === "mentor") {
      setEmail(DEMO_CREDENTIALS.mentor.email);
      setPassword(DEMO_CREDENTIALS.mentor.password);
    } else if (role === "admin") {
      setEmail(DEMO_CREDENTIALS.admin.email);
      setPassword(DEMO_CREDENTIALS.admin.password);
    }
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email or username is required";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    try {
      // 1. Try server API login
      let serverUser: AuthUser | undefined;
      let serverPending = false;
      let serverError = "";
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role: selectedRole }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success && data.user) {
          serverUser = data.user;
        } else if (data.pendingApproval) {
          serverPending = true;
          serverError = data.error;
        }
      } catch {
        /* fallback to client-side auth store */
      }

      // 2. Client-side authentication store verification
      const authResult = authenticateUser(email, password, selectedRole);

      if (serverUser || authResult.success) {
        setPendingNotice(null);
        const loggedUser: AuthUser = serverUser || authResult.user!;
        setCurrentUser(loggedUser);
        toast.success(
          `Welcome, ${loggedUser.name}!`,
          `Successfully logged in as ${selectedRole.toUpperCase()}.`
        );
        onLogin(selectedRole, loggedUser);
      } else if (serverPending || authResult.pendingApproval) {
        const msg =
          authResult.error ||
          serverError ||
          "Your registration is awaiting Admin approval. You will be able to log in once the Administrator accepts your account.";
        setPendingNotice(msg);
        toast.error("Approval Pending", msg);
      } else {
        setPendingNotice(null);
        toast.error("Login Failed", authResult.error || "Invalid email or password.");
        setErrors({
          email: "Please check your email or username",
          password: authResult.error || "Invalid password",
        });
      }
    } catch {
      toast.error("Login Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
                    onClick={() => {
                      setSelectedRole(r.id);
                      setErrors({});
                      setPendingNotice(null);
                    }}
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

          {/* Pending Approval Alert Banner */}
          {pendingNotice && (
            <div className="mb-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 animate-fadeIn">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                <div className="space-y-1.5 text-xs">
                  <p className="font-semibold text-amber-300 text-sm">
                    Registration Awaiting Admin Approval
                  </p>
                  <p className="text-amber-200/90 leading-relaxed">
                    {pendingNotice}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fillCredentials("admin")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors border border-amber-500/30"
                    >
                      <ShieldCheck size={14} />
                      Log In as Admin to Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    setPendingNotice(null);
                    setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder={
                    selectedRole === "admin"
                      ? "admin@avmsmart.in"
                      : selectedRole === "mentor"
                      ? "mentor@avmsmart.in"
                      : "you@example.com or student@avmsmart.in"
                  }
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
                    setPendingNotice(null);
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

            <AVMButton type="submit" size="lg" fullWidth disabled={loading} iconRight={<ArrowRight size={18} />}>
              {loading ? "Authenticating..." : `Login as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
            </AVMButton>
          </form>

          {/* Quick 1-Click Demo Logins */}
          <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[var(--accent)]" /> 1-Click Demo Fill:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => fillCredentials("student")}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-1.5 px-2 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] transition-colors text-center"
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("mentor")}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-1.5 px-2 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] transition-colors text-center"
              >
                👨‍🏫 Mentor
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("admin")}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-1.5 px-2 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary)] transition-colors text-center"
              >
                🛡️ Admin
              </button>
            </div>
            <p className="mt-2 text-[10px] text-[var(--text-secondary)] leading-tight text-center">
              Student accounts you register with also work here immediately!
            </p>
          </div>

          {/* Footer links */}
          <div className="mt-5 text-center text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => onNavigate("register")}
              className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
            >
              Register as Student
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
