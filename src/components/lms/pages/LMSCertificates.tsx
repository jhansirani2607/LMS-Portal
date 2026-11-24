"use client";

import * as React from "react";
import { Award, Download, Calendar, Search, ArrowRight, Plus } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { lmsCertificates } from "@/lib/data";
import type { LMSCertificate } from "@/lib/data";
import type { NavigateFn } from "@/lib/navigation";

interface LMSCertificatesProps {
  onNavigate: NavigateFn;
  user?: import("@/lib/data").LMSUser;
}

export function LMSCertificates({ onNavigate, user }: LMSCertificatesProps) {
  const toast = useAVMToast();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const studentName = user?.name || "Aarav Sharma";

  const active = lmsCertificates.find((c) => c.id === activeId) ?? null;

  const download = (cert: LMSCertificate) => {
    toast.success(
      "Certificate download started",
      `Certificate ${cert.certificateId} is being prepared.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <Award size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Certificates
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Certificates you&apos;ve earned by completing courses.
            </p>
          </div>
        </div>
      </Reveal>

      {lmsCertificates.length === 0 ? (
        <Reveal>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[rgba(99,102,241,0.2)] to-[rgba(168,85,247,0.2)] text-[var(--primary)]">
              <Award size={32} />
            </div>
            <p className="text-base font-semibold text-[var(--text-primary)]">
              No certificates yet
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm">
              Complete a course to earn your certificate. Certificates are issued
              automatically once you finish all modules and the capstone project.
            </p>
            <AVMButton
              className="mt-4"
              onClick={() => onNavigate("student-courses")}
              iconRight={<ArrowRight size={16} />}
            >
              Browse My Courses
            </AVMButton>
          </div>
        </Reveal>
      ) : (
        <>
          {/* Stats line */}
          <Reveal>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#22c55e] to-[#10b981] text-white">
                <Award size={22} />
              </div>
              <div>
                <p className="font-heading text-xl font-bold text-[var(--text-primary)]">
                  {lmsCertificates.length}{" "}
                  <span className="text-sm font-normal text-[var(--text-secondary)]">
                    {lmsCertificates.length === 1 ? "certificate" : "certificates"} earned
                  </span>
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Keep completing courses to earn more.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lmsCertificates.map((cert, i) => (
              <Reveal key={cert.id} delay={i * 80}>
                <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
                  {/* Banner preview */}
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#1a2238] via-[#2a1f4d] to-[#3d1a52]">
                    <div className="absolute inset-0 bg-grid opacity-20" />
                    <div className="glow-orb top-[-30px] right-[-30px] h-24 w-24 bg-[var(--primary)]" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center gap-1">
                      <Award size={28} className="text-amber-300" />
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                        Certificate of Completion
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                        Course
                      </p>
                      <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] leading-snug">
                        {cert.courseTitle}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[var(--text-secondary)]">Issued</p>
                        <p className="text-[var(--text-primary)] font-medium">
                          {new Date(cert.issueDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--text-secondary)]">ID</p>
                        <p className="text-[var(--text-primary)] font-medium break-all">
                          {cert.certificateId}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto flex gap-2 pt-2">
                      <AVMButton
                        size="sm"
                        variant="outline"
                        fullWidth
                        onClick={() => setActiveId(cert.id)}
                        icon={<Search size={14} />}
                      >
                        View
                      </AVMButton>
                      <AVMButton
                        size="sm"
                        fullWidth
                        onClick={() => download(cert)}
                        icon={<Download size={14} />}
                      >
                        Download
                      </AVMButton>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Tip */}
          <Reveal>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
              <Plus size={16} className="text-[var(--primary)] shrink-0" />
              <p className="text-xs text-[var(--text-secondary)]">
                Complete more courses to add to your certificate collection. Each
                certificate includes a verifiable ID and can be added to your LinkedIn
                profile.
              </p>
            </div>
          </Reveal>
        </>
      )}

      {/* Certificate modal */}
      <Modal
        open={active !== null}
        onClose={() => setActiveId(null)}
        title="Certificate"
        className="max-w-2xl"
      >
        {active && (
          <div className="space-y-4">
            {/* Stylized certificate */}
            <div className="relative overflow-hidden rounded-xl border-2 border-[rgba(99,102,241,0.4)] bg-gradient-to-br from-[#0f1430] via-[#1a2238] to-[#2a1f4d] p-8 md:p-12 text-center">
              <div className="absolute inset-0 bg-grid opacity-10" />
              <div className="glow-orb top-[-40px] left-[-40px] h-32 w-32 bg-[var(--primary)]" />
              <div className="glow-orb bottom-[-40px] right-[-40px] h-32 w-32 bg-[var(--accent)]" />

              <div className="relative z-10 flex flex-col items-center gap-4">
                <img
                  src="/images/avm-logo.svg"
                  alt="AVM Smart Solutions"
                  className="h-14 w-14"
                />
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  AVM Smart Solutions
                </p>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">
                  Certificate of Completion
                </h3>
                <p className="text-sm text-white/70 max-w-md">
                  This certifies that
                </p>
                <p className="font-heading text-2xl md:text-3xl font-bold text-gradient">
                  {studentName}
                </p>
                <p className="text-sm text-white/70 max-w-md">
                  has successfully completed the course
                </p>
                <p className="font-heading text-xl md:text-2xl font-semibold text-white">
                  {active.courseTitle}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-8 w-full max-w-sm text-left">
                  <div>
                    <div className="border-t border-white/30 pt-1">
                      <p className="text-[10px] uppercase tracking-wide text-white/50">
                        Issue Date
                      </p>
                      <p className="text-sm text-white">
                        {new Date(active.issueDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="border-t border-white/30 pt-1">
                      <p className="text-[10px] uppercase tracking-wide text-white/50">
                        Certificate ID
                      </p>
                      <p className="text-sm text-white break-all">
                        {active.certificateId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 w-full max-w-sm">
                  <div className="border-t border-white/30 pt-1 text-left">
                    <p className="text-[10px] uppercase tracking-wide text-white/50">
                      Authorized by
                    </p>
                    <p className="text-sm text-white">AVM Smart Solutions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <AVMButton
                variant="outline"
                onClick={() => setActiveId(null)}
                icon={<Calendar size={15} />}
              >
                Close
              </AVMButton>
              <AVMButton onClick={() => download(active)} icon={<Download size={15} />}>
                Download PDF
              </AVMButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
