import { Component, OnInit } from '@angular/core';

import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { formatCurrency, formatDate, formatTime } from '../../utils/format';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  expenses: Expense[] = [];
  groupedList: { date: string; items: Expense[] }[] = [];

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenseService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;
      this.groupByDate();
    });
  }

  formatCurrency = formatCurrency;
  formatDate = formatDate;
  formatTime = formatTime;

  deleteExpense(id: string) {
    void this.expenseService.deleteExpense(id);
  }

  private groupByDate() {
    const grouped: { date: string; items: Expense[] }[] = [];
    this.expenses.forEach((expense) => {
      const dateLabel = formatDate(expense.date);
      const lastGroup = grouped[grouped.length - 1];
      if (lastGroup && lastGroup.date === dateLabel) {
        lastGroup.items.push(expense);
      } else {
        grouped.push({ date: dateLabel, items: [expense] });
      }
    });
    this.groupedList = grouped;
  }

  getCategoryIcon(category: string) {
    const map: Record<string, string> = {
      Food: '🍔',
      Transport: '🚕',
      Coffee: '☕',
      Grocery: '🛒',
      Fuel: '⛽',
      Shopping: '🛍️',
      Entertainment: '🎬',
      Health: '💊',
      Other: '📝'
    };
    return map[category] || '📝';
  }
}
