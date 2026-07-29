"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/types";

export default function QuickAddExpense({ userId }: { userId: string }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      setError("Enter a valid amount.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("expenses").insert({
      user_id: userId,
      date,
      description,
      amount: parsedAmount,
      category,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDescription("");
    setAmount("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-muted">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input w-full mt-1"
          >
            {DEFAULT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted">Description</label>
          <input
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Groceries"
            className="input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-muted">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input w-full mt-1"
          />
        </div>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary flex items-center gap-1.5">
        <Plus size={16} />
        {loading ? "Adding..." : "Add expense"}
      </button>
    </form>
  );
}
