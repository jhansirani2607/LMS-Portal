"use client";

import * as React from "react";
import {
  ClipboardList,
  Clock,
  Calendar,
  Upload,
  Send,
  FileText,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { lmsAssignments, lmsUser } from "@/lib/data";
import type { LMSAssignment, LMSAssignmentStatus, LMSUser } from "@/lib/data";
import { getStudentEnrolledCourses } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

type FilterTab = "All" | LMSAssignmentStatus;

const FILTER_TABS: FilterTab[] = [
  "All",
  "pending",
  "submitted",
  "graded",
  "overdue",
];

const statusVariant: Record<
  LMSAssignmentStatus,
  "neutral" | "success" | "warning" | "danger" | "info"
> = {
  pending: "info",
  submitted: "neutral",
  graded: "success",
  overdue: "danger",
};

interface LMSAssignmentsProps {
  user?: LMSUser;
}

export function LMSAssignments({ user }: LMSAssignmentsProps = {}) {
  const toast = useAVMToast();
  const activeUser = user || lmsUser;

  const enrolledCourses = React.useMemo(() => {
    return getStudentEnrolledCourses(activeUser.email, activeUser.preferredDomain);
  }, [activeUser.email, activeUser.preferredDomain]);

  const enrolledCourseIds = React.useMemo(
    () => new Set(enrolledCourses.map((c) => c.id.toLowerCase())),
    [enrolledCourses]
  );

  const initialItems = React.useMemo(() => {
    const matched = lmsAssignments.filter((a) =>
      enrolledCourseIds.has(a.courseId.toLowerCase())
    );
    if (matched.length > 0) return matched;
    const primary = enrolledCourses[0];
    return [
      {
        id: "asg-primary-1",
        courseId: primary?.id || "custom",
        courseTitle: primary?.title || activeUser.preferredDomain || "Full Stack Track",
        title: `${primary?.title || "Course"} Capstone Milestone 1`,
        dueDate: "2026-12-10",
        status: "pending" as const,
        description: `Implement the foundational architecture and setup for ${primary?.title || "your course"}.`,
        maxMarks: 100,
      },
    ];
  }, [enrolledCourseIds, enrolledCourses, activeUser.preferredDomain]);

  const [tab, setTab] = React.useState<FilterTab>("All");
  const [items, setItems] = React.useState<LMSAssignment[]>(initialItems);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [submissionText, setSubmissionText] = React.useState("");

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const today = new Date("2026-11-25");

  const filtered = React.useMemo(() => {
    if (tab === "All") return items;
    return items.filter((a) => a.status === tab);
  }, [items, tab]);

  const active = items.find((a) => a.id === activeId) ?? null;

  const stats = {
    total: items.length,
    pending: items.filter((a) => a.status === "pending").length,
    submitted: items.filter((a) => a.status === "submitted").length,
    graded: items.filter((a) => a.status === "graded").length,
  };

  const daysLeft = (due: string) =>
    Math.ceil((+new Date(due) - +today) / (1000 * 60 * 60 * 24));

  const closeModal = () => {
    setActiveId(null);
    setSubmissionText("");
  };

  const submitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      toast.error("Submission is empty", "Add a short note or repo link before submitting.");
      return;
    }
    setItems((prev) =>
      prev.map((a) =>
        a.id === activeId
          ? { ...a, status: "submitted" as LMSAssignmentStatus }
          : a
      )
    );
    toast.success(
      "Assignment submitted!",
      "Your instructor will review and grade your submission."
    );
    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <ClipboardList size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Assignments
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Submit work, track deadlines and review grades.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, icon: ClipboardList, color: "text-[var(--primary)]" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-400" },
            { label: "Submitted", value: stats.submitted, icon: CheckCircle2, color: "text-[var(--accent)]" },
            { label: "Graded", value: stats.graded, icon: Award, color: "text-emerald-400" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex items-center gap-3"
              >
                <Icon size={20} className={s.color} />
                <div>
                  <p className="font-heading text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Filter tabs */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium border capitalize transition-colors",
                tab === t
                  ? "bg-gradient-primary text-white border-transparent shadow-glow-indigo"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Reveal>

      {/* List */}
      {filtered.length === 0 ? (
        <Reveal>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] py-16 text-center">
            <ClipboardList size={32} className="text-[var(--text-secondary)] mb-3" />
            <p className="text-base font-semibold text-[var(--text-primary)]">
              No {tab !== "All" ? tab : ""} assignments
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Try a different filter to see your assignments.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((a, i) => {
            const dl = daysLeft(a.dueDate);
            return (
              <Reveal key={a.id} delay={i * 60}>
                <div className="card-hover h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] leading-snug">
                        {a.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {a.courseTitle}
                      </p>
                    </div>
                    <StatusBadge status={a.status} variant={statusVariant[a.status]} />
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                    {a.description}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap text-xs text-[var(--text-secondary)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} />
                      Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <FileText size={13} />
                      Max {a.maxMarks} marks
                    </span>
                    {(a.status === "pending" || a.status === "overdue") && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-semibold",
                          dl < 0 ? "text-red-300" : dl <= 7 ? "text-amber-300" : "text-emerald-300"
                        )}
                      >
                        <Clock size={13} />
                        {dl < 0 ? `${Math.abs(dl)} days overdue` : `${dl} days left`}
                      </span>
                    )}
                    {a.status === "graded" && a.grade && (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                        <Award size={13} /> Grade: {a.grade}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-1">
                    <AVMButton
                      size="sm"
                      variant="outline"
                      fullWidth
                      onClick={() => setActiveId(a.id)}
                    >
                      View Details
                    </AVMButton>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* Submission modal */}
      <Modal
        open={active !== null}
        onClose={closeModal}
        title={active?.title}
        className="max-w-xl"
      >
        {active && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                {active.courseTitle}
              </span>
              <StatusBadge status={active.status} variant={statusVariant[active.status]} />
              <span className="text-xs text-[var(--text-secondary)]">
                Max {active.maxMarks} marks
              </span>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                Description
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {active.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] border-t border-[var(--border)] pt-3">
              <Calendar size={14} />
              Due {new Date(active.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>

            {active.status === "graded" && active.grade ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
                <Award size={22} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    Graded: {active.grade}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Your submission has been reviewed.
                  </p>
                </div>
              </div>
            ) : active.status === "submitted" ? (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 flex items-center gap-3">
                <CheckCircle2 size={22} className="text-[var(--accent)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Submitted — awaiting grading
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    You can resubmit if needed before the deadline.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={submitAssignment} className="space-y-3 border-t border-[var(--border)] pt-4">
                {active.status === "overdue" && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>
                      This assignment is past its due date. Submitting late may incur a
                      penalty — check with your instructor.
                    </span>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="submission-text"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Submission notes / repo link
                  </label>
                  <textarea
                    id="submission-text"
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Add a link to your repo, deployment URL, or a short note for your instructor..."
                    rows={4}
                    className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Attach file
                  </label>
                  <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-base)] px-3 py-4 text-sm text-[var(--text-secondary)] hover:border-[rgba(99,102,241,0.5)] transition-colors">
                    <Upload size={16} />
                    Click to upload (PDF, ZIP, DOCX — UI only)
                    <input type="file" className="hidden" />
                  </label>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <AVMButton variant="ghost" size="md" onClick={closeModal}>
                    Cancel
                  </AVMButton>
                  <AVMButton type="submit" size="md" icon={<Send size={15} />}>
                    Submit Assignment
                  </AVMButton>
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
