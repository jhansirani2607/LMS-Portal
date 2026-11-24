"use client";

import * as React from "react";
import { Award, Plus, Eye, Copy, Download, Calendar, User } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { internshipDomains, certificateEligibleStudents } from "@/lib/data";
import {
  getAdminCertificatesList,
  issueAdminCertificate,
  getAdminStudentsList,
} from "@/lib/portal-store";
import type { AdminCertificate } from "@/lib/data";

export function AdminCertificates() {
  const toast = useAVMToast();
  const { submit, loading } = useFormSubmit();
  const [items, setItems] = React.useState<AdminCertificate[]>([]);
  const [viewId, setViewId] = React.useState<string | null>(null);
  const [genOpen, setGenOpen] = React.useState(false);
  const [genResult, setGenResult] = React.useState<AdminCertificate | null>(null);

  // Load certificates and student candidates on mount
  React.useEffect(() => {
    setItems(getAdminCertificatesList());
  }, []);

  // Generate form
  const [studentId, setStudentId] = React.useState("");
  const [courseTitle, setCourseTitle] = React.useState("");
  const [issueDate, setIssueDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );

  const viewCert = items.find((c) => c.id === viewId) ?? null;

  const courseOptions = [
    ...internshipDomains.map((d) => ({ value: d.title, label: d.title })),
  ];

  const allEligibleStudents = React.useMemo(() => {
    const list = [...certificateEligibleStudents];
    const registered = getAdminStudentsList();
    for (const r of registered) {
      if (!list.some((s) => s.id === r.id)) {
        list.push({ id: r.id, name: r.name, course: r.domain });
      }
    }
    return list;
  }, []);

  const studentOptions = allEligibleStudents.map((s) => ({
    value: s.id,
    label: `${s.name} — ${s.course}`,
  }));

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseTitle) {
      toast.error("All fields required", "Pick a student and a course.");
      return;
    }
    const student = allEligibleStudents.find((s) => s.id === studentId);
    if (!student) return;
    submit(
      {
        studentName: student.name,
        courseTitle,
        issueDate,
      },
      {
        endpoint: "/api/admin/certificate",
        successTitle: "Certificate generated!",
        successDescription: `Certificate for ${student.name} has been issued.`,
        onSuccess: () => {
          const newCert = issueAdminCertificate({
            studentName: student.name,
            courseTitle,
            issueDate,
          });
          setItems(getAdminCertificatesList());
          setGenResult(newCert);
          setGenOpen(false);
          setStudentId("");
          setCourseTitle("");
        },
      }
    );
  };

  const copyVerifyLink = (cert: AdminCertificate) => {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/?verify=${cert.certificateId}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    toast.success("Verify link copied", link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
              <Award size={20} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Certificates
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {items.length} issued • {items.filter((c) => c.status === "Issued").length} active
              </p>
            </div>
          </div>
          <AVMButton onClick={() => setGenOpen(true)} icon={<Plus size={16} />}>
            Generate Certificate
          </AVMButton>
        </div>
      </Reveal>

      {/* Table */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Student</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Course</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Cert ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Issued</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((c) => (
                  <tr key={c.id} className="hover:bg-[rgba(99,102,241,0.05)]">
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{c.studentName}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{c.courseTitle}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)]">{c.certificateId}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {new Date(c.issueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} variant={c.status === "Issued" ? "success" : "danger"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewId(c.id)}
                          aria-label={`View ${c.certificateId}`}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => copyVerifyLink(c)}
                          aria-label="Copy verify link"
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* Generate modal */}
      <Modal
        open={genOpen}
        onClose={() => setGenOpen(false)}
        title="Generate Certificate"
        className="max-w-md"
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          <FormField
            id="g-student"
            label="Student"
            type="select"
            required
            value={studentId}
            onChange={setStudentId}
            options={studentOptions}
            placeholder="Select eligible student"
          />
          <FormField
            id="g-course"
            label="Course / Internship"
            type="select"
            required
            value={courseTitle}
            onChange={setCourseTitle}
            options={courseOptions}
            placeholder="Select course"
          />
          <FormField
            id="g-date"
            label="Issue Date"
            required
            inputType="date"
            value={issueDate}
            onChange={setIssueDate}
          />
          <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
            <AVMButton type="button" variant="ghost" onClick={() => setGenOpen(false)}>Cancel</AVMButton>
            <AVMButton type="submit" disabled={loading} icon={<Award size={15} />}>
              {loading ? "Generating..." : "Generate"}
            </AVMButton>
          </div>
        </form>
      </Modal>

      {/* View certificate modal */}
      <Modal
        open={viewCert !== null}
        onClose={() => setViewId(null)}
        title="Certificate"
        className="max-w-2xl"
      >
        {viewCert && <CertificatePreview cert={viewCert} onCopy={() => copyVerifyLink(viewCert)} />}
      </Modal>

      {/* Newly-generated certificate preview */}
      <Modal
        open={genResult !== null}
        onClose={() => setGenResult(null)}
        title="Certificate Generated"
        className="max-w-2xl"
      >
        {genResult && (
          <div className="space-y-4">
            <CertificatePreview cert={genResult} onCopy={() => copyVerifyLink(genResult)} />
            <div className="flex justify-end">
              <AVMButton onClick={() => setGenResult(null)}>Done</AVMButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CertificatePreview({
  cert,
  onCopy,
}: {
  cert: AdminCertificate;
  onCopy: () => void;
}) {
  const toast = useAVMToast();
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl border-2 border-[rgba(99,102,241,0.4)] bg-gradient-to-br from-[#0f1430] via-[#1a2238] to-[#2a1f4d] p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="glow-orb top-[-40px] left-[-40px] h-32 w-32 bg-[var(--primary)]" />
        <div className="glow-orb bottom-[-40px] right-[-40px] h-32 w-32 bg-[var(--accent)]" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <img src="/images/avm-logo.svg" alt="AVM Smart Solutions" className="h-14 w-14" />
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">AVM Smart Solutions</p>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">
            Certificate of Completion
          </h3>
          <p className="text-sm text-white/70">This certifies that</p>
          <p className="font-heading text-2xl md:text-3xl font-bold text-gradient">
            {cert.studentName}
          </p>
          <p className="text-sm text-white/70">has successfully completed</p>
          <p className="font-heading text-xl md:text-2xl font-semibold text-white">
            {cert.courseTitle}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-8 w-full max-w-sm text-left">
            <div>
              <div className="border-t border-white/30 pt-1">
                <p className="text-[10px] uppercase tracking-wide text-white/50">Issue Date</p>
                <p className="text-sm text-white flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(cert.issueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <div>
              <div className="border-t border-white/30 pt-1">
                <p className="text-[10px] uppercase tracking-wide text-white/50">Certificate ID</p>
                <p className="text-sm text-white break-all font-mono">{cert.certificateId}</p>
              </div>
            </div>
          </div>
          <div className="mt-2 w-full max-w-sm">
            <div className="border-t border-white/30 pt-1 text-left">
              <p className="text-[10px] uppercase tracking-wide text-white/50">Authorized by</p>
              <p className="text-sm text-white flex items-center gap-1.5">
                <User size={12} /> AVM Smart Solutions
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <AVMButton
          variant="outline"
          size="md"
          onClick={() => {
            toast.success("Download started", "Certificate PDF is being prepared.");
          }}
          icon={<Download size={15} />}
        >
          Download PDF
        </AVMButton>
        <AVMButton size="md" onClick={onCopy} icon={<Copy size={15} />}>
          Copy Verify Link
        </AVMButton>
      </div>
    </div>
  );
}
