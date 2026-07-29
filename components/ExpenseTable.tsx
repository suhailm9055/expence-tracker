"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { Expense } from "@/types";
import ExpenseModal from "./ExpenseModal";

export default function ExpenseTable({
  userId,
  expenses,
}: {
  userId: string;
  expenses: Expense[];
}) {
  const [editing, setEditing] = useState<Expense | null>(null);

  return (
    <div className="card p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted text-xs uppercase tracking-wide">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Description</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Payment</th>
              <th className="pb-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted">
                  No expenses match these filters.
                </td>
              </tr>
            )}
            {expenses.map((e) => (
              <tr
                key={e.id}
                onClick={() => setEditing(e)}
                className="border-t border-border cursor-pointer hover:bg-white/5"
              >
                <td className="py-3 text-muted">{format(new Date(e.date), "MMM d, yyyy")}</td>
                <td className="py-3">{e.description || "—"}</td>
                <td className="py-3">
                  <span className="text-xs bg-primary/10 text-primary rounded-lg px-2 py-1">
                    {e.category}
                  </span>
                </td>
                <td className="py-3 text-muted">{e.payment_method || "—"}</td>
                <td className="py-3 text-right font-medium">
                  ₹{Number(e.amount).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ExpenseModal userId={userId} expense={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
