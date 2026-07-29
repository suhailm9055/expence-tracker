"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { parseExpenseWorkbook, exportExpensesToWorkbook, exportExpensesToCSV } from "@/lib/excel";
import type { Expense } from "@/types";
import { Upload, Download, FileSpreadsheet } from "lucide-react";

export default function ExcelImportExport({
  userId,
  expenses,
}: {
  userId: string;
  expenses: Expense[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setStatus(null);

    try {
      const buffer = await file.arrayBuffer();
      const rows = parseExpenseWorkbook(buffer);
      const validRows = rows.filter((r) => r.valid);
      const invalidCount = rows.length - validRows.length;

      if (validRows.length === 0) {
        setStatus("No valid rows found. Check the Date/Amount columns.");
        setImporting(false);
        return;
      }

      const payload = validRows.map((r) => ({
        user_id: userId,
        date: r.date,
        category: r.category,
        description: r.description,
        amount: r.amount,
        payment_method: r.payment_method,
      }));

      const { error } = await supabase.from("expenses").insert(payload);
      if (error) throw error;

      setStatus(
        `Imported ${validRows.length} transaction${validRows.length === 1 ? "" : "s"}.` +
          (invalidCount > 0 ? ` Skipped ${invalidCount} row(s) with missing/invalid data.` : "")
      );
      router.refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Import failed.");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card p-4 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted mr-2">
        <FileSpreadsheet size={16} />
        Spreadsheet
      </div>
      <button
        onClick={() => fileRef.current?.click()}
        disabled={importing}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <Upload size={14} />
        {importing ? "Importing..." : "Import Excel"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => downloadBlob(exportExpensesToWorkbook(expenses), "expenses.xlsx")}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <Download size={14} />
        Export .xlsx
      </button>
      <button
        onClick={() => downloadBlob(exportExpensesToCSV(expenses), "expenses.csv")}
        className="btn-ghost flex items-center gap-2 text-sm"
      >
        <Download size={14} />
        Export .csv
      </button>
      {status && <span className="text-xs text-muted w-full">{status}</span>}
    </div>
  );
}
