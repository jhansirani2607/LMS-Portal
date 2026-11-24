"use client";

import * as React from "react";
import { FileText, Eye, Save, Search, CheckCircle2, Clock, XCircle } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import {
  getAdminApplicationsList,
  saveAdminApplicationsList,
} from "@/lib/portal-store";
import type { AdminApplication } from "@/lib/data";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Accepted", label: "Accepted" },
  { value: "Rejected", label: "Rejected" },
];

const statusVariant: Record<AdminApplication["status"], "warning" | "info" | "success" | "danger"> = {
  Pending: "warning",
  Reviewed: "info",
  Accepted: "success",
  Rejected: "danger",
};

export function AdminApplications() {
  const toast = useAVMToast();
  const [items, setItems] = React.useState<AdminApplication[]>([]);
  const [reviewId, setReviewId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [filterTab, setFilterTab] = React.useState<string>("All");

  React.useEffect(() => {
    setItems(getAdminApplicationsList());
  }, []);

  const active = items.find((i) => i.id === reviewId) ?? null;
  const [status, setStatus] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (active) {
      setStatus(active.status);
      setNotes(active.notes ?? "");
    }
  }, [active]);

  const saveReview = () => {
    if (!active) return;
    const nextList = items.map((i) =>
      i.id === active.id ? { ...i, status: status as AdminApplication["status"], notes } : i
    );
    setItems(nextList);
    saveAdminApplicationsList(nextList);
    toast.success("Application updated", `${active.name}'s status is now ${status}.`);
    setReviewId(null);
  };

  const filtered = React.useMemo(() => {
    let list = items;
    if (filterTab !== "All") {
      list = list.filter((i) => i.status === filterTab);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.domain.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filterTab, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Internship Applications
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {items.length} total • {items.filter((i) => i.status === "Pending").length} pending review
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicants..."
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
            />
          </div>
        </div>
      </Reveal>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All", "Pending", "Reviewed", "Accepted", "Rejected"].map((tab) => {
          const count = tab === "All" ? items.length : items.filter((i) => i.status === tab).length;
          const activeTab = filterTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 " +
                (activeTab
                  ? "bg-[var(--primary)] text-white shadow-glow-indigo"
                  : "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
              }
            >
              {tab}
              <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Applicant</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Domain Track</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Applied On</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)]">{a.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{a.email} • {a.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{a.domain}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {new Date(a.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} variant={statusVariant[a.status]} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AVMButton size="sm" variant="outline" onClick={() => setReviewId(a.id)} icon={<Eye size={14} />}>
                        Review
                      </AVMButton>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-[var(--text-secondary)]">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Review modal */}
      <Modal open={active !== null} onClose={() => setReviewId(null)} title="Review Application" className="max-w-md">
        {active && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Applicant:</span>
                <span className="font-semibold text-[var(--text-primary)]">{active.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Email:</span>
                <span className="text-[var(--text-primary)]">{active.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Phone:</span>
                <span className="text-[var(--text-primary)]">{active.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Domain:</span>
                <span className="text-[var(--text-primary)] font-medium">{active.domain}</span>
              </div>
              {active.education && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Education:</span>
                  <span className="text-[var(--text-primary)]">{active.education}</span>
                </div>
              )}
            </div>

            <FormField
              id="app-status"
              label="Application Decision"
              type="select"
              required
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium text-[var(--text-primary)]">
                Reviewer Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes regarding interview, technical screening, or recommendation..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" onClick={() => setReviewId(null)}>Cancel</AVMButton>
              <AVMButton onClick={saveReview} icon={<Save size={16} />}>Save Review</AVMButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
