import type { QueryExecResult } from 'sql.js';

export interface ElectronAPI {
  runQuery: (query: string, params?: any[]) => Promise<QueryExecResult[]>;
  saveDatabase: () => Promise<void>;
  onQuickNote: (callback: () => void) => void;
}

declare global {
  interface Window {
    // electron: ElectronAPI
    electronAPI: ElectronAPI;
    process: {
      env: {
        NODE_ENV: string;
      };
    };
  }
}
