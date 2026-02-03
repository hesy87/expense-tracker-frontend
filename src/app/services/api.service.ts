import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Expense } from '../models/expense';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-138b1373`;

  constructor(private http: HttpClient) {}

  signup(email: string, password: string, name: string) {
    return firstValueFrom(
      this.http.post(`${this.serverUrl}/signup`, { email, password, name }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        }
      })
    );
  }

  getExpenses(token: string) {
    return firstValueFrom(
      this.http.get<{ data?: Expense[] }>(`${this.serverUrl}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    );
  }

  addExpense(token: string, expense: Partial<Expense>) {
    return firstValueFrom(
      this.http.post(`${this.serverUrl}/expenses`, expense, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    );
  }

  deleteExpense(token: string, id: string) {
    return firstValueFrom(
      this.http.post(`${this.serverUrl}/expenses/delete`, { id }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    );
  }
}
