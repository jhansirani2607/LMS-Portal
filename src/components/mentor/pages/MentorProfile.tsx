"use client";

import * as React from "react";
import { User as UserIcon, Mail, Award, Save, LogOut, Briefcase } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { currentMentor, mentorAssignedStudents } from "@/lib/data";

interface MentorProfileProps {
  onLogout: () => void;
}

interface ProfileForm {
  name: string;
  email: string;
  expertise: string;
}

export function MentorProfile({ onLogout }: MentorProfileProps) {
  const toast = useAVMToast();
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState<ProfileForm>({
    name: currentMentor.name,
    email: currentMentor.email,
    expertise: currentMentor.expertise,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name required", "Please enter your name.");
      return;
    }
    setEditing(false);
    toast.success("Profile updated", "Your changes have been saved.");
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
              Manage your mentor profile and account settings.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Profile card */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-2xl font-bold text-white shadow-glow-indigo">
              {currentMentor.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                {currentMentor.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">{currentMentor.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(168,85,247,0.4)] bg-[rgba(168,85,247,0.1)] px-2.5 py-0.5 font-semibold uppercase tracking-wide text-[var(--accent)]">
                  Mentor
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[var(--text-secondary)]">
                  <Briefcase size={11} /> {mentorAssignedStudents.length} students
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[var(--text-secondary)]">
                  Status: {currentMentor.status}
                </span>
              </div>
            </div>
            <AVMButton
              variant={editing ? "ghost" : "outline"}
              size="sm"
              onClick={() => setEditing((e) => !e)}
              icon={<Save size={15} />}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </AVMButton>
          </div>

          {editing && (
            <form
              onSubmit={handleSave}
              className="mt-5 border-t border-[var(--border)] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="m-name" className="text-sm font-medium text-[var(--text-primary)]">
                  Name
                </label>
                <input
                  id="m-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="m-email" className="text-sm font-medium text-[var(--text-primary)]">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input
                    id="m-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label htmlFor="m-exp" className="text-sm font-medium text-[var(--text-primary)]">
                  Expertise
                </label>
                <input
                  id="m-exp"
                  value={form.expertise}
                  onChange={(e) => setForm({ ...form, expertise: e.target.value })}
                  className="h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <AVMButton type="button" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </AVMButton>
                <AVMButton type="submit" icon={<Save size={15} />}>
                  Save Changes
                </AVMButton>
              </div>
            </form>
          )}
        </div>
      </Reveal>

      {/* Stats overview */}
      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Assigned Students", value: mentorAssignedStudents.length, icon: UserIcon },
            { label: "Active Students", value: mentorAssignedStudents.filter((s) => s.status === "Active").length, icon: Award },
            { label: "Avg Progress", value: `${Math.round(mentorAssignedStudents.reduce((s, st) => s + st.progress, 0) / mentorAssignedStudents.length)}%`, icon: Briefcase },
            { label: "Status", value: currentMentor.status, icon: Award },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
                <Icon size={18} className="text-[var(--primary)] mb-2" />
                <p className="font-heading text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Danger zone */}
      <Reveal>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold text-red-300">
                Danger Zone
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Logging out clears your mentor session on this device. You can sign back in any time.
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
