"use client";

import * as React from "react";
import { Briefcase, Calendar, User } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ProgressBar, StatusBadge } from "@/components/lms/LMSUI";
import { studentInternships } from "@/lib/data";
import { getStudentEnrolledCourses } from "@/lib/portal-store";

interface StudentInternshipsProps {
  user?: import("@/lib/data").LMSUser;
}

export function StudentInternships({ user }: StudentInternshipsProps = {}) {
  const [syncKey, setSyncKey] = React.useState(0);

  React.useEffect(() => {
    const handleSync = () => setSyncKey((k) => k + 1);
    if (typeof window !== "undefined") {
      window.addEventListener("avm_store_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        window.removeEventListener("avm_store_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, []);

  const enrolledCourses = React.useMemo(() => {
    return getStudentEnrolledCourses(user?.email, user?.preferredDomain);
  }, [user?.email, user?.preferredDomain, syncKey]);

  const allInternships = React.useMemo(() => {
    if (user?.preferredDomain) {
      const personalInternship = {
        id: "active-user-internship",
        domainId: "custom",
        domainTitle: user.preferredDomain,
        mentorName: user.mentor || "Technical Mentor (Pending Assignment)",
        mentorRole: "Assigned Project Guide",
        startDate: user.enrolledOn || "2026-01-15",
        duration: "12 Weeks (3 Months)",
        progress: typeof user.progress === "number" ? user.progress : 15,
        status: (user.status === "Pending Approval" ? "Pending Approval" : (user.status === "Rejected" ? "Rejected" : "In Progress")) as any,
        weeklyTasks: [],
      };

      const additionalTracks = enrolledCourses
        .filter((c) => c.title.toLowerCase() !== user.preferredDomain?.toLowerCase())
        .map((c) => ({
          id: `track-${c.id}`,
          domainId: c.id,
          domainTitle: c.title,
          mentorName: user.mentor || "Technical Mentor",
          mentorRole: "Assigned Guide",
          startDate: "2026-02-01",
          duration: c.duration,
          progress: c.progress,
          status: "In Progress" as const,
          weeklyTasks: [],
        }));

      return [personalInternship, ...additionalTracks];
    }
    return [studentInternships[0]];
  }, [user, enrolledCourses]);

  const inProgress = allInternships.filter((s) => s.status === "In Progress" || s.status === "Pending Approval");
  const completed = allInternships.filter((s) => s.status === "Completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <Briefcase size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              My Internships
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Track your active and completed internship enrollments.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Summary stats */}
      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex items-center gap-3">
            <Briefcase size={20} className="text-[var(--primary)]" />
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--text-primary)]">
                {allInternships.length}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Total enrollments</p>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex items-center gap-3">
            <Calendar size={20} className="text-amber-400" />
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--text-primary)]">
                {inProgress.length}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">In progress</p>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
            <StatusBadge status="Completed" variant="success" />
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--text-primary)]">
                {completed.length}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Completed</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
              Active Internships
            </h3>
            <ul className="flex flex-col gap-4">
              {inProgress.map((si) => (
                <li
                  key={si.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-5 flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                        {si.domainTitle}
                      </h4>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
                        <span className="inline-flex items-center gap-1.5">
                          <User size={12} /> Mentor: {si.mentorName}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={12} />
                          Started {new Date(si.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase size={12} /> {si.duration}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={si.status} variant="info" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1.5">
                      <span>Progress</span>
                      <span className="font-semibold text-[var(--text-primary)]">{si.progress}%</span>
                    </div>
                    <ProgressBar value={si.progress} size="sm" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
              Completed Internships
            </h3>
            <ul className="flex flex-col gap-4">
              {completed.map((si) => (
                <li
                  key={si.id}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                      {si.domainTitle}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Mentor: {si.mentorName} • Completed {si.duration} program
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <ProgressBar value={si.progress} size="sm" />
                    </div>
                    <StatusBadge status={si.status} variant="success" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* Empty state hint */}
      {allInternships.length === 0 && (
        <Reveal>
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] py-16 text-center">
            <Briefcase size={32} className="mx-auto text-[var(--text-secondary)] mb-3" />
            <p className="text-base font-semibold text-[var(--text-primary)]">
              No internships yet
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Apply for an internship from the public Internships page to get started.
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
