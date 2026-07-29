import type { Expense } from "@/types";
import { format } from "date-fns";

export default function RecentTransactions({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">Recent transactions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted text-xs uppercase tracking-wide">
              <th className="pb-3 font-medium">Description</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted">
                  No transactions yet. Add one or import your spreadsheet.
                </td>
              </tr>
            )}
            {expenses.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="py-3">{e.description || "—"}</td>
                <td className="py-3">
                  <span className="text-xs bg-primary/10 text-primary rounded-lg px-2 py-1">
                    {e.category}
                  </span>
                </td>
                <td className="py-3 text-muted">{format(new Date(e.date), "MMM d, yyyy")}</td>
                <td className="py-3 text-right font-medium">
                  ₹{Number(e.amount).toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
