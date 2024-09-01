const { contextBridge, ipcRenderer } = require('electron')

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    runQuery: (query: string, params: any[] = []): Promise<any> =>
      ipcRenderer.invoke('db-run-query', query, params),
    saveDatabase: (): Promise<void> => ipcRenderer.invoke('db-save'),
    onQuickNote: (callback) => ipcRenderer.on('quick-note', (_event, value) => callback(value)),
    onUpdateCounter: (callback) =>
      ipcRenderer.on('update-counter', (_event, value) => callback(value))
  })

  contextBridge.exposeInMainWorld('process', {
    env: {
      NODE_ENV: 'production' // or 'development' depending on your environment
    }
  })
} catch (error) {
  console.error(error)
}
