const { contextBridge, ipcRenderer } = require('electron');

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

ipcRenderer.on('quick-note', () => {
  console.log('quick-note INSIDE PRELOAD');
});

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    runQuery: (query: string, params: any[] = []): Promise<any> =>
      ipcRenderer.invoke('db-run-query', query, params),
    saveDatabase: (): Promise<void> => ipcRenderer.invoke('db-save'),
    onQuickNote: (callback) => ipcRenderer.on('quick-note', (_event, value) => callback(value)),
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value))
  });
} catch (error) {
  console.error(error)
}

