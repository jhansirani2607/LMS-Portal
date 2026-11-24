"use client";

import * as React from "react";
import {
  Settings as SettingsIcon,
  Save,
  Mail,
  Globe,
  Bell,
  Shield,
  LogOut,
  Building2,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { FormField } from "@/components/site/FormField";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { avmCompanyInfo } from "@/lib/data";

interface AdminSettingsProps {
  onLogout: () => void;
}

export function AdminSettings({ onLogout }: AdminSettingsProps) {
  const toast = useAVMToast();
  const [general, setGeneral] = React.useState({
    siteName: "AVM Smart Solutions",
    tagline: avmCompanyInfo.tagline,
    supportEmail: avmCompanyInfo.email,
    primaryPhone: avmCompanyInfo.phones[0],
    timezone: "Asia/Kolkata (IST)",
  });
  const [emailConfig, setEmailConfig] = React.useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    fromEmail: avmCompanyInfo.email,
    fromName: "AVM Smart Solutions",
  });
  const [notifEmails, setNotifEmails] = React.useState(true);
  const [notifApps, setNotifApps] = React.useState(true);
  const [notifCerts, setNotifCerts] = React.useState(false);
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  const saveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("General settings saved", "Your changes are now live.");
  };
  const saveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Email config saved", "SMTP settings updated.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Settings
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Manage site-wide configuration and admin account.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General settings */}
        <Reveal>
          <form
            onSubmit={saveGeneral}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6 space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                General
              </h3>
            </div>
            <FormField id="s-name" label="Site Name" value={general.siteName} onChange={(v) => setGeneral({ ...general, siteName: v })} />
            <FormField id="s-tagline" label="Tagline" value={general.tagline} onChange={(v) => setGeneral({ ...general, tagline: v })} />
            <FormField id="s-email" label="Support Email" inputType="email" value={general.supportEmail} onChange={(v) => setGeneral({ ...general, supportEmail: v })} />
            <FormField id="s-phone" label="Primary Phone" value={general.primaryPhone} onChange={(v) => setGeneral({ ...general, primaryPhone: v })} />
            <FormField
              id="s-tz"
              label="Timezone"
              type="select"
              value={general.timezone}
              onChange={(v) => setGeneral({ ...general, timezone: v })}
              options={[
                { value: "Asia/Kolkata (IST)", label: "Asia/Kolkata (IST)" },
                { value: "America/New_York (EST)", label: "America/New_York (EST)" },
                { value: "Europe/London (GMT)", label: "Europe/London (GMT)" },
                { value: "Asia/Singapore (SGT)", label: "Asia/Singapore (SGT)" },
              ]}
            />
            <div className="flex justify-end pt-2">
              <AVMButton type="submit" icon={<Save size={15} />}>
                Save General
              </AVMButton>
            </div>
          </form>
        </Reveal>

        {/* Email config */}
        <Reveal delay={100}>
          <form
            onSubmit={saveEmail}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6 space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Mail size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Email Configuration
              </h3>
            </div>
            <FormField id="s-smtp" label="SMTP Host" value={emailConfig.smtpHost} onChange={(v) => setEmailConfig({ ...emailConfig, smtpHost: v })} />
            <FormField id="s-port" label="SMTP Port" inputType="number" value={emailConfig.smtpPort} onChange={(v) => setEmailConfig({ ...emailConfig, smtpPort: v })} />
            <FormField id="s-from" label="From Email" inputType="email" value={emailConfig.fromEmail} onChange={(v) => setEmailConfig({ ...emailConfig, fromEmail: v })} />
            <FormField id="s-fromname" label="From Name" value={emailConfig.fromName} onChange={(v) => setEmailConfig({ ...emailConfig, fromName: v })} />
            <div className="flex justify-end pt-2">
              <AVMButton type="submit" icon={<Save size={15} />}>
                Save Email Config
              </AVMButton>
            </div>
          </form>
        </Reveal>
      </div>

      {/* Notifications + toggles */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-[var(--primary)]" />
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
              Notifications
            </h3>
          </div>
          <div className="space-y-1">
            <ToggleRow
              label="Email notifications"
              description="Receive an email when a new application is submitted."
              checked={notifEmails}
              onChange={setNotifEmails}
            />
            <ToggleRow
              label="Application alerts"
              description="In-app alerts for pending applications."
              checked={notifApps}
              onChange={setNotifApps}
            />
            <ToggleRow
              label="Certificate issuance notifications"
              description="Notify mentors when a certificate is generated for their student."
              checked={notifCerts}
              onChange={setNotifCerts}
            />
            <ToggleRow
              label="Maintenance mode"
              description="Temporarily disable public access to the site (admins still allowed)."
              checked={maintenanceMode}
              onChange={setMaintenanceMode}
            />
          </div>
        </div>
      </Reveal>

      {/* Account */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-[var(--primary)]" />
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
              Admin Account
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <FormField id="a-name" label="Admin Name" value="Administrator" onChange={() => {}} />
            <FormField id="a-email" label="Admin Email" inputType="email" value="admin@avmsmart.in" onChange={() => {}} />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-3">
            Account profile changes are not persisted in this demo environment.
          </p>
        </div>
      </Reveal>

      {/* Danger zone */}
      <Reveal>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold text-red-300">
                Danger Zone
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Logging out clears your admin session on this device.
              </p>
            </div>
            <AVMButton
              variant="outline"
              size="md"
              onClick={onLogout}
              icon={<LogOut size={15} />}
              className="border-red-500/40 text-red-300 hover:bg-red-500/10"
            >
              Logout
            </AVMButton>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[var(--border)] last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        <p className="text-xs text-[var(--text-secondary)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={
          "relative h-6 w-11 shrink-0 rounded-full transition-colors " +
          (checked ? "bg-gradient-primary" : "bg-[var(--bg-elevated)]")
        }
      >
        <span
          className={
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform " +
            (checked ? "translate-x-5" : "")
          }
        />
      </button>
    </div>
  );
}
