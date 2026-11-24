"use client";

import * as React from "react";
import { Users, Search, Mail, Activity, Award } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { ProgressBar, StatusBadge } from "@/components/lms/LMSUI";
import { mentorAssignedStudents } from "@/lib/data";
import type { MentorAssignedStudent } from "@/lib/data";

export function MentorStudents() {
  const [query, setQuery] = React.useState("");
  const [activeStudentId, setActiveStudentId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mentorAssignedStudents;
    return mentorAssignedStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q)
    );
  }, [query]);

  const activeStudent = mentorAssignedStudents.find((s) => s.id === activeStudentId) ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <Users size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Assigned Students
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {mentorAssignedStudents.length} students under your mentorship.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Search */}
      <Reveal>
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            aria-label="Search students"
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
          />
        </div>
      </Reveal>

      {/* Student grid */}
      {filtered.length === 0 ? (
        <Reveal>
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] py-16 text-center">
            <Users size={32} className="mx-auto text-[var(--text-secondary)] mb-3" />
            <p className="text-base font-semibold text-[var(--text-primary)]">No students match</p>
          </div>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student, i) => (
            <Reveal key={student.id} delay={i * 60}>
              <button
                onClick={() => setActiveStudentId(student.id)}
                className="card-hover h-full w-full text-left rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                    {student.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] truncate">
                      {student.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] truncate">{student.email}</p>
                  </div>
                  <StatusBadge
                    status={student.status}
                    variant={student.status === "Active" ? "success" : "neutral"}
                  />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">{student.domain}</p>
                  <ProgressBar value={student.progress} showLabel size="sm" />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Last active: {student.lastActive}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={activeStudent !== null}
        onClose={() => setActiveStudentId(null)}
        title={activeStudent?.name}
        className="max-w-xl"
      >
        {activeStudent && <StudentDetail student={activeStudent} />}
      </Modal>
    </div>
  );
}

function StudentDetail({ student }: { student: MentorAssignedStudent }) {
  // Sample submissions & feedback history for the detail view
  const submissions = [
    {
      id: "s1",
      title: "Assignment 4 — JWT Auth Module",
      date: "2025-11-18",
      status: "Submitted",
      grade: "—",
    },
    {
      id: "s2",
      title: "Assignment 3 — REST API Design",
      date: "2025-11-10",
      status: "Reviewed",
      grade: "A",
    },
    {
      id: "s3",
      title: "Capstone Milestone 1",
      date: "2025-11-04",
      status: "Reviewed",
      grade: "A-",
    },
  ];

  const feedbackHistory = [
    {
      id: "f1",
      text: "Strong grasp of REST principles. Code structure improved significantly since the last review.",
      date: "2025-11-10",
      author: "You",
    },
    {
      id: "f2",
      text: "Good progress on React hooks. Practice more with useReducer for complex state.",
      date: "2025-11-04",
      author: "You",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-base font-bold text-white">
          {student.initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
            {student.name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
            <Mail size={13} /> {student.email}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
          <p className="text-xs text-[var(--text-secondary)]">Domain</p>
          <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{student.domain}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
          <p className="text-xs text-[var(--text-secondary)]">Last active</p>
          <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{student.lastActive}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
          <p className="text-xs text-[var(--text-secondary)]">Status</p>
          <p className="mt-0.5">
            <StatusBadge
              status={student.status}
              variant={student.status === "Active" ? "success" : "neutral"}
            />
          </p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1.5">
          <span className="flex items-center gap-1">
            <Activity size={12} /> Course progress
          </span>
          <span className="font-semibold text-[var(--text-primary)]">{student.progress}%</span>
        </div>
        <ProgressBar value={student.progress} showLabel />
      </div>

      {/* Recent submissions */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-1.5">
          <Award size={15} className="text-[var(--primary)]" /> Recent Submissions
        </h4>
        <ul className="flex flex-col gap-2">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{s.title}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {new Date(s.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {s.grade !== "—" && (
                  <span className="text-xs font-semibold text-emerald-300">Grade: {s.grade}</span>
                )}
                <StatusBadge
                  status={s.status}
                  variant={s.status === "Reviewed" ? "success" : "info"}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Feedback history */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          Feedback History
        </h4>
        <ul className="flex flex-col gap-3">
          {feedbackHistory.map((f) => (
            <li key={f.id} className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.text}</p>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                {f.author} • {new Date(f.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end border-t border-[var(--border)] pt-4">
        <AVMButton variant="ghost" onClick={() => {}}>
          Close
        </AVMButton>
      </div>
    </div>
  );
}
