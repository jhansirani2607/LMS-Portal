"use client";

import * as React from "react";
import { FileText, Eye, Save } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { adminApplications } from "@/lib/data";
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
  const [items, setItems] = React.useState<AdminApplication[]>(adminApplications);
  const [reviewId, setReviewId] = React.useState<string | null>(null);

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
    setItems((prev) =>
      prev.map((i) =>
        i.id === active.id ? { ...i, status: status as AdminApplication["status"], notes } : i
      )
    );
    toast.success("Application updated", `${active.name}'s status is now ${status}.`);
    setReviewId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Applications
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {items.length} total • {items.filter((i) => i.status === "Pending").length} pending
            </p>
          </div>
        </div>
      </Reveal>

      {/* Table */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Applicant</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Domain</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Applied</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((a) => (
                  <tr key={a.id} className="hover:bg-[rgba(99,102,241,0.05)]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text-primary)]">{a.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{a.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] max-w-xs truncate">{a.domain}</td>
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
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Review modal */}
      <Modal
        open={active !== null}
        onClose={() => setReviewId(null)}
        title="Review Application"
        className="max-w-lg"
      >
        {active && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-heading text-base font-semibold text-[var(--text-primary)]">
                    {active.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">{active.email}</p>
                </div>
                <StatusBadge status={active.status} variant={statusVariant[active.status]} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[var(--text-secondary)]">Phone</p>
                  <p className="text-[var(--text-primary)] font-medium">{active.phone}</p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)]">Applied</p>
                  <p className="text-[var(--text-primary)] font-medium">
                    {new Date(active.appliedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)]">Education</p>
                  <p className="text-[var(--text-primary)] font-medium">{active.education ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)]">Domain</p>
                  <p className="text-[var(--text-primary)] font-medium">{active.domain}</p>
                </div>
              </div>
            </div>

            <FormField
              id="app-status"
              label="Status"
              type="select"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="app-notes" className="text-sm font-medium text-[var(--text-primary)]">
                Internal Notes
              </label>
              <textarea
                id="app-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this applicant — background, strengths, decision rationale..."
                rows={4}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" onClick={() => setReviewId(null)}>Cancel</AVMButton>
              <AVMButton onClick={saveReview} icon={<Save size={15} />}>
                Save Review
              </AVMButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
