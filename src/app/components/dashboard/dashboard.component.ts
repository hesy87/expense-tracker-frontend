import { Component, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense';
import { formatCurrency, formatDate } from '../../utils/format';

interface ChartPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  loading = true;
  totalSpent = 0;
  savings = 18.5;
  dailyData: { date: string; amount: number }[] = [];
  chartPath = '';
  chartAreaPath = '';

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.expenseService.loading$.subscribe((loading) => (this.loading = loading));
    this.expenseService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;
      this.updateStats();
    });
  }

  formatCurrency = formatCurrency;
  formatDate = formatDate;

  private updateStats() {
    const currentMonth = new Date().getMonth();
    const thisMonthExpenses = this.expenses.filter((e) => new Date(e.date).getMonth() === currentMonth);
    this.totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const dailyMap: Record<string, number> = {};
    for (const expense of thisMonthExpenses) {
      const dateLabel = formatDate(expense.date);
      dailyMap[dateLabel] = (dailyMap[dateLabel] || 0) + expense.amount;
    }

    this.dailyData = Object.keys(dailyMap)
      .map((date) => ({ date, amount: dailyMap[date] }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (this.dailyData.length === 0) {
      this.dailyData = [{ date: 'Start', amount: 0 }];
    }

    this.buildChartPaths();
  }

  private buildChartPaths() {
    const width = 320;
    const height = 140;
    const padding = 10;
    const max = Math.max(...this.dailyData.map((d) => d.amount), 1);
    const step = this.dailyData.length > 1 ? (width - padding * 2) / (this.dailyData.length - 1) : 0;

    const points: ChartPoint[] = this.dailyData.map((d, index) => {
      const x = padding + step * index;
      const y = height - padding - (d.amount / max) * (height - padding * 2);
      return { x, y };
    });

    if (!points.length) {
      this.chartPath = '';
      this.chartAreaPath = '';
      return;
    }

    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    this.chartPath = linePath;
    this.chartAreaPath = areaPath;
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
