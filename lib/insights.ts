import type { Expense } from "@/types";
import { differenceInCalendarDays, getDaysInMonth, endOfMonth } from "date-fns";

export interface Insight {
  id: string;
  tone: "info" | "warning" | "danger" | "success";
  message: string;
}

export function buildInsights(
  expenses: Expense[],
  monthlyBudget: number,
  today: Date = new Date()
): Insight[] {
  const insights: Insight[] = [];
  const monthStr = today.toISOString().slice(0, 7); // yyyy-mm
  const thisMonthExpenses = expenses.filter((e) => e.date?.startsWith(monthStr));
  const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const pctUsed = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  if (monthlyBudget > 0) {
    if (pctUsed >= 100) {
      insights.push({
        id: "over-budget",
        tone: "danger",
        message: `You've spent ${pctUsed.toFixed(0)}% of your budget — you're over this month's limit.`,
      });
    } else if (pctUsed >= 80) {
      insights.push({
        id: "near-budget",
        tone: "warning",
        message: `You've spent ${pctUsed.toFixed(0)}% of your budget this month.`,
      });
    } else {
      insights.push({
        id: "on-track",
        tone: "success",
        message: `You've used ${pctUsed.toFixed(0)}% of your monthly budget — on track so far.`,
      });
    }

    const daysInMonth = getDaysInMonth(today);
    const daysLeft = Math.max(
      differenceInCalendarDays(endOfMonth(today), today),
      1
    );
    const remaining = Math.max(monthlyBudget - totalSpent, 0);
    const safeDailySpend = remaining / daysLeft;
    insights.push({
      id: "daily-safe-spend",
      tone: "info",
      message: `Safe to spend about ₹${safeDailySpend.toFixed(0)} per day for the remaining ${daysLeft} day${
        daysLeft === 1 ? "" : "s"
      } of the month.`,
    });
  }

  // Spending-spike detection: compare last 7 days average to the 7 days before that.
  const byDay = new Map<string, number>();
  for (const e of expenses) {
    byDay.set(e.date, (byDay.get(e.date) ?? 0) + Number(e.amount));
  }
  const sortedDays = Array.from(byDay.keys()).sort();
  if (sortedDays.length >= 4) {
    const last7 = sortedDays.slice(-7);
    const prev7 = sortedDays.slice(-14, -7);
    const avg = (days: string[]) =>
      days.length ? days.reduce((s, d) => s + (byDay.get(d) ?? 0), 0) / days.length : 0;
    const recentAvg = avg(last7);
    const priorAvg = avg(prev7);
    if (priorAvg > 0 && recentAvg > priorAvg * 1.4) {
      insights.push({
        id: "spending-spike",
        tone: "warning",
        message: `Spending spike detected: your recent daily average is ${Math.round(
          ((recentAvg - priorAvg) / priorAvg) * 100
        )}% higher than the prior week.`,
      });
    }
  }

  return insights;
}
