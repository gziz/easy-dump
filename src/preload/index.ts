const { contextBridge, ipcRenderer } = require('electron');

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    runQuery: (query: string, params: any[] = []): Promise<any> =>
      ipcRenderer.invoke('db-run-query', query, params),
    saveDatabase: (): Promise<void> => ipcRenderer.invoke('db-save')

  });
} catch (error) {
  console.error(error)
}

