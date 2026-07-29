"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#3B82F6", "#60A5FA", "#93C5FD", "#1D4ED8", "#1E3A8A", "#38BDF8"];

export default function BudgetBreakdown({
  data,
  total,
}: {
  data: { category: string; amount: number }[];
  total: number;
}) {
  return (
    <div className="card p-6">
      <h3 className="font-medium text-sm mb-4">Budget breakdown</h3>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8 }}
              formatter={(v: number, n: string) => [`₹${v.toLocaleString("en-IN")}`, n]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-semibold">₹{total.toLocaleString("en-IN")}</span>
          <span className="text-xs text-muted">Total spent</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((d, i) => (
          <div key={d.category} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-muted">{d.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
