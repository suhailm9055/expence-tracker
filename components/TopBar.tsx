"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function TopBar({
  title,
  crumbs,
  email,
}: {
  title: string;
  crumbs?: string[];
  email?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between px-4 pl-16 md:px-8 py-5 border-b border-border">
      <div>
        <div className="text-xs text-muted">{(crumbs ?? ["Dashboard"]).join(" \u203a ")}</div>
        <h1 className="text-lg font-semibold mt-0.5">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {email && <span className="text-sm text-muted hidden sm:inline">{email}</span>}
        <button
          onClick={handleSignOut}
          className="btn-ghost flex items-center gap-2 text-sm py-1.5"
          title="Sign out"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </header>
  );
}
