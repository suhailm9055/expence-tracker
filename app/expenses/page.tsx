import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import ExpensesClient from "./ExpensesClient";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar title="Expenses" crumbs={["Dashboard", "Expenses"]} email={user?.email} />
        <main className="p-6 md:p-8 space-y-6">
          <ExpensesClient userId={user!.id} expenses={expenses ?? []} />
        </main>
      </div>
    </div>
  );
}
