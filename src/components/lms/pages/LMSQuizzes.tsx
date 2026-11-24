"use client";

import * as React from "react";
import {
  FileQuestion,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { lmsQuizzes } from "@/lib/data";
import type { LMSQuiz } from "@/lib/data";
import { cn } from "@/lib/utils";

export function LMSQuizzes() {
  const toast = useAVMToast();
  const [quizzes, setQuizzes] = React.useState<LMSQuiz[]>(lmsQuizzes);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const active = quizzes.find((q) => q.id === activeId) ?? null;

  const openQuiz = (q: LMSQuiz) => {
    setActiveId(q.id);
    setAnswers({});
    setSubmitted(false);
  };

  const closeModal = () => {
    setActiveId(null);
    setAnswers({});
    setSubmitted(false);
  };

  const selectAnswer = (qid: string, idx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: idx }));
  };

  const submitQuiz = () => {
    if (!active) return;
    const unanswered = active.questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      toast.error(
        "Please answer all questions",
        `${unanswered.length} question(s) left unanswered.`
      );
      return;
    }
    const correct = active.questions.filter(
      (q) => answers[q.id] === q.correctIndex
    ).length;
    const score = Math.round((correct / active.questions.length) * 100);
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === active.id
          ? { ...q, status: "completed" as const, score }
          : q
      )
    );
    setSubmitted(true);
    toast.success(
      `Quiz submitted — ${score}%`,
      `You got ${correct} out of ${active.questions.length} correct.`
    );
  };

  const retakeQuiz = () => {
    if (!active) return;
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === active.id
          ? { ...q, status: "available" as const, score: undefined }
          : q
      )
    );
    setAnswers({});
    setSubmitted(false);
    toast.info("Quiz reset", "Your previous answers have been cleared.");
  };

  const correctCount = active
    ? active.questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;
  const scorePct = active
    ? Math.round((correctCount / active.questions.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <FileQuestion size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Quizzes
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Test your knowledge and track your scores.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Quiz cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((q, i) => (
          <Reveal key={q.id} delay={i * 70}>
            <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] leading-snug">
                    {q.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {q.courseTitle}
                  </p>
                </div>
                {q.status === "completed" ? (
                  <StatusBadge status="Completed" variant="success" />
                ) : (
                  <StatusBadge status="Available" variant="info" />
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-4">
                <span className="inline-flex items-center gap-1">
                  <FileQuestion size={13} />
                  {q.totalQuestions} questions
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} />
                  {q.duration}
                </span>
              </div>

              {q.status === "completed" && q.score !== undefined ? (
                <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 flex items-center gap-3">
                  <Trophy size={18} className="text-emerald-400" />
                  <div>
                    <p className="font-heading text-lg font-bold text-emerald-300">
                      {q.score}%
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Last attempt score
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Not attempted yet. Take the quiz to see your score.
                  </p>
                </div>
              )}

              <div className="mt-auto">
                <AVMButton
                  size="sm"
                  fullWidth
                  variant={q.status === "completed" ? "outline" : "primary"}
                  onClick={() => openQuiz(q)}
                  icon={
                    q.status === "completed" ? <RotateCcw size={15} /> : <ArrowRight size={15} />
                  }
                >
                  {q.status === "completed" ? "Retake Quiz" : "Start Quiz"}
                </AVMButton>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Quiz modal */}
      <Modal
        open={active !== null}
        onClose={closeModal}
        title={active?.title}
        className="max-w-2xl"
      >
        {active && (
          <div className="space-y-5">
            {/* Quiz meta */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--text-secondary)]">
              <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5">
                {active.courseTitle}
              </span>
              <span className="inline-flex items-center gap-1">
                <FileQuestion size={13} />
                {active.totalQuestions} questions
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={13} />
                {active.duration}
              </span>
            </div>

            {/* Result banner */}
            {submitted && (
              <div
                className={cn(
                  "rounded-xl border p-4 flex items-center gap-4",
                  scorePct >= 70
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-amber-500/30 bg-amber-500/10"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    scorePct >= 70
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  )}
                >
                  <Award size={24} />
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-heading text-2xl font-bold",
                      scorePct >= 70 ? "text-emerald-300" : "text-amber-300"
                    )}
                  >
                    {scorePct}%
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {correctCount} of {active.questions.length} correct •{" "}
                    {scorePct >= 70 ? "Great work!" : "Keep practicing!"}
                  </p>
                </div>
              </div>
            )}

            {/* Progress bar */}
            {!submitted && (
              <div>
                <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1.5">
                  <span>Progress</span>
                  <span>
                    {Object.keys(answers).length} / {active.questions.length} answered
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                  <div
                    className="h-full bg-gradient-primary transition-all duration-300"
                    style={{
                      width: `${(Object.keys(answers).length / active.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {active.questions.map((q, qi) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4"
                  >
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                      <span className="text-[var(--text-secondary)] mr-2">
                        Q{qi + 1}.
                      </span>
                      {q.question}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {q.options.map((opt, oi) => {
                        const selected = userAns === oi;
                        const correct = oi === q.correctIndex;
                        let cls =
                          "border-[var(--border)] bg-[var(--bg-surface)] hover:border-[rgba(99,102,241,0.5)]";
                        if (submitted) {
                          if (correct)
                            cls = "border-emerald-500/50 bg-emerald-500/10";
                          else if (selected && !correct)
                            cls = "border-red-500/50 bg-red-500/10";
                          else cls = "border-[var(--border)] bg-[var(--bg-surface)] opacity-70";
                        } else if (selected) {
                          cls = "border-[var(--primary)] bg-[rgba(99,102,241,0.15)]";
                        }
                        return (
                          <li key={oi}>
                            <button
                              type="button"
                              disabled={submitted}
                              onClick={() => selectAnswer(q.id, oi)}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                                cls,
                                submitted && "cursor-default"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                                  selected
                                    ? "border-[var(--primary)] bg-gradient-primary text-white"
                                    : "border-[var(--border)] text-[var(--text-secondary)]"
                                )}
                              >
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span
                                className={cn(
                                  "flex-1",
                                  selected
                                    ? "text-[var(--text-primary)] font-medium"
                                    : "text-[var(--text-secondary)]"
                                )}
                              >
                                {opt}
                              </span>
                              {submitted && correct && (
                                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                              )}
                              {submitted && selected && !correct && (
                                <XCircle size={16} className="text-red-400 shrink-0" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    {submitted && !isCorrect && (
                      <p className="mt-2 text-xs text-emerald-300">
                        Correct answer:{" "}
                        <span className="font-medium">
                          {String.fromCharCode(65 + q.correctIndex)}.{" "}
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
              {submitted ? (
                <>
                  <AVMButton variant="outline" size="md" onClick={retakeQuiz} icon={<RotateCcw size={15} />}>
                    Retake Quiz
                  </AVMButton>
                  <AVMButton size="md" onClick={closeModal}>
                    Back to Quizzes
                  </AVMButton>
                </>
              ) : (
                <>
                  <AVMButton variant="ghost" size="md" onClick={closeModal}>
                    Cancel
                  </AVMButton>
                  <AVMButton size="md" onClick={submitQuiz} icon={<CheckCircle2 size={15} />}>
                    Submit Quiz
                  </AVMButton>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
