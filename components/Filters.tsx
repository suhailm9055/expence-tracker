"use client";

import { DEFAULT_CATEGORIES } from "@/types";

export interface FilterState {
  from: string;
  to: string;
  category: string;
  paymentMethod: string;
}

export default function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (v: FilterState) => void;
}) {
  return (
    <div className="card p-4 flex flex-wrap gap-3 items-end">
      <div>
        <label className="text-xs text-muted">From</label>
        <input
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-muted">To</label>
        <input
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-muted">Category</label>
        <select
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
          className="input mt-1"
        >
          <option value="">All categories</option>
          {DEFAULT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs text-muted">Payment method</label>
        <input
          value={value.paymentMethod}
          onChange={(e) => onChange({ ...value, paymentMethod: e.target.value })}
          placeholder="Any"
          className="input mt-1"
        />
      </div>
      <button
        onClick={() => onChange({ from: "", to: "", category: "", paymentMethod: "" })}
        className="btn-ghost text-sm"
      >
        Clear filters
      </button>
    </div>
  );
}
