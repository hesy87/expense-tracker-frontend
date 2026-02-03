import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HistoryComponent } from './components/history/history.component';
import { InsightsComponent } from './components/insights/insights.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import type { Session } from '@supabase/supabase-js';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AuthComponent,
    DashboardComponent,
    HistoryComponent,
    InsightsComponent,
    SettingsComponent,
    AddExpenseComponent,
    NavigationComponent,
    MatSnackBarModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentTab = 'dashboard';
  isAddOpen = false;
  session$: Observable<Session | null>;
  loading$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.session$ = this.authService.session$;
    this.loading$ = this.authService.loading$;
  }

  ngOnInit() {
    void this.authService.init();
  }

  setTab(tab: string) {
    this.currentTab = tab;
  }

  openAdd() {
    this.isAddOpen = true;
  }

  closeAdd() {
    this.isAddOpen = false;
  }
}
