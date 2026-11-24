"use client";

import * as React from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Edit3,
  Save,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Globe,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { lmsUser } from "@/lib/data";
import { getCurrentUser, setCurrentUser } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

interface LMSProfileProps {
  onLogout: () => void;
  user?: import("@/lib/data").LMSUser;
}

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
}

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

export function LMSProfile({ onLogout, user }: LMSProfileProps) {
  const toast = useAVMToast();
  const loggedIn = React.useMemo(() => getCurrentUser(), []);
  const current = user || loggedIn;
  const activeUser = current || lmsUser;

  const [profile, setProfile] = React.useState<ProfileForm>({
    fullName: activeUser.name,
    email: activeUser.email,
    phone: activeUser.phone || "+91 98765 43210",
    bio: activeUser.education
      ? `Student in ${activeUser.education} (${activeUser.yearOfStudy || "Current"}). Enrolled in ${activeUser.preferredDomain || "Engineering Track"}.`
      : "Full-stack developer in training at AVM Smart Solutions internship program.",
  });
  const [editing, setEditing] = React.useState(false);

  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [courseReminders, setCourseReminders] = React.useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = React.useState(true);
  const [language, setLanguage] = React.useState("English");

  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNext, setShowNext] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [password, setPassword] = React.useState<PasswordForm>({
    current: "",
    next: "",
    confirm: "",
  });
  const [pwErrors, setPwErrors] = React.useState<Partial<Record<keyof PasswordForm, string>>>({});

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      toast.error("Name required", "Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast.error("Invalid email", "Please enter a valid email address.");
      return;
    }
    setEditing(false);
    if (loggedIn) {
      setCurrentUser({
        ...loggedIn,
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
      });
    }
    toast.success("Profile updated", "Your changes have been saved.");
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<Record<keyof PasswordForm, string>> = {};
    if (!password.current) errs.current = "Current password is required";
    if (!password.next) errs.next = "New password is required";
    else if (password.next.length < 6) errs.next = "Password must be at least 6 characters";
    if (password.next !== password.confirm) errs.confirm = "Passwords do not match";
    setPwErrors(errs);
    if (Object.keys(errs).length > 0) return;

    toast.success("Password updated", "Your password has been changed successfully.");
    setPassword({ current: "", next: "", confirm: "" });
    setPwErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <UserIcon size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              My Profile
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Manage your personal student details and security.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Profile card */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-2xl font-bold text-white shadow-glow-indigo">
              {activeUser.avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                {activeUser.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">{activeUser.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[var(--text-secondary)]">
                  {activeUser.role}
                </span>
                <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[var(--text-secondary)]">
                  ID: {activeUser.studentId}
                </span>
                <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[var(--text-secondary)]">
                  Enrolled: {new Date(activeUser.enrolledOn).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
                {activeUser.preferredDomain && (
                  <span className="rounded-full border border-indigo-500/40 bg-indigo-500/15 px-2.5 py-0.5 text-indigo-300 font-medium">
                    Track: {activeUser.preferredDomain}
                  </span>
                )}
                {activeUser.mentor && (
                  <span className="rounded-full border border-[var(--border)] bg-[var(--bg-base)] px-2.5 py-0.5 text-[var(--text-secondary)]">
                    Mentor: {activeUser.mentor}
                  </span>
                )}
              </div>
            </div>
            <AVMButton
              variant={editing ? "ghost" : "outline"}
              size="sm"
              onClick={() => setEditing((e) => !e)}
              icon={editing ? <Save size={15} /> : <Edit3 size={15} />}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </AVMButton>
          </div>

          {/* Academic & Internship Details Badge Grid */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[var(--border)] pt-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3">
              <p className="text-[11px] text-[var(--text-secondary)]">Internship Track</p>
              <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                {activeUser.preferredDomain || "Full Stack Track"}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3">
              <p className="text-[11px] text-[var(--text-secondary)]">Assigned Mentor</p>
              <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                {activeUser.mentor || "Mahendra Cheerla"}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3">
              <p className="text-[11px] text-[var(--text-secondary)]">Education</p>
              <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                {activeUser.education || "Undergraduate"}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3">
              <p className="text-[11px] text-[var(--text-secondary)]">Year of Study</p>
              <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 truncate">
                {activeUser.yearOfStudy || "Current"}
              </p>
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <form
              onSubmit={saveProfile}
              className="mt-5 border-t border-[var(--border)] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-[var(--text-primary)]">
                  Full Name
                </label>
                <input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-[var(--text-primary)]">
                  Phone
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="bio" className="text-sm font-medium text-[var(--text-primary)]">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors resize-none"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                  <input type="file" className="hidden" />
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--border)] px-3 py-2 hover:border-[rgba(99,102,241,0.5)]">
                    <Edit3 size={13} /> Upload new avatar (UI only)
                  </span>
                </label>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <AVMButton type="button" variant="ghost" size="md" onClick={() => setEditing(false)}>
                  Cancel
                </AVMButton>
                <AVMButton type="submit" size="md" icon={<Save size={15} />}>
                  Save Changes
                </AVMButton>
              </div>
            </form>
          )}
        </div>
      </Reveal>

      {/* Settings + Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Settings
              </h3>
            </div>

            <div className="space-y-1">
              <ToggleRow
                label="Email notifications"
                description="Receive email updates about your courses and assignments."
                checked={emailNotifs}
                onChange={setEmailNotifs}
              />
              <ToggleRow
                label="Course reminders"
                description="Get reminded when you haven't logged in for a few days."
                checked={courseReminders}
                onChange={setCourseReminders}
              />
              <ToggleRow
                label="Assignment deadlines"
                description="Alerts 24 hours before an assignment is due."
                checked={deadlineAlerts}
                onChange={setDeadlineAlerts}
              />
            </div>

            <div className="mt-5 border-t border-[var(--border)] pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  Language
                </span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Kannada</option>
              </select>
              <p className="text-xs text-[var(--text-secondary)]">
                Theme preference follows the site-wide dark theme.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Change password */}
        <Reveal delay={100}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Change Password
              </h3>
            </div>
            <form onSubmit={changePassword} className="space-y-3">
              <PasswordField
                id="currentPw"
                label="Current Password"
                value={password.current}
                show={showCurrent}
                onToggle={() => setShowCurrent((s) => !s)}
                onChange={(v) => {
                  setPassword({ ...password, current: v });
                  setPwErrors((e) => ({ ...e, current: undefined }));
                }}
                error={pwErrors.current}
              />
              <PasswordField
                id="newPw"
                label="New Password"
                value={password.next}
                show={showNext}
                onToggle={() => setShowNext((s) => !s)}
                onChange={(v) => {
                  setPassword({ ...password, next: v });
                  setPwErrors((e) => ({ ...e, next: undefined }));
                }}
                error={pwErrors.next}
              />
              <PasswordField
                id="confirmPw"
                label="Confirm New Password"
                value={password.confirm}
                show={showConfirm}
                onToggle={() => setShowConfirm((s) => !s)}
                onChange={(v) => {
                  setPassword({ ...password, confirm: v });
                  setPwErrors((e) => ({ ...e, confirm: undefined }));
                }}
                error={pwErrors.confirm}
              />
              <div className="flex justify-end pt-1">
                <AVMButton type="submit" size="md" icon={<Lock size={15} />}>
                  Update Password
                </AVMButton>
              </div>
            </form>
          </div>
        </Reveal>
      </div>

      {/* Danger zone */}
      <Reveal>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold text-red-300">
                Danger Zone
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Logging out will clear your LMS session on this device. You can sign
                back in any time.
              </p>
            </div>
            <AVMButton
              variant="outline"
              size="md"
              onClick={onLogout}
              icon={<LogOut size={15} />}
              className="border-red-500/40 text-red-300 hover:bg-red-500/10"
            >
              Logout
            </AVMButton>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border)] last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-secondary)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-gradient-primary" : "bg-[var(--bg-elevated)]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  error?: string;
}

function PasswordField({
  id,
  label,
  value,
  show,
  onToggle,
  onChange,
  error,
}: PasswordFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <div className="relative">
        <Lock
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-10 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {!error && value && value.length >= 6 && id === "confirmPw" && (
        <p className="text-xs text-emerald-400 flex items-center gap-1">
          <CheckCircle2 size={12} /> Passwords match
        </p>
      )}
    </div>
  );
}
