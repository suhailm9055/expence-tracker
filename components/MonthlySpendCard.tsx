"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Tooltip } from "recharts";

export default function MonthlySpendCard({
  spent,
  budget,
  month,
}: {
  spent: number;
  budget: number;
  month: string;
}) {
  const pct = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
  const balance = budget - spent;
  const isOverBudget = balance < 0;
  const data = [{ name: "Spent", value: pct, fill: "url(#spentGradient)" }];

  return (
    <div className="card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm text-text">Monthly spend</h3>
        <span className="text-xs text-muted border border-border rounded-lg px-2 py-1">{month}</span>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="100%"
            data={data}
            startAngle={210}
            endAngle={-30}
          >
            <defs>
              <linearGradient id="spentGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="overBudgetGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
            </defs>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={20}
              background={{ fill: isOverBudget ? "url(#overBudgetGradient)" : "url(#balanceGradient)" }}
            />
            <Tooltip
              cursor={false}
              content={({ active }) =>
                active ? (
                  <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-lg">
                    <p className="text-red-400">Spent: ₹{spent.toLocaleString("en-IN")}</p>
                    <p className={isOverBudget ? "text-danger mt-1" : "text-emerald-400 mt-1"}>
                      {isOverBudget ? "Over budget: " : "Balance: "}₹{Math.abs(balance).toLocaleString("en-IN")}
                    </p>
                  </div>
                ) : null
              }
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-red-400">{pct}%</span>
          <span className="text-xs text-red-400 mt-1">
            Spent ₹{spent.toLocaleString("en-IN")}
          </span>
          <span className={`text-xs mt-1 ${isOverBudget ? "text-danger" : "text-emerald-400"}`}>
            {isOverBudget ? "Over by " : "Balance "}₹{Math.abs(balance).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="mt-2 bg-background rounded-xl border border-border px-4 py-3 grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs text-muted">Budget target</span>
          <span className="text-sm font-medium">₹{budget.toLocaleString("en-IN")}</span>
        </div>
        <div className="text-right">
          <span className="block text-xs text-muted">{isOverBudget ? "Over budget" : "Balance"}</span>
          <span className={`text-sm font-medium ${isOverBudget ? "text-danger" : "text-emerald-400"}`}>
            {isOverBudget ? "-" : ""}₹{Math.abs(balance).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}
