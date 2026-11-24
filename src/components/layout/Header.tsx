"use client";

import * as React from "react";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data";
import type { NavigateFn, Role } from "@/lib/navigation";
import { dashboardForRole } from "@/lib/navigation";

interface HeaderProps {
  activePage: import("@/lib/navigation").Page;
  authRole: Role | null;
  onNavigate: NavigateFn;
  onLogout: () => void;
}

export function Header({ activePage, authRole, onNavigate, onLogout }: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const handleNav = (page: import("@/lib/navigation").Page) => {
    onNavigate(page);
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const roleLabel = authRole
    ? authRole.charAt(0).toUpperCase() + authRole.slice(1)
    : "";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[rgba(10,14,26,0.85)] backdrop-blur-lg border-b border-[var(--border)] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex h-16 md:h-18 items-center justify-between gap-4">
            {/* Logo */}
            <button
              onClick={() => handleNav("home")}
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="AVM Smart Solutions home"
            >
              <img
                src="/images/avm-logo.svg"
                alt="AVM Smart Solutions"
                className="h-9 w-9 md:h-10 md:w-10 transition-transform group-hover:scale-105"
              />
              <span className="font-heading text-lg md:text-xl font-bold tracking-tight text-[var(--text-primary)]">
                AVM<span className="text-gradient"> Smart</span>
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              {navItems.map((item) => {
                const active = item.page === activePage;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.page)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <span className="link-underline" data-active={active}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-3">
              {!authRole ? (
                <>
                  <button
                    onClick={() => handleNav("login")}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border border-[rgba(99,102,241,0.45)] text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNav("register")}
                    className="btn-primary-gradient rounded-lg px-5 py-2.5 text-sm font-semibold"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNav(dashboardForRole(authRole))}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border border-[rgba(99,102,241,0.45)] text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)] transition-colors inline-flex items-center gap-2"
                  >
                    <LayoutDashboard size={15} />
                    My Portal
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen((o) => !o);
                      }}
                      className="flex items-center gap-2 rounded-lg p-1 pl-2 pr-3 hover:bg-[rgba(99,102,241,0.1)]"
                      aria-haspopup="menu"
                      aria-expanded={userMenuOpen}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white uppercase">
                        {authRole === "admin" ? "AD" : authRole === "mentor" ? "ME" : "ST"}
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {roleLabel}
                      </span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "text-[var(--text-secondary)] transition-transform",
                          userMenuOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {userMenuOpen && (
                      <div
                        className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]/95 backdrop-blur-lg p-1.5 shadow-xl animate-[slide-down_180ms_ease]"
                        role="menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                          <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {roleLabel} Portal
                          </p>
                        </div>
                        <button
                          onClick={() => handleNav(dashboardForRole(authRole))}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)]"
                          role="menuitem"
                        >
                          <LayoutDashboard size={16} /> Dashboard
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
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden rounded-lg p-2 text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.12)] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fade-in_200ms_ease]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-[var(--bg-surface)] border-l border-[var(--border)] shadow-2xl flex flex-col animate-[slide-down_250ms_ease]">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <img src="/images/avm-logo.svg" alt="AVM" className="h-8 w-8" />
                <span className="font-heading font-bold text-[var(--text-primary)]">
                  AVM<span className="text-gradient"> Smart</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.15)]"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = item.page === activePage;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNav(item.page)}
                        className={cn(
                          "block w-full text-left rounded-lg px-3 py-3 text-base font-medium hover:bg-[rgba(99,102,241,0.1)]",
                          active ? "text-gradient" : "text-[var(--text-primary)]"
                        )}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={() => handleNav("verify")}
                    className={cn(
                      "block w-full text-left rounded-lg px-3 py-3 text-base font-medium hover:bg-[rgba(99,102,241,0.1)]",
                      activePage === "verify" ? "text-gradient" : "text-[var(--text-primary)]"
                    )}
                  >
                    Verify Certificate
                  </button>
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t border-[var(--border)] flex flex-col gap-3">
              {!authRole ? (
                <>
                  <button
                    onClick={() => handleNav("login")}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold border border-[rgba(99,102,241,0.45)] text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)] transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNav("register")}
                    className="btn-primary-gradient w-full rounded-xl px-5 py-3 text-sm font-semibold"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNav(dashboardForRole(authRole))}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold border border-[rgba(99,102,241,0.45)] text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)] transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <User size={15} />
                    My Portal ({roleLabel})
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
