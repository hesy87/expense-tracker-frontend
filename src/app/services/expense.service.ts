import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from './api.service';
import { SupabaseService } from './supabase.service';
import { Expense } from '../models/expense';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private api = inject(ApiService);
  private supabaseService = inject(SupabaseService);
  private snackBar = inject(MatSnackBar);

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(true);

  expenses$ = this.expensesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor() {
    const authService = inject(AuthService);

    authService.session$.subscribe((session) => {
      if (session) {
        void this.refreshExpenses();
      } else {
        this.expensesSubject.next([]);
        this.loadingSubject.next(false);
      }
    });
  }

  async refreshExpenses() {
    try {
      const { data } = await this.supabaseService.client.auth.getSession();
      const session = data.session;
      if (!session) return;

      const res: any = await this.api.getExpenses(session.access_token);
      if (res?.data) {
        const sorted = res.data.sort((a: Expense, b: Expense) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.expensesSubject.next(sorted);
      }
    } catch (error) {
      this.snackBar.open('Failed to load expenses', 'Close', { duration: 3000 });
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async addExpense(expense: Partial<Expense>) {
    try {
      const { data } = await this.supabaseService.client.auth.getSession();
      const session = data.session;
      if (!session) throw new Error('Not authenticated');

      const res: any = await this.api.addExpense(session.access_token, expense);
      if (res?.error) throw new Error(res.error);

      await this.refreshExpenses();
      this.snackBar.open('Expense added', 'Close', { duration: 2000 });
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Failed to add expense', 'Close', { duration: 3000 });
      throw error;
    }
  }

  async deleteExpense(id: string) {
    try {
      const { data } = await this.supabaseService.client.auth.getSession();
      const session = data.session;
      if (!session) throw new Error('Not authenticated');

      const res: any = await this.api.deleteExpense(session.access_token, id);
      if (res?.error) throw new Error(res.error);

      await this.refreshExpenses();
      this.snackBar.open('Expense deleted', 'Close', { duration: 2000 });
    } catch (error: any) {
      this.snackBar.open(error?.message || 'Failed to delete expense', 'Close', { duration: 3000 });
    }
  }
}
