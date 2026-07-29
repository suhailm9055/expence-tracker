import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MonthlySpendCard from "@/components/MonthlySpendCard";
import RecentTransactions from "@/components/RecentTransactions";
import CategorySpending from "@/components/CategorySpending";
import SpendingTrend from "@/components/SpendingTrend";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import InsightsPanel from "@/components/InsightsPanel";
import FloatingAddExpense from "@/components/FloatingAddExpense";
import { buildInsights } from "@/lib/insights";
import { format } from "date-fns";
import type { Expense } from "@/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  const { data: budgets } = await supabase.from("budgets").select("*");

  const all: Expense[] = expenses ?? [];
  const overallBudget = budgets?.find((b) => b.category === "Overall")?.monthly_budget ?? 0;

  const monthStr = new Date().toISOString().slice(0, 7);
  const thisMonth = all.filter((e) => e.date?.startsWith(monthStr));
  const totalSpentThisMonth = thisMonth.reduce((s, e) => s + Number(e.amount), 0);

  const byCategory = new Map<string, number>();
  for (const e of thisMonth) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + Number(e.amount));
  }
  const categoryData = Array.from(byCategory.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const byDate = new Map<string, number>();
  for (const e of all.slice(0, 60)) {
    byDate.set(e.date, (byDate.get(e.date) ?? 0) + Number(e.amount));
  }
  const trendData = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, amount]) => ({ date: format(new Date(date), "MMM d"), amount }));

  const insights = buildInsights(all, overallBudget);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <TopBar title="Dashboard" crumbs={["Dashboard", "Overview"]} email={user?.email} />
        <main className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlySpendCard
              spent={totalSpentThisMonth}
              budget={overallBudget}
              month={format(new Date(), "MMM yyyy")}
            />
            <RecentTransactions expenses={all.slice(0, 6)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CategorySpending data={categoryData} />
            </div>
            <InsightsPanel insights={insights} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingTrend data={trendData} />
            <BudgetBreakdown data={categoryData} total={totalSpentThisMonth} />
          </div>
        </main>
        {user && <FloatingAddExpense userId={user.id} />}
      </div>
    </div>
  );
}
