import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    this.client = createClient(supabaseUrl, publicAnonKey);
  }
}
