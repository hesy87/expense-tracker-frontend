import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private supabaseService = inject(SupabaseService);
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  private sessionSubject = new BehaviorSubject<Session | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(true);
  private subscription: { unsubscribe: () => void } | null = null;

  session$ = this.sessionSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  async init() {
    const { data } = await this.supabaseService.client.auth.getSession();
    this.sessionSubject.next(data.session ?? null);
    this.loadingSubject.next(false);

    const { data: authData } = this.supabaseService.client.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
      this.sessionSubject.next(session ?? null);
      }
    );

    this.subscription = authData.subscription;
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabaseService.client.auth.signInWithPassword({ email, password });
    if (error) {
      this.snackBar.open(error.message || 'Authentication failed', 'Close', { duration: 3000 });
      throw error;
    }
    this.snackBar.open('Welcome back!', 'Close', { duration: 2000 });
  }

  async signUp(email: string, password: string, name: string) {
    const res: any = await this.api.signup(email, password, name);
    if (res?.error) {
      this.snackBar.open(res.error, 'Close', { duration: 3000 });
      throw new Error(res.error);
    }

    const { error } = await this.supabaseService.client.auth.signInWithPassword({ email, password });
    if (error) {
      this.snackBar.open(error.message || 'Authentication failed', 'Close', { duration: 3000 });
      throw error;
    }
    this.snackBar.open('Account created successfully', 'Close', { duration: 2000 });
  }

  async signOut() {
    await this.supabaseService.client.auth.signOut();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
