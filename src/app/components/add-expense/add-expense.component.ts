import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExpenseService } from '../../services/expense.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface CategoryItem {
  id: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit, OnDestroy {
  @Output() back = new EventEmitter<void>();
  @Output() complete = new EventEmitter<void>();

  amount = '';
  category = '';
  description = '';
  location = 'Locating...';
  loading = false;
  isLocating = true;
  private locationTimer?: number;

  categories: CategoryItem[] = [
    { id: 'Coffee', icon: '☕', label: 'Coffee' },
    { id: 'Food', icon: '🍔', label: 'Food' },
    { id: 'Grocery', icon: '🛒', label: 'Grocery' },
    { id: 'Transport', icon: '🚕', label: 'Transport' },
    { id: 'Fuel', icon: '⛽', label: 'Fuel' },
    { id: 'Shopping', icon: '🛍️', label: 'Shopping' },
    { id: 'Entertainment', icon: '🎬', label: 'Fun' },
    { id: 'Health', icon: '💊', label: 'Health' },
    { id: 'Other', icon: '📝', label: 'Other' }
  ];

  constructor(private expenseService: ExpenseService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.locationTimer = window.setTimeout(() => {
      this.location = 'Downtown, Berlin';
      this.isLocating = false;
    }, 1500);
  }

  ngOnDestroy() {
    if (this.locationTimer) {
      window.clearTimeout(this.locationTimer);
    }
  }

  async submit() {
    if (!this.amount || !this.category) {
      this.snackBar.open('Please enter amount and category', 'Close', { duration: 2500 });
      return;
    }

    this.loading = true;
    try {
      await this.expenseService.addExpense({
        amount: parseFloat(this.amount),
        category: this.category,
        description: this.description,
        location: this.location,
        date: new Date().toISOString()
      });
      this.complete.emit();
    } finally {
      this.loading = false;
    }
  }
}
