"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  FileBarChart,
  Settings,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavigationLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href.split("?")[0];
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
              active
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted hover:text-text hover:bg-white/5"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-5 left-4 z-40 rounded-lg p-2 text-text hover:bg-white/5 md:hidden"
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <Menu size={21} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 w-full bg-black/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
          />
          <aside className="relative flex h-full w-72 flex-col border-r border-border bg-background px-4 py-6 shadow-2xl">
            <div className="flex items-center justify-between px-2 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Wallet size={18} className="text-primary" />
                </div>
                <span className="font-semibold text-lg">ExpenseTracker</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-muted hover:text-text hover:bg-white/5"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>
            <NavigationLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <div className="mt-6 px-3 text-xs text-muted">Data stored securely per account.</div>
          </aside>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background px-4 py-6 md:flex">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Wallet size={18} className="text-primary" />
          </div>
          <span className="font-semibold text-lg">ExpenseTracker</span>
        </div>

        <NavigationLinks pathname={pathname} />

        <div className="text-xs text-muted px-3">
          Data stored securely per account.
          <br />
          RLS-protected · HTTPS
        </div>
      </aside>
    </>
  );
}
