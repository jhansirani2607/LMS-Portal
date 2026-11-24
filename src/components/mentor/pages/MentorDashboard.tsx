"use client";

import * as React from "react";
import {
  Users,
  ClipboardList,
  Rocket,
  MessageSquare,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { StatusBadge } from "@/components/lms/LMSUI";
import {
  currentMentor,
  mentorAssignedStudents,
  mentorPendingEvaluations,
  mentorProjectReviews,
} from "@/lib/data";
import type { NavigateFn } from "@/lib/navigation";

interface MentorDashboardProps {
  onNavigate: NavigateFn;
}

export function MentorDashboard({ onNavigate }: MentorDashboardProps) {
  const pendingEvals = mentorPendingEvaluations.filter((e) => e.status === "Pending");
  const pendingProjects = mentorProjectReviews.filter((p) => p.status === "Pending");

  const stats = [
    {
      label: "Assigned Students",
      value: mentorAssignedStudents.length,
      icon: Users,
      gradient: "from-[#6366f1] to-[#a855f7]",
      page: "mentor-students" as const,
    },
    {
      label: "Pending Evaluations",
      value: pendingEvals.length,
      icon: ClipboardList,
      gradient: "from-[#f59e0b] to-[#ef4444]",
      page: "mentor-assignments" as const,
    },
    {
      label: "Projects to Review",
      value: pendingProjects.length,
      icon: Rocket,
      gradient: "from-[#22d3ee] to-[#6366f1]",
      page: "mentor-projects" as const,
    },
    {
      label: "Feedback Given",
      value: mentorProjectReviews.filter((p) => p.feedback).length + mentorPendingEvaluations.filter((e) => e.feedback).length,
      icon: MessageSquare,
      gradient: "from-[#22c55e] to-[#10b981]",
      page: "mentor-feedback" as const,
    },
  ];

  // Pending tasks list
  const pendingTasks = [
    ...pendingEvals.map((e) => ({
      id: e.id,
      type: "Evaluation" as const,
      title: e.assignmentTitle,
      student: e.studentName,
      submittedDate: e.submittedDate,
      page: "mentor-assignments" as const,
    })),
    ...pendingProjects.map((p) => ({
      id: p.id,
      type: "Project Review" as const,
      title: p.projectTitle,
      student: p.studentName,
      submittedDate: p.submittedDate,
      page: "mentor-projects" as const,
    })),
  ].sort((a, b) => +new Date(a.submittedDate) - +new Date(b.submittedDate));

  // Recent activity
  const recentActivity = [
    ...mentorPendingEvaluations
      .filter((e) => e.status === "Evaluated")
      .map((e) => ({
        id: e.id,
        text: `Evaluated "${e.assignmentTitle}" for ${e.studentName} — Grade: ${e.grade}`,
        timestamp: e.submittedDate,
      })),
    ...mentorProjectReviews
      .filter((p) => p.status !== "Pending")
      .map((p) => ({
        id: p.id,
        text: `Reviewed project "${p.projectTitle}" for ${p.studentName} — ${p.status}`,
        timestamp: p.submittedDate,
      })),
  ].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Welcome, {currentMentor.name.split(" ")[0]}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              You have <span className="text-amber-300 font-semibold">{pendingEvals.length}</span>{" "}
              pending evaluations and{" "}
              <span className="text-[var(--primary)] font-semibold">{pendingProjects.length}</span>{" "}
              projects awaiting review.
            </p>
          </div>
          <AVMButton
            variant="outline"
            onClick={() => onNavigate("mentor-students")}
            iconRight={<ArrowRight size={16} />}
          >
            View Students
          </AVMButton>
        </div>
      </Reveal>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Reveal key={stat.label} delay={i * 70}>
              <button
                onClick={() => onNavigate(stat.page)}
                className="card-hover h-full w-full text-left rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}>
                  <Icon size={22} />
                </div>
                <div className="font-heading text-3xl font-bold text-[var(--text-primary)] tabular-nums">
                  {stat.value}
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{stat.label}</p>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* Pending tasks + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending tasks */}
        <Reveal className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-300" />
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  Pending Tasks
                </h3>
              </div>
              <span className="text-xs text-[var(--text-secondary)]">
                {pendingTasks.length} items
              </span>
            </div>
            {pendingTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--border)] py-10 text-center">
                <CheckCircle2 size={28} className="mx-auto text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">All caught up!</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  No pending evaluations or reviews right now.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                {pendingTasks.map((task) => (
                  <li
                    key={task.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge
                          status={task.type}
                          variant={task.type === "Evaluation" ? "warning" : "info"}
                        />
                      </div>
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {task.student} • Submitted{" "}
                        {new Date(task.submittedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <AVMButton
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate(task.page)}
                    >
                      Open
                    </AVMButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        {/* Recent activity */}
        <Reveal delay={100}>
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Recent Activity
              </h3>
            </div>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)] py-8 text-center">
                No recent activity yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                {recentActivity.map((act) => (
                  <li key={act.id} className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] text-[var(--primary)]">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--text-primary)] leading-snug">
                        {act.text}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {new Date(act.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>

      {/* Quick actions */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <AVMButton variant="outline" onClick={() => onNavigate("mentor-students")} icon={<Users size={16} />}>
              View Students
            </AVMButton>
            <AVMButton variant="outline" onClick={() => onNavigate("mentor-assignments")} icon={<ClipboardList size={16} />}>
              Evaluate
            </AVMButton>
            <AVMButton variant="outline" onClick={() => onNavigate("mentor-projects")} icon={<Rocket size={16} />}>
              Review Projects
            </AVMButton>
            <AVMButton variant="outline" onClick={() => onNavigate("mentor-feedback")} icon={<MessageSquare size={16} />}>
              Give Feedback
            </AVMButton>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
