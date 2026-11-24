"use client";

import * as React from "react";
import { BarChart3, TrendingUp, Award, Users, Briefcase } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { adminReports, adminStudents, adminCertificates, mentors } from "@/lib/data";

export function AdminReports() {
  const maxApp = Math.max(...adminReports.applicationsPerDomain.map((d) => d.value));
  const maxStudents = Math.max(...adminReports.studentsPerDomain.map((d) => d.value));
  const maxCompletion = 100;
  const maxMentorPerf = Math.max(...adminReports.mentorPerformance.map((m) => m.students));
  const maxOverTime = Math.max(...adminReports.applicationsOverTime.map((d) => d.value));

  const summaryCards = [
    { label: "Total Students", value: adminStudents.length, icon: Users, gradient: "from-[#6366f1] to-[#a855f7]" },
    { label: "Total Mentors", value: mentors.length, icon: Briefcase, gradient: "from-[#22d3ee] to-[#6366f1]" },
    { label: "Certificates Issued", value: adminReports.certificateStats.issued, icon: Award, gradient: "from-[#22c55e] to-[#10b981]" },
    { label: "Avg Completion Rate", value: `${Math.round(adminReports.completionRates.reduce((s, c) => s + c.value, 0) / adminReports.completionRates.length)}%`, icon: TrendingUp, gradient: "from-[#f59e0b] to-[#ef4444]" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Reports &amp; Analytics
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Platform-wide insights powered by sample data.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Reveal key={card.label} delay={i * 70}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white`}>
                  <Icon size={20} />
                </div>
                <div className="font-heading text-2xl font-bold text-[var(--text-primary)]">
                  {card.value}
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{card.label}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications per domain */}
        <Reveal>
          <BarChartCard
            title="Applications per Domain"
            total={adminReports.applicationsPerDomain.reduce((s, d) => s + d.value, 0)}
            data={adminReports.applicationsPerDomain}
            max={maxApp}
            color="bg-gradient-primary"
          />
        </Reveal>

        {/* Students per domain */}
        <Reveal delay={100}>
          <BarChartCard
            title="Students per Domain"
            total={adminReports.studentsPerDomain.reduce((s, d) => s + d.value, 0)}
            data={adminReports.studentsPerDomain}
            max={maxStudents}
            color="bg-gradient-to-r from-[#22d3ee] to-[#6366f1]"
          />
        </Reveal>

        {/* Completion rates */}
        <Reveal>
          <BarChartCard
            title="Completion Rates (%)"
            total={null}
            data={adminReports.completionRates}
            max={maxCompletion}
            color="bg-gradient-to-r from-[#22c55e] to-[#10b981]"
            suffix="%"
          />
        </Reveal>

        {/* Applications over time */}
        <Reveal delay={100}>
          <BarChartCard
            title="Applications Over Time"
            total={adminReports.applicationsOverTime.reduce((s, d) => s + d.value, 0)}
            data={adminReports.applicationsOverTime}
            max={maxOverTime}
            color="bg-gradient-to-r from-[#f59e0b] to-[#ef4444]"
          />
        </Reveal>
      </div>

      {/* Mentor performance */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
              Mentor Performance
            </h3>
            <span className="text-xs text-[var(--text-secondary)]">
              {adminReports.mentorPerformance.length} active mentors
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-3 py-2 font-semibold text-[var(--text-primary)]">Mentor</th>
                  <th className="text-left px-3 py-2 font-semibold text-[var(--text-primary)]">Students</th>
                  <th className="text-left px-3 py-2 font-semibold text-[var(--text-primary)]">Avg Progress</th>
                  <th className="text-left px-3 py-2 font-semibold text-[var(--text-primary)] w-1/2">Visual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {adminReports.mentorPerformance.map((m) => (
                  <tr key={m.name}>
                    <td className="px-3 py-3 font-medium text-[var(--text-primary)]">{m.name}</td>
                    <td className="px-3 py-3 text-[var(--text-secondary)]">{m.students}</td>
                    <td className="px-3 py-3 text-[var(--text-secondary)]">{m.avgProgress}%</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-5 rounded-md bg-[var(--bg-base)] overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary"
                            style={{ width: `${(m.students / maxMentorPerf) * 100}%` }}
                          />
                        </div>
                        <div className="flex-1 h-5 rounded-md bg-[var(--bg-base)] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#22c55e] to-[#10b981]"
                            style={{ width: `${m.avgProgress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Certificate stats */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
            Certificate Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
              <p className="font-heading text-3xl font-bold text-emerald-300">
                {adminReports.certificateStats.issued}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Issued</p>
            </div>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
              <p className="font-heading text-3xl font-bold text-red-300">
                {adminReports.certificateStats.revoked}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Revoked</p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-5 text-center">
              <p className="font-heading text-3xl font-bold text-[var(--text-primary)]">
                {adminReports.certificateStats.total}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Total</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Note */}
      <Reveal>
        <p className="text-xs text-[var(--text-secondary)] text-center">
          All chart data is sample data — it will sync from the live database once analytics are wired in.
        </p>
      </Reveal>
    </div>
  );
}

interface BarChartCardProps {
  title: string;
  total: number | null;
  data: { label: string; value: number }[];
  max: number;
  color: string;
  suffix?: string;
}

function BarChartCard({ title, total, data, max, color, suffix = "" }: BarChartCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        {total !== null && (
          <span className="text-xs text-[var(--text-secondary)]">
            Total: <span className="font-semibold text-[var(--text-primary)]">{total}</span>
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs font-medium text-[var(--text-secondary)] text-right">
              {d.label}
            </span>
            <div className="flex-1 h-6 rounded-lg bg-[var(--bg-base)] overflow-hidden relative">
              <div
                className={`h-full ${color} transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${Math.max((d.value / max) * 100, 8)}%` }}
              >
                <span className="text-xs font-bold text-white">
                  {d.value}
                  {suffix}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
