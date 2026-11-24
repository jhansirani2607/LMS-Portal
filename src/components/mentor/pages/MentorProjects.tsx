"use client";

import * as React from "react";
import { Rocket, Github, ExternalLink, Calendar, Star, Check, RotateCcw } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { mentorProjectReviews, currentMentor } from "@/lib/data";
import type { MentorProjectReview } from "@/lib/data";

const statusVariant: Record<MentorProjectReview["status"], "warning" | "success" | "danger"> = {
  Pending: "warning",
  Approved: "success",
  "Changes Requested": "danger",
};

export function MentorProjects() {
  const toast = useAVMToast();
  const { submit, loading } = useFormSubmit();
  const [items, setItems] = React.useState<MentorProjectReview[]>(mentorProjectReviews);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");

  const active = items.find((i) => i.id === activeId) ?? null;

  const openReview = (item: MentorProjectReview) => {
    setActiveId(item.id);
    setRating(item.rating ?? 0);
    setFeedback(item.feedback ?? "");
  };

  const closeModal = () => {
    setActiveId(null);
    setRating(0);
    setFeedback("");
  };

  const submitReview = (status: "Approved" | "Changes Requested") => {
    if (!active) return;
    if (rating === 0) {
      toast.error("Rating required", "Pick a star rating before submitting.");
      return;
    }
    if (!feedback.trim()) {
      toast.error("Feedback required", "Add a short note explaining your decision.");
      return;
    }
    submit(
      {
        mentorName: currentMentor.name,
        studentName: active.studentName,
        projectTitle: active.projectTitle,
        rating,
        feedback,
        status,
      },
      {
        endpoint: "/api/mentor-review",
        successTitle: status === "Approved" ? "Project approved!" : "Changes requested",
        successDescription: `${active.studentName} will be notified of your review.`,
        onSuccess: () => {
          setItems((prev) =>
            prev.map((it) =>
              it.id === active.id ? { ...it, status, rating, feedback } : it
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
            <Rocket size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Project Review
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Review capstone &amp; mini projects submitted by your students.
            </p>
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
                    {item.projectTitle}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {item.domainTitle}
                  </p>
                </div>
                <StatusBadge status={item.status} variant={statusVariant[item.status]} />
              </div>

              <div className="flex items-center gap-3 flex-wrap text-xs text-[var(--text-secondary)]">
                <span>Student: <span className="text-[var(--text-primary)] font-medium">{item.studentName}</span></span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(item.submittedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>

              {item.rating ? (
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        className={n <= item.rating! ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {item.rating}/5
                  </span>
                </div>
              ) : null}

              <div className="flex gap-2 flex-wrap">
                <a
                  href={`https://${item.repoLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[rgba(99,102,241,0.5)]"
                >
                  <Github size={12} /> Repo
                </a>
                <a
                  href={`https://${item.demoLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[rgba(99,102,241,0.5)]"
                >
                  <ExternalLink size={12} /> Demo
                </a>
              </div>

              {item.feedback && (
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 italic">
                  &ldquo;{item.feedback}&rdquo;
                </p>
              )}

              <div className="mt-auto pt-1">
                <AVMButton
                  size="sm"
                  fullWidth
                  variant={item.status === "Pending" ? "primary" : "outline"}
                  onClick={() => openReview(item)}
                >
                  {item.status === "Pending" ? "Review" : "View / Edit Review"}
                </AVMButton>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Review modal */}
      <Modal
        open={active !== null}
        onClose={closeModal}
        title={active?.projectTitle}
        className="max-w-xl"
      >
        {active && (
          <div className="space-y-4">
            {/* Project info */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Student</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{active.studentName}</p>
                </div>
                <StatusBadge status={active.status} variant={statusVariant[active.status]} />
              </div>
              <div className="flex items-center gap-3 flex-wrap text-xs text-[var(--text-secondary)]">
                <span>{active.domainTitle}</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(active.submittedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <a
                  href={`https://${active.repoLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[rgba(99,102,241,0.5)]"
                >
                  <Github size={12} /> {active.repoLink}
                </a>
                <a
                  href={`https://${active.demoLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[rgba(99,102,241,0.5)]"
                >
                  <ExternalLink size={12} /> {active.demoLink}
                </a>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                Rating <span className="text-[var(--accent)]">*</span>
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
                      size={24}
                      className={n <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold text-[var(--text-primary)]">
                  {rating > 0 ? `${rating}/5` : "Select"}
                </span>
              </div>
            </div>

            {/* Feedback */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="feedback" className="text-sm font-medium text-[var(--text-primary)]">
                Feedback <span className="text-[var(--accent)]">*</span>
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What was done well? What should be improved? Any specific changes required?"
                rows={4}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" size="md" onClick={closeModal}>
                Cancel
              </AVMButton>
              <AVMButton
                variant="outline"
                size="md"
                disabled={loading}
                onClick={() => submitReview("Changes Requested")}
                icon={<RotateCcw size={15} />}
                className="border-red-500/40 text-red-300 hover:bg-red-500/10"
              >
                Request Changes
              </AVMButton>
              <AVMButton
                size="md"
                disabled={loading}
                onClick={() => submitReview("Approved")}
                icon={<Check size={15} />}
              >
                {loading ? "Submitting..." : "Approve"}
              </AVMButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
