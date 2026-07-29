"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { DEFAULT_CATEGORIES, type Expense } from "@/types";

export default function ExpenseModal({
  userId,
  expense,
  onClose,
}: {
  userId: string;
  expense?: Expense;
  onClose: () => void;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    date: expense?.date ?? new Date().toISOString().slice(0, 10),
    category: expense?.category ?? "Uncategorized",
    description: expense?.description ?? "",
    amount: expense?.amount?.toString() ?? "",
    payment_method: expense?.payment_method ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      user_id: userId,
      date: form.date,
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      payment_method: form.payment_method || null,
    };

    const { error } = expense
      ? await supabase.from("expenses").update(payload).eq("id", expense.id)
      : await supabase.from("expenses").insert(payload);

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
    onClose();
  }

  async function handleDelete() {
    if (!expense) return;
    setLoading(true);
    const { error } = await supabase.from("expenses").delete().eq("id", expense.id);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-text">
          <X size={18} />
        </button>
        <h2 className="font-semibold mb-4">{expense ? "Edit expense" : "Add expense"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted">Date</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Description</label>
            <input
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input w-full mt-1"
              placeholder="e.g. Groceries"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input w-full mt-1"
              >
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="input w-full mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted">Payment method</label>
            <input
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              className="input w-full mt-1"
              placeholder="Cash, Card, UPI..."
            />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex items-center gap-2 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {expense ? "Save changes" : "Add expense"}
            </button>
            {expense && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="btn-ghost text-danger border-danger/30"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
