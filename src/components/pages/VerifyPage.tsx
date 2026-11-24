"use client";

import * as React from "react";
import { ShieldCheck, Search, Award, Calendar, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { AVMButton } from "@/components/site/AVMButton";
import { verifyCertificate, verifiableCertificates } from "@/lib/data";
import type { VerifiableCertificate } from "@/lib/data";

export function VerifyPage() {
  const [certId, setCertId] = React.useState("");
  const [result, setResult] = React.useState<
    | { status: "idle" }
    | { status: "found"; cert: VerifiableCertificate }
    | { status: "not-found" }
  >({ status: "idle" });
  const [searched, setSearched] = React.useState(false);

  const sampleId = verifiableCertificates[0]?.certificateId ?? "AVM-CERT-2024-001";

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const id = certId.trim();
    if (!id) return;
    const cert = verifyCertificate(id);
    setSearched(true);
    if (cert) {
      setResult({ status: "found", cert });
    } else {
      setResult({ status: "not-found" });
    }
  };

  const trySample = () => {
    setCertId(sampleId);
    const cert = verifyCertificate(sampleId);
    setSearched(true);
    if (cert) {
      setResult({ status: "found", cert });
    } else {
      setResult({ status: "not-found" });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Verify"
        title="Verify a Certificate"
        subtitle="Enter an AVM Smart Solutions certificate ID to confirm its authenticity. Anyone — students, recruiters, employers — can verify a certificate here, no login required."
      />

      <section className="px-4 sm:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <form
              onSubmit={handleVerify}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-[var(--primary)]" />
                <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  Certificate Verification
                </h2>
              </div>
              <label htmlFor="certId" className="text-sm font-medium text-[var(--text-primary)]">
                Certificate ID
              </label>
              <div className="mt-1.5 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  />
                  <input
                    id="certId"
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="e.g. AVM-CERT-2024-001"
                    className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-3 text-sm font-mono text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors uppercase"
                  />
                </div>
                <AVMButton type="submit" size="md" icon={<Search size={16} />}>
                  Verify
                </AVMButton>
              </div>
              <p className="mt-3 text-xs text-[var(--text-secondary)]">
                Hint: try sample ID{" "}
                <button
                  type="button"
                  onClick={trySample}
                  className="font-mono font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] underline underline-offset-2"
                >
                  {sampleId}
                </button>
              </p>
            </form>
          </Reveal>

          {/* Result */}
          {searched && (
            <Reveal>
              <div className="mt-6">
                {result.status === "found" && result.cert ? (
                  <div className="space-y-4">
                    {/* Status banner */}
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3">
                      <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-300">Certificate is valid</p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          This certificate was issued by AVM Smart Solutions and is currently active.
                        </p>
                      </div>
                    </div>

                    {/* Certificate card */}
                    <div className="relative overflow-hidden rounded-2xl border-2 border-[rgba(99,102,241,0.4)] bg-gradient-to-br from-[#0f1430] via-[#1a2238] to-[#2a1f4d] p-8 md:p-10 text-center">
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
                        <p className="text-sm text-white/70">This certifies that</p>
                        <p className="font-heading text-2xl md:text-3xl font-bold text-gradient">
                          {result.cert.studentName}
                        </p>
                        <p className="text-sm text-white/70">has successfully completed</p>
                        <p className="font-heading text-xl md:text-2xl font-semibold text-white">
                          {result.cert.courseTitle}
                        </p>

                        <div className="mt-4 grid grid-cols-2 gap-8 w-full max-w-sm text-left">
                          <div>
                            <div className="border-t border-white/30 pt-1">
                              <p className="text-[10px] uppercase tracking-wide text-white/50">Issue Date</p>
                              <p className="text-sm text-white flex items-center gap-1.5">
                                <Calendar size={12} />
                                {new Date(result.cert.issueDate).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div>
                            <div className="border-t border-white/30 pt-1">
                              <p className="text-[10px] uppercase tracking-wide text-white/50">Certificate ID</p>
                              <p className="text-sm text-white break-all font-mono">{result.cert.certificateId}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 w-full max-w-sm">
                          <div className="border-t border-white/30 pt-1 text-left">
                            <p className="text-[10px] uppercase tracking-wide text-white/50">Authorized by</p>
                            <p className="text-sm text-white flex items-center gap-1.5">
                              <User size={12} /> {result.cert.issuedBy}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                          <Award size={12} /> Status: {result.cert.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 flex items-start gap-3">
                    <AlertCircle size={22} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">Certificate not found</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        We couldn&apos;t find a certificate with ID{" "}
                        <span className="font-mono font-semibold text-[var(--text-primary)]">
                          {certId || "(empty)"}
                        </span>
                        . Please double-check the ID and try again. If you believe this is an error, contact us at{" "}
                        <a
                          href="mailto:avmsmart.official@gmail.com"
                          className="text-[var(--primary)] hover:underline"
                        >
                          avmsmart.official@gmail.com
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {/* Info note */}
          <Reveal>
            <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 text-sm text-[var(--text-secondary)] leading-relaxed">
              <p>
                Every AVM Smart Solutions certificate issued after an internship
                or course completion carries a unique verifiable ID. Recruiters
                and employers can use this public page to validate a candidate&apos;s
                certificate instantly — no account needed.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
