import { Component, OnInit, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { formatCurrency } from '../../utils/format';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnInit {
  private expenseService = inject(ExpenseService);

  expenses: Expense[] = [];
  categoryTotals: Record<string, number> = {};

  ngOnInit() {
    this.expenseService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;
      this.buildTotals();
    });
  }

  formatCurrency = formatCurrency;

  get hasCoffee() {
    return this.expenses.some((expense) => expense.category === 'Coffee');
  }

  get hasFuel() {
    return this.expenses.some((expense) => expense.category === 'Fuel');
  }

  get hasGrocery() {
    return this.expenses.some((expense) => expense.category === 'Grocery');
  }

  private buildTotals() {
    const totals: Record<string, number> = {};
    for (const expense of this.expenses) {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    }
    this.categoryTotals = totals;
  }
}
