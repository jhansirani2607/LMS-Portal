"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  ClipboardList,
  FileText,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavigateFn, Page } from "@/lib/navigation";

interface AdminLayoutProps {
  activePage: Page;
  onNavigate: NavigateFn;
  onLogout: () => void;
  children: React.ReactNode;
}

interface NavEntry {
  label: string;
  page: Page;
  icon: React.ElementType;
}

const NAV_ITEMS: NavEntry[] = [
  { label: "Dashboard", page: "admin-dashboard", icon: LayoutDashboard },
  { label: "Students", page: "admin-students", icon: Users },
  { label: "Internships", page: "admin-internships", icon: Briefcase },
  { label: "Courses", page: "admin-courses", icon: BookOpen },
  { label: "Mentors", page: "admin-mentors", icon: ClipboardList },
  { label: "Applications", page: "admin-applications", icon: FileText },
  { label: "Certificates", page: "admin-certificates", icon: Award },
  { label: "Reports", page: "admin-reports", icon: BarChart3 },
  { label: "Settings", page: "admin-settings", icon: Settings },
];

const PAGE_TITLES: Partial<Record<Page, string>> = {
  "admin-dashboard": "Dashboard",
  "admin-students": "Students",
  "admin-internships": "Internships",
  "admin-courses": "Courses",
  "admin-mentors": "Mentors",
  "admin-applications": "Applications",
  "admin-certificates": "Certificates",
  "admin-reports": "Reports",
  "admin-settings": "Settings",
};

export function AdminLayout({
  activePage,
  onNavigate,
  onLogout,
  children,
}: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  React.useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = () => setUserMenuOpen(false);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [userMenuOpen]);

  const go = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const pageTitle = PAGE_TITLES[activePage] ?? "Admin Portal";

  const Sidebar = (
    <div className="flex h-full flex-col">
      <button
        onClick={() => go("admin-dashboard")}
        className="flex items-center gap-2.5 px-5 h-16 border-b border-[var(--border)] shrink-0"
        aria-label="AVM Admin Portal — Dashboard"
      >
        <img src="/images/avm-logo.svg" alt="AVM Smart Solutions" className="h-9 w-9" />
        <div className="flex flex-col text-left">
          <span className="font-heading text-base font-bold leading-tight text-[var(--text-primary)]">
            AVM<span className="text-gradient"> Smart</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Admin Portal
          </span>
        </div>
      </button>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin primary">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          Menu
        </p>
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.page;
            const Icon = item.icon;
            return (
              <li key={item.page}>
                <button
                  onClick={() => go(item.page)}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-white bg-gradient-primary shadow-glow-indigo"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white" />
                  )}
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <div className="px-3 py-2 mb-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(168,85,247,0.4)] bg-[rgba(168,85,247,0.1)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> Administrator
          </span>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <aside className="hidden lg:block w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-surface)] sticky top-0 h-screen">
        {Sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fade-in_200ms_ease]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[260px] bg-[var(--bg-surface)] border-r border-[var(--border)] shadow-2xl animate-[slide-down_250ms_ease]">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-2 top-3 rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.15)]"
            >
              <X size={20} />
            </button>
            {Sidebar}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-40 h-16 border-b border-[var(--border)] bg-[rgba(10,14,26,0.85)] backdrop-blur-lg flex items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden rounded-lg p-2 text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.12)]"
          >
            <Menu size={22} />
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Admin Portal
            </span>
            <h1 className="font-heading text-base md:text-lg font-semibold text-[var(--text-primary)] truncate">
              {pageTitle}
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.12)]"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen((o) => !o);
                }}
                className="flex items-center gap-2 rounded-lg p-1 sm:pl-2 sm:pr-3 hover:bg-[rgba(99,102,241,0.1)]"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                  AD
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                    Administrator
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] leading-tight">
                    admin@avmsmart.in
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={cn(
                    "hidden sm:block text-[var(--text-secondary)] transition-transform",
                    userMenuOpen && "rotate-180"
                  )}
                />
              </button>
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]/95 backdrop-blur-lg p-1.5 shadow-xl animate-[slide-down_180ms_ease]"
                  role="menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Administrator</p>
                    <p className="text-xs text-[var(--text-secondary)] truncate">admin@avmsmart.in</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      go("admin-settings");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)]"
                    role="menuitem"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-red-300 hover:bg-red-500/10"
                    role="menuitem"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
