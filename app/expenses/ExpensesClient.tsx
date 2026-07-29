"use client";

import { useMemo, useState } from "react";
import type { Expense } from "@/types";
import Filters, { type FilterState } from "@/components/Filters";
import ExpenseTable from "@/components/ExpenseTable";
import ExcelImportExport from "@/components/ExcelImportExport";
import FloatingAddExpense from "@/components/FloatingAddExpense";

export default function ExpensesClient({
  userId,
  expenses,
}: {
  userId: string;
  expenses: Expense[];
}) {
  const [filters, setFilters] = useState<FilterState>({
    from: "",
    to: "",
    category: "",
    paymentMethod: "",
  });
  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filters.from && e.date < filters.from) return false;
      if (filters.to && e.date > filters.to) return false;
      if (filters.category && e.category !== filters.category) return false;
      if (
        filters.paymentMethod &&
        !(e.payment_method ?? "").toLowerCase().includes(filters.paymentMethod.toLowerCase())
      )
        return false;
      return true;
    });
  }, [expenses, filters]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <ExcelImportExport userId={userId} expenses={filtered} />
      </div>

      <Filters value={filters} onChange={setFilters} />

      <ExpenseTable userId={userId} expenses={filtered} />

      <FloatingAddExpense userId={userId} />
    </>
  );
}
