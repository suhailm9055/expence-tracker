import * as XLSX from "xlsx";
import type { Expense, ParsedExpenseRow } from "@/types";

// Accepts several header spellings so real-world spreadsheets (like the
// user's own "monthy-spend.xlsx") still map onto the expected columns.
const HEADER_ALIASES: Record<string, keyof ParsedExpenseRow> = {
  date: "date",
  category: "category",
  description: "description",
  desc: "description",
  item: "description",
  amount: "amount",
  spent: "amount",
  price: "amount",
  "payment method": "payment_method",
  paymentmethod: "payment_method",
  payment: "payment_method",
  method: "payment_method",
};

function normalizeHeader(h: string) {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

function excelSerialToISODate(value: unknown): string | null {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    // Excel serial date (days since 1899-12-30)
    const parsed = XLSX.SSF?.parse_date_code
      ? XLSX.SSF.parse_date_code(value)
      : null;
    if (parsed) {
      const d = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
      return d.toISOString().slice(0, 10);
    }
  }
  if (typeof value === "string" && value.trim() !== "") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return null;
}

/**
 * Parses a workbook (as an ArrayBuffer) looking for a sheet with
 * Date / Category / Description / Amount / Payment Method columns.
 * Prefers a sheet literally named "Transactions", falls back to the
 * first sheet that has a recognizable header row.
 */
export function parseExpenseWorkbook(buffer: ArrayBuffer): ParsedExpenseRow[] {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

  const preferredOrder = [
    "Transactions",
    ...workbook.SheetNames.filter((n) => n !== "Transactions"),
  ];

  for (const sheetName of preferredOrder) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
      raw: true,
    });
    if (rows.length === 0) continue;

    const firstRow = rows[0];
    const keyMap: Record<string, keyof ParsedExpenseRow> = {};
    for (const rawKey of Object.keys(firstRow)) {
      const mapped = HEADER_ALIASES[normalizeHeader(rawKey)];
      if (mapped) keyMap[rawKey] = mapped;
    }

    // Needs at least a date-ish and amount-ish column to count as the
    // transactions sheet.
    const mappedFields = new Set(Object.values(keyMap));
    if (!mappedFields.has("date") || !mappedFields.has("amount")) continue;

    const parsed: ParsedExpenseRow[] = [];
    for (const row of rows) {
      const out: Partial<ParsedExpenseRow> = {};
      for (const [rawKey, field] of Object.entries(keyMap)) {
        out[field] = row[rawKey] as never;
      }

      // Skip fully blank rows (common in exported templates).
      const allEmpty = Object.values(row).every(
        (v) => v === null || v === undefined || v === ""
      );
      if (allEmpty) continue;

      const isoDate = excelSerialToISODate(out.date as unknown);
      const amountRaw = out.amount as unknown;
      const amount =
        typeof amountRaw === "number"
          ? amountRaw
          : typeof amountRaw === "string"
          ? parseFloat(amountRaw.replace(/[^0-9.-]/g, ""))
          : NaN;

      let error: string | undefined;
      if (!isoDate) error = "Missing or invalid date";
      else if (isNaN(amount) || amount < 0) error = "Missing or invalid amount";

      parsed.push({
        date: isoDate ?? "",
        category: (out.category as string)?.toString().trim() || "Uncategorized",
        description: (out.description as string)?.toString().trim() || "",
        amount: isNaN(amount) ? 0 : amount,
        payment_method: out.payment_method
          ? out.payment_method.toString().trim()
          : null,
        valid: !error,
        error,
      });
    }

    if (parsed.length > 0) return parsed;
  }

  return [];
}

/**
 * Builds an .xlsx file (as a Blob) from expense rows, for the Export feature.
 */
export function exportExpensesToWorkbook(expenses: Expense[]): Blob {
  const data = expenses.map((e) => ({
    Date: e.date,
    Category: e.category,
    Description: e.description,
    Amount: e.amount,
    "Payment Method": e.payment_method ?? "",
  }));

  const sheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Expenses");

  const arrayBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function exportExpensesToCSV(expenses: Expense[]): Blob {
  const header = "Date,Category,Description,Amount,Payment Method";
  const rows = expenses.map((e) =>
    [
      e.date,
      e.category,
      `"${(e.description || "").replace(/"/g, '""')}"`,
      e.amount,
      e.payment_method ?? "",
    ].join(",")
  );
  return new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
}
