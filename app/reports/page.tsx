import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import CategorySpending from "@/components/CategorySpending";
import SpendingTrend from "@/components/SpendingTrend";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import ExcelImportExport from "@/components/ExcelImportExport";
import FloatingAddExpense from "@/components/FloatingAddExpense";
import { format } from "date-fns";
import type { Expense } from "@/types";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("expenses").select("*").order("date", { ascending: true });
  const all: Expense[] = data ?? [];

  const byCategory = new Map<string, number>();
  for (const e of all) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + Number(e.amount));
  }
  const categoryData = Array.from(byCategory.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const byDate = new Map<string, number>();
  for (const e of all) {
    byDate.set(e.date, (byDate.get(e.date) ?? 0) + Number(e.amount));
  }
  const trendData = Array.from(byDate.entries()).map(([date, amount]) => ({
    date: format(new Date(date), "MMM d"),
    amount,
  }));

  const total = all.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar title="Reports" crumbs={["Dashboard", "Reports"]} email={user?.email} />
        <main className="p-6 md:p-8 space-y-6">
          <ExcelImportExport userId={user!.id} expenses={all} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategorySpending data={categoryData} />
            <BudgetBreakdown data={categoryData} total={total} />
          </div>
          <SpendingTrend data={trendData} />
        </main>
        {user && <FloatingAddExpense userId={user.id} />}
      </div>
    </div>
  );
}
