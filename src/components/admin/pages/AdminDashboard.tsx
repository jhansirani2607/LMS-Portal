"use client";

import * as React from "react";
import {
  Users,
  Briefcase,
  BookOpen,
  FileText,
  Award,
  ClipboardList,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { StatusBadge } from "@/components/lms/LMSUI";
import {
  adminStudents,
  adminInternships,
  adminCourses,
  adminApplications,
  adminCertificates,
  mentors,
  adminReports,
} from "@/lib/data";
import { getLiveAdminStats } from "@/lib/portal-store";
import type { NavigateFn } from "@/lib/navigation";

interface AdminDashboardProps {
  onNavigate: NavigateFn;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [liveStats, setLiveStats] = React.useState({
    totalStudents: adminStudents.length,
    activeStudents: adminStudents.filter((s) => s.status === "Active").length,
    pendingStudents: adminStudents.filter((s) => s.status === "Pending").length,
    totalMentors: mentors.length,
    activeInternships: adminInternships.length,
    pendingApplications: adminApplications.filter((a) => a.status === "Pending").length,
    issuedCertificates: adminCertificates.length,
    totalCourses: adminCourses.length,
    pendingCourseRequests: 0,
  });

  React.useEffect(() => {
    const sync = () => setLiveStats(getLiveAdminStats());
    sync();

    if (typeof window !== "undefined") {
      window.addEventListener("avm_store_updated", sync);
      window.addEventListener("storage", sync);
      return () => {
        window.removeEventListener("avm_store_updated", sync);
        window.removeEventListener("storage", sync);
      };
    }
  }, []);

  const stats = [
    { label: "Total Students", value: liveStats.totalStudents, icon: Users, color: "from-[#6366f1] to-[#a855f7]", page: "admin-students" as const },
    { label: "Total Mentors", value: liveStats.totalMentors, icon: ClipboardList, color: "from-[#22d3ee] to-[#6366f1]", page: "admin-mentors" as const },
    { label: "Active Internships", value: liveStats.activeInternships, icon: Briefcase, color: "from-[#f59e0b] to-[#ef4444]", page: "admin-internships" as const },
    { label: "Applications Pending", value: liveStats.pendingApplications, icon: FileText, color: "from-[#22c55e] to-[#10b981]", page: "admin-applications" as const },
    { label: "Certificates Issued", value: liveStats.issuedCertificates, icon: Award, color: "from-[#a855f7] to-[#ec4899]", page: "admin-certificates" as const },
    { label: "Courses", value: liveStats.totalCourses, icon: BookOpen, color: "from-[#3b82f6] to-[#06b6d4]", page: "admin-courses" as const },
  ];

  const maxApp = Math.max(...adminReports.applicationsPerDomain.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Admin Dashboard
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Overview of the AVM Smart Solutions internship platform.
            </p>
          </div>
          <AVMButton
            variant="outline"
            onClick={() => onNavigate("admin-reports")}
            iconRight={<ArrowRight size={16} />}
          >
            View Reports
          </AVMButton>
        </div>
      </Reveal>

      {/* Pending Student Registrations Alert Banner */}
      {liveStats.pendingStudents > 0 && (
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-4 text-amber-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-heading font-semibold text-amber-300 text-sm">
                  {liveStats.pendingStudents} New Student Registration{liveStats.pendingStudents > 1 ? "s" : ""} Awaiting Admin Approval
                </p>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Students have signed up online. Accept and approve their accounts to grant them login access to their LMS courses.
                </p>
              </div>
            </div>
            <AVMButton
              size="sm"
              onClick={() => onNavigate("admin-students")}
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold shrink-0"
              iconRight={<ArrowRight size={14} />}
            >
              Review &amp; Approve
            </AVMButton>
          </div>
        </Reveal>
      )}

      {/* Pending Course Requests Alert Banner */}
      {liveStats.pendingCourseRequests > 0 && (
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-sky-500/40 bg-gradient-to-r from-sky-500/15 via-sky-500/10 to-transparent p-4 text-sky-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-heading font-semibold text-sky-300 text-sm">
                  {liveStats.pendingCourseRequests} Course Enrollment Request{liveStats.pendingCourseRequests > 1 ? "s" : ""} Pending Review
                </p>
                <p className="text-xs text-sky-200/80 mt-0.5">
                  Logged-in students requested enrollment into additional courses. Approve requests to grant immediate access.
                </p>
              </div>
            </div>
            <AVMButton
              size="sm"
              onClick={() => onNavigate("admin-courses")}
              className="bg-sky-500 hover:bg-sky-400 text-black font-semibold shrink-0"
              iconRight={<ArrowRight size={14} />}
            >
              Review Requests
            </AVMButton>
          </div>
        </Reveal>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Reveal key={stat.label} delay={i * 60}>
              <button
                onClick={() => onNavigate(stat.page)}
                className="card-hover h-full w-full text-left rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"
              >
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                  <Icon size={18} />
                </div>
                <div className="font-heading text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                  {stat.value}
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{stat.label}</p>
              </button>
            </Reveal>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent applications */}
        <Reveal className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Recent Applications
              </h3>
              <button
                onClick={() => onNavigate("admin-applications")}
                className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                View all
              </button>
            </div>
            <ul className="flex flex-col gap-3">
              {adminApplications.slice(0, 5).map((app) => (
                <li
                  key={app.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {app.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {app.domain} • Applied {new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <StatusBadge
                    status={app.status}
                    variant={
                      app.status === "Accepted"
                        ? "success"
                        : app.status === "Pending"
                        ? "warning"
                        : app.status === "Rejected"
                        ? "danger"
                        : "info"
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Quick actions */}
        <Reveal delay={100}>
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <AVMButton variant="outline" fullWidth onClick={() => onNavigate("admin-applications")} icon={<FileText size={16} />}>
                Review Applications
              </AVMButton>
              <AVMButton variant="outline" fullWidth onClick={() => onNavigate("admin-certificates")} icon={<Award size={16} />}>
                Generate Certificate
              </AVMButton>
              <AVMButton variant="outline" fullWidth onClick={() => onNavigate("admin-students")} icon={<Users size={16} />}>
                Manage Students
              </AVMButton>
              <AVMButton variant="outline" fullWidth onClick={() => onNavigate("admin-mentors")} icon={<ClipboardList size={16} />}>
                Assign Mentors
              </AVMButton>
              <AVMButton variant="outline" fullWidth onClick={() => onNavigate("admin-reports")} icon={<TrendingUp size={16} />}>
                View Reports
              </AVMButton>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Applications per domain bar chart */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
              Applications per Domain
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">
              Total: {adminReports.applicationsPerDomain.reduce((s, d) => s + d.value, 0)}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {adminReports.applicationsPerDomain.map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs font-medium text-[var(--text-secondary)] text-right">
                  {d.label}
                </span>
                <div className="flex-1 h-6 rounded-lg bg-[var(--bg-base)] overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-primary transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(d.value / maxApp) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{d.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
