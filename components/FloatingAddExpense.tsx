"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ExpenseModal from "@/components/ExpenseModal";

export default function FloatingAddExpense({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-lg shadow-primary/30 transition hover:bg-primaryhover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Add expense"
      >
        <Plus size={19} />
        <span>Add expense</span>
      </button>
      {open && <ExpenseModal userId={userId} onClose={() => setOpen(false)} />}
    </>
  );
}
