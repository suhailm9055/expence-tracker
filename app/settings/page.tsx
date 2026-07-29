import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import SettingsClient from "./SettingsClient";
import { DEFAULT_CATEGORIES } from "@/types";
import FloatingAddExpense from "@/components/FloatingAddExpense";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: budgets } = await supabase.from("budgets").select("*");

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar title="Settings" crumbs={["Dashboard", "Settings"]} email={user?.email} />
        <main className="p-6 md:p-8 space-y-6 max-w-2xl">
          <SettingsClient
            userId={user!.id}
            email={user?.email ?? ""}
            budgets={budgets ?? []}
            categories={DEFAULT_CATEGORIES}
          />
        </main>
        {user && <FloatingAddExpense userId={user.id} />}
      </div>
    </div>
  );
}
