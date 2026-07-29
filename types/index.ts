export interface Expense {
  id: string;
  user_id: string;
  date: string; // ISO yyyy-mm-dd
  category: string;
  description: string;
  amount: number;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

export type NewExpense = Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">;

export interface Budget {
  id: string;
  user_id: string;
  category: string; // 'Overall' for the total monthly budget
  monthly_budget: number;
  created_at: string;
  updated_at: string;
}

export interface ParsedExpenseRow {
  date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: string | null;
  valid: boolean;
  error?: string;
}

export const DEFAULT_CATEGORIES = [
  "Housing",
  "Car",
  "Food",
  "Utilities",
  "Bike",
  "Medical",
  "Saloon",
  "Debt",
  "Education",
  "Entertainment",
  "Uncategorized",
];
