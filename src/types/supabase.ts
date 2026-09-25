export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export interface SyncStatus {
  inProgress: boolean;
  lastSyncTime?: string;
  error?: string | null;
  syncedTables: string[];
}
