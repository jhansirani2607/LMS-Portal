"use client";

import * as React from "react";
import { MessageSquare, Star, Send, User } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { mentorAssignedStudents } from "@/lib/data";

type Recommendation = "Strong" | "Yes" | "No";

export function MentorFeedback() {
  const toast = useAVMToast();
  const [studentId, setStudentId] = React.useState<string>(mentorAssignedStudents[0]?.id ?? "");
  const [rating, setRating] = React.useState(0);
  const [strengths, setStrengths] = React.useState("");
  const [improvements, setImprovements] = React.useState("");
  const [recommendation, setRecommendation] = React.useState<Recommendation>("Yes");
  const [submitting, setSubmitting] = React.useState(false);

  const selectedStudent = mentorAssignedStudents.find((s) => s.id === studentId) ?? null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      toast.error("Select a student", "Pick a student to give feedback to.");
      return;
    }
    if (rating === 0) {
      toast.error("Rating required", "Pick an overall rating.");
      return;
    }
    if (!strengths.trim() || !improvements.trim()) {
      toast.error("Both fields required", "Fill in both strengths and improvements.");
      return;
    }
    setSubmitting(true);
    // UI-only submit — graceful-degrade demo
    setTimeout(() => {
      setSubmitting(false);
      toast.success(
        "Feedback recorded",
        `${selectedStudent.name} will see your feedback in their portal.`
      );
      setRating(0);
      setStrengths("");
      setImprovements("");
      setRecommendation("Yes");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Student Feedback
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Share structured feedback with any of your assigned students.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student picker */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 h-fit">
            <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] mb-3">
              Select Student
            </h3>
            <ul className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
              {mentorAssignedStudents.map((s) => {
                const active = s.id === studentId;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setStudentId(s.id)}
                      className={
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors " +
                        (active
                          ? "bg-[rgba(99,102,241,0.15)] border border-[var(--primary)]"
                          : "border border-transparent hover:bg-[rgba(99,102,241,0.08)]")
                      }
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                        {s.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                          {s.name}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{s.domain}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* Feedback form */}
        <Reveal delay={100} className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6 space-y-5"
            noValidate
          >
            {/* Selected student card */}
            {selectedStudent && (
              <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-white">
                  {selectedStudent.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-base font-semibold text-[var(--text-primary)]">
                    {selectedStudent.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {selectedStudent.domain} • {selectedStudent.progress}% complete
                  </p>
                </div>
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                Overall Rating <span className="text-[var(--accent)]">*</span>
              </label>
              <div className="inline-flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    className="hover:scale-110 transition-transform p-1"
                  >
                    <Star
                      size={26}
                      className={n <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold text-[var(--text-primary)]">
                  {rating > 0 ? `${rating}/5` : "Select rating"}
                </span>
              </div>
            </div>

            {/* Strengths */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="strengths" className="text-sm font-medium text-[var(--text-primary)]">
                Strengths <span className="text-[var(--accent)]">*</span>
              </label>
              <textarea
                id="strengths"
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="What is the student doing well? Strong concepts, code quality, communication..."
                rows={4}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors resize-none"
              />
            </div>

            {/* Improvements */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="improvements" className="text-sm font-medium text-[var(--text-primary)]">
                Areas for Improvement <span className="text-[var(--accent)]">*</span>
              </label>
              <textarea
                id="improvements"
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="What should the student focus on improving? Specific, actionable advice works best."
                rows={4}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors resize-none"
              />
            </div>

            {/* Recommendation */}
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                Recommendation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Strong", "Yes", "No"] as Recommendation[]).map((rec) => {
                  const active = recommendation === rec;
                  return (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => setRecommendation(rec)}
                      className={
                        "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors " +
                        (active
                          ? rec === "Strong"
                            ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                            : rec === "Yes"
                            ? "border-[var(--primary)] bg-[rgba(99,102,241,0.15)] text-[var(--primary)]"
                            : "border-red-500/50 bg-red-500/15 text-red-300"
                          : "border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
                      }
                    >
                      {rec === "Strong" ? "Strongly Recommend" : rec === "Yes" ? "Recommend" : "Don't Recommend"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
              <AVMButton
                type="submit"
                size="md"
                disabled={submitting}
                icon={<Send size={15} />}
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </AVMButton>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
