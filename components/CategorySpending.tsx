"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function CategorySpending({
  data,
}: {
  data: { category: string; amount: number }[];
}) {
  return (
    <div className="card p-6">
      <h3 className="font-medium text-sm mb-4">Category spending</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              dataKey="category"
              type="category"
              width={90}
              tick={{ fill: "#E2E8F0", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 8 }}
              labelStyle={{ color: "#E2E8F0" }}
              formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Spent"]}
            />
            <Bar dataKey="amount" fill="#3B82F6" radius={[0, 8, 8, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
