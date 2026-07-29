"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Budget } from "@/types";

export default function SettingsClient({
  userId,
  email,
  budgets,
  categories,
}: {
  userId: string;
  email: string;
  budgets: Budget[];
  categories: string[];
}) {
  const supabase = createClient();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const overall = budgets.find((b) => b.category === "Overall")?.monthly_budget ?? 0;
  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = { Overall: overall ? String(overall) : "" };
    for (const c of categories) {
      map[c] = budgets.find((b) => b.category === c)?.monthly_budget?.toString() ?? "";
    }
    return map;
  });

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const rows = Object.entries(values)
      .filter(([, v]) => v !== "")
      .map(([category, v]) => ({
        user_id: userId,
        category,
        monthly_budget: parseFloat(v),
      }));

    if (rows.length > 0) {
      await supabase.from("budgets").upsert(rows, { onConflict: "user_id,category" });
    }

    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-medium mb-1">Account</h3>
        <p className="text-sm text-muted">{email}</p>
      </div>

      <div className="card p-6">
        <h3 className="font-medium mb-4">Overall monthly budget</h3>
        <input
          type="number"
          className="input w-full"
          placeholder="e.g. 15000"
          value={values.Overall}
          onChange={(e) => setValues({ ...values, Overall: e.target.value })}
        />
      </div>

      <div className="card p-6">
        <h3 className="font-medium mb-4">Per-category budgets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories
            .filter((c) => c !== "Uncategorized")
            .map((c) => (
              <div key={c}>
                <label className="text-xs text-muted">{c}</label>
                <input
                  type="number"
                  className="input w-full mt-1"
                  placeholder="0"
                  value={values[c]}
                  onChange={(e) => setValues({ ...values, [c]: e.target.value })}
                />
              </div>
            ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save budgets"}
      </button>
    </div>
  );
}
