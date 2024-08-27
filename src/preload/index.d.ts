import type { QueryExecResult } from 'sql.js';

export interface ElectronAPI {
  runQuery: (query: string, params?: any[]) => Promise<QueryExecResult[]>;
  saveDatabase: () => Promise<void>;
}

declare global {
  interface Window {
    // electron: ElectronAPI
    electronAPI: ElectronAPI;
  }
}
