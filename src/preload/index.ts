import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    runQuery: (query: string, params: any[] = []): Promise<any> =>
      ipcRenderer.invoke('db-run-query', query, params),
    saveDatabase: (): Promise<void> => ipcRenderer.invoke('db-save'),
    onQuickNote: (callback) => ipcRenderer.on('quick-note', (_event, value) => callback(value)),
    setQuickNoteShortcut: (shortcut: string) => ipcRenderer.invoke('set-quick-note-shortcut', shortcut),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    setSettings: (settings: any) => ipcRenderer.invoke('set-settings', settings)
  })

  contextBridge.exposeInMainWorld('process', {
    env: {
      NODE_ENV: 'production' // or 'development' depending on your environment
    }
  })
} catch (error) {
  console.error(error)
}
