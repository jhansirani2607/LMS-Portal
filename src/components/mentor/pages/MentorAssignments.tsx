"use client";

import * as React from "react";
import { ClipboardList, Send, Award, Calendar, FileText } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { mentorPendingEvaluations, currentMentor } from "@/lib/data";
import type { MentorPendingEvaluation } from "@/lib/data";

export function MentorAssignments() {
  const toast = useAVMToast();
  const { submit, loading } = useFormSubmit();
  const [items, setItems] = React.useState<MentorPendingEvaluation[]>(mentorPendingEvaluations);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [grade, setGrade] = React.useState("");
  const [feedback, setFeedback] = React.useState("");

  const active = items.find((i) => i.id === activeId) ?? null;

  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === "Pending").length,
    evaluated: items.filter((i) => i.status === "Evaluated").length,
  };

  const openEval = (item: MentorPendingEvaluation) => {
    setActiveId(item.id);
    setGrade(item.grade ?? "");
    setFeedback(item.feedback ?? "");
  };

  const closeModal = () => {
    setActiveId(null);
    setGrade("");
    setFeedback("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;
    if (!grade.trim()) {
      toast.error("Grade required", "Enter a grade (e.g. A, B+, 85/100).");
      return;
    }
    if (!feedback.trim()) {
      toast.error("Feedback required", "Add a short note for the student.");
      return;
    }
    submit(
      {
        mentorName: currentMentor.name,
        studentName: active.studentName,
        assignmentTitle: active.assignmentTitle,
        grade,
        feedback,
      },
      {
        endpoint: "/api/mentor-evaluation",
        successTitle: "Evaluation submitted!",
        successDescription: `${active.studentName} can now view their grade and feedback.`,
        onSuccess: () => {
          setItems((prev) =>
            prev.map((it) =>
              it.id === active.id
                ? { ...it, status: "Evaluated" as const, grade, feedback }
                : it
            )
          );
          closeModal();
        },
      }
    );
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
              Assignment Evaluation
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Review student submissions and assign grades with feedback.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex items-center gap-3">
            <ClipboardList size={20} className="text-[var(--primary)]" />
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--text-primary)]">{stats.total}</p>
              <p className="text-xs text-[var(--text-secondary)]">Total</p>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex items-center gap-3">
            <Calendar size={20} className="text-amber-400" />
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--text-primary)]">{stats.pending}</p>
              <p className="text-xs text-[var(--text-secondary)]">Pending</p>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex items-center gap-3">
            <Award size={20} className="text-emerald-400" />
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--text-primary)]">{stats.evaluated}</p>
              <p className="text-xs text-[var(--text-secondary)]">Evaluated</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 60}>
            <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] leading-snug">
                    {item.assignmentTitle}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {item.courseTitle}
                  </p>
                </div>
                <StatusBadge
                  status={item.status}
                  variant={item.status === "Evaluated" ? "success" : "warning"}
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap text-xs text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <FileText size={12} /> {item.studentName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  Submitted {new Date(item.submittedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span>Max {item.maxMarks} marks</span>
              </div>

              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                {item.submissionContent}
              </p>

              {item.status === "Evaluated" ? (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
                  <p className="text-emerald-300 font-semibold">Grade: {item.grade}</p>
                  <p className="text-[var(--text-secondary)] mt-1">{item.feedback}</p>
                </div>
              ) : null}

              <div className="mt-auto pt-1">
                <AVMButton
                  size="sm"
                  fullWidth
                  variant={item.status === "Pending" ? "primary" : "outline"}
                  onClick={() => openEval(item)}
                >
                  {item.status === "Pending" ? "Evaluate" : "View / Edit"}
                </AVMButton>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Evaluation modal */}
      <Modal
        open={active !== null}
        onClose={closeModal}
        title={active?.assignmentTitle}
        className="max-w-xl"
      >
        {active && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                {active.courseTitle}
              </span>
              <StatusBadge
                status={active.status}
                variant={active.status === "Evaluated" ? "success" : "warning"}
              />
              <span className="text-xs text-[var(--text-secondary)]">
                Max {active.maxMarks} marks
              </span>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)] mb-1">
                Student
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{active.studentName}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Submitted {new Date(active.submittedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                Submission
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3">
                {active.submissionContent}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="grade" className="text-sm font-medium text-[var(--text-primary)]">
                  Grade <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. A, B+, 85/100"
                  className="h-11 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Max Marks
                </label>
                <div className="flex h-11 items-center rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-secondary)]">
                  {active.maxMarks}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="feedback" className="text-sm font-medium text-[var(--text-primary)]">
                Feedback <span className="text-[var(--accent)]">*</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide constructive feedback — what was done well, what to improve..."
                rows={4}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" size="md" onClick={closeModal}>
                Cancel
              </AVMButton>
              <AVMButton type="submit" size="md" disabled={loading} icon={<Send size={15} />}>
                {loading ? "Submitting..." : "Submit Evaluation"}
              </AVMButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
