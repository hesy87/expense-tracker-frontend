export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  location?: string;
  createdAt: string;
}
