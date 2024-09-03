import type { QueryExecResult } from 'sql.js';

export interface ElectronAPI {
  runQuery: (query: string, params?: any[]) => Promise<QueryExecResult[]>;
  saveDatabase: () => Promise<void>;
  onQuickNote: (callback: () => void) => void;
  setQuickNoteShortcut: (shortcut: string) => Promise<void>;
  getSettings: () => Promise<any>;
  setSettings: (settings: any) => Promise<void>;
}

declare global {
  interface Window {
    context: ElectronAPI;
  }
}
