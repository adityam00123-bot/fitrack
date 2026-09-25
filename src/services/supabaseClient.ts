import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types/supabase';

const SUPABASE_CONFIG_KEY = 'fitrack_supabase_config';

export class SupabaseManager {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig = {
    url: '',
    anonKey: '',
    isConnected: false
  };

  constructor() {
    this.loadSavedConfig();
  }

  loadSavedConfig(): SupabaseConfig {
    try {
      const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (saved) {
        this.config = JSON.parse(saved);
        if (this.config.url && this.config.anonKey) {
          this.initClient(this.config.url, this.config.anonKey);
        }
      } else {
        const envUrl = import.meta.env.VITE_SUPABASE_URL;
        const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (envUrl && envKey && !envUrl.includes('your-project-id')) {
          this.config = {
            url: envUrl.trim(),
            anonKey: envKey.trim(),
            isConnected: false
          };
          this.initClient(this.config.url, this.config.anonKey);
        }
      }
    } catch {
      // ignore
    }
    return this.config;
  }

  saveConfig(url: string, anonKey: string): void {
    this.config = {
      url: url.trim(),
      anonKey: anonKey.trim(),
      isConnected: false
    };
    if (this.config.url && this.config.anonKey) {
      this.initClient(this.config.url, this.config.anonKey);
    } else {
      this.client = null;
    }
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(this.config));
  }

  private initClient(url: string, key: string) {
    try {
      this.client = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch {
      this.client = null;
    }
  }

  getClient(): SupabaseClient | null {
    return this.client;
  }

  getConfig(): SupabaseConfig {
    return this.config;
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.client || !this.config.url || !this.config.anonKey) {
      return { success: false, message: 'Please provide both Supabase Project URL and Public Anon Key.' };
    }

    try {
      // Test querying a public or auth health check
      const { error } = await this.client.from('exercises').select('id').limit(1);
      if (error && error.code !== 'PGRST116' && !error.message.includes('relation "exercises" does not exist')) {
        // Table might not exist yet if schema isn't run, but auth succeeded!
        if (error.message.includes('API key')) {
          this.config.isConnected = false;
          return { success: false, message: `Auth Error: ${error.message}` };
        }
      }
      this.config.isConnected = true;
      this.config.lastSyncedAt = new Date().toISOString();
      localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(this.config));
      return { success: true, message: 'Successfully connected to your Supabase project!' };
    } catch (err: unknown) {
      this.config.isConnected = false;
      const msg = err instanceof Error ? err.message : 'Failed to connect to Supabase';
      return { success: false, message: msg };
    }
  }

  disconnect() {
    this.client = null;
    this.config = { url: '', anonKey: '', isConnected: false };
    localStorage.removeItem(SUPABASE_CONFIG_KEY);
  }
}

export const supabaseManager = new SupabaseManager();
