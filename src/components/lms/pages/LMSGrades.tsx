"use client";

import * as React from "react";
import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ProgressBar } from "@/components/lms/LMSUI";
import { lmsGrades } from "@/lib/data";
import { cn } from "@/lib/utils";

const letterColor: Record<string, string> = {
  "A+": "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  A: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
  "A-": "text-lime-300 bg-lime-500/15 border-lime-500/30",
  "B+": "text-amber-300 bg-amber-500/15 border-amber-500/30",
  B: "text-amber-300 bg-amber-500/15 border-amber-500/30",
  "B-": "text-amber-300 bg-amber-500/15 border-amber-500/30",
  "C+": "text-orange-300 bg-orange-500/15 border-orange-500/30",
  C: "text-orange-300 bg-orange-500/15 border-orange-500/30",
  D: "text-red-300 bg-red-500/15 border-red-500/30",
  F: "text-red-300 bg-red-500/15 border-red-500/30",
};

function overallLetter(avg: number): string {
  if (avg >= 95) return "A+";
  if (avg >= 90) return "A";
  if (avg >= 85) return "A-";
  if (avg >= 80) return "B+";
  if (avg >= 75) return "B";
  if (avg >= 70) return "B-";
  if (avg >= 65) return "C+";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  return "F";
}

export function LMSGrades() {
  const avg = Math.round(
    lmsGrades.reduce((s, g) => s + g.overallGrade, 0) / lmsGrades.length
  );
  const overallLetterGrade = overallLetter(avg);

  const sorted = [...lmsGrades].sort((a, b) => b.overallGrade - a.overallGrade);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <GraduationCap size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              My Grades
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Performance summary across all enrolled courses.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Overall summary */}
      <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-white">
              <TrendingUp size={26} />
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-[var(--text-primary)] tabular-nums">
                {avg}%
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Overall average</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full border font-heading text-xl font-bold",
                letterColor[overallLetterGrade]
              )}
            >
              {overallLetterGrade}
            </div>
            <div>
              <p className="font-heading text-base font-semibold text-[var(--text-primary)]">
                Cumulative GPA
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Letter grade average</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#10b981] text-white">
              <Award size={26} />
            </div>
            <div>
              <p className="font-heading text-3xl font-bold text-[var(--text-primary)] tabular-nums">
                {lmsGrades.filter((g) => g.overallGrade >= 80).length}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Courses at B+ or higher</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Grades table */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">
                    Course
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text-primary)]">
                    Assignments
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text-primary)]">
                    Quizzes
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text-primary)]">
                    Project
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text-primary)]">
                    Overall
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-[var(--text-primary)]">
                    Letter
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {lmsGrades.map((g) => (
                  <tr key={g.courseId} className="hover:bg-[rgba(99,102,241,0.05)]">
                    <td className="px-4 py-3 text-[var(--text-primary)] font-medium">
                      {g.courseTitle}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-secondary)] tabular-nums">
                      {g.assignmentsGrade}%
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-secondary)] tabular-nums">
                      {g.quizGrade}%
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--text-secondary)] tabular-nums">
                      {g.projectGrade}%
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-[var(--text-primary)] tabular-nums">
                      {g.overallGrade}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex min-w-[2.5rem] justify-center rounded-md border px-2 py-0.5 text-xs font-bold",
                          letterColor[g.letterGrade]
                        )}
                      >
                        {g.letterGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Visual breakdown */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
            Overall Grade Breakdown
          </h3>
          <ul className="flex flex-col gap-4">
            {lmsGrades.map((g) => (
              <li key={g.courseId}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {g.courseTitle}
                  </span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums shrink-0">
                    {g.overallGrade}%
                  </span>
                </div>
                <ProgressBar value={g.overallGrade} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Performance insights */}
      <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex items-start gap-3">
            <TrendingUp size={20} className="text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                You&apos;re excelling in {best.courseTitle}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Overall grade of {best.overallGrade}% ({best.letterGrade}) — keep up
                the great work and consider mentoring peers.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                Focus more on {worst.courseTitle}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Overall grade of {worst.overallGrade}% ({worst.letterGrade}) — revisit
                the fundamentals and schedule time with your mentor.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Trend note */}
      <Reveal>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <TrendingDown size={14} className="text-[var(--text-secondary)]" />
          Grades shown are sample data — they will sync from the grading backend
          once it&apos;s wired in.
        </div>
      </Reveal>
    </div>
  );
}
