import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { loadDatabase, saveDatabase } from './database'
import { Database } from 'sqlite3'


let db: Database;

async function createWindow(): Promise<BrowserWindow> {
  db = await loadDatabase();

  const mainWindow = new BrowserWindow({  
    width: 1000,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return mainWindow;
}

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await createWindow()


  globalShortcut.register("CmdOrCtrl+Shift+D", async () => {
    console.log("shortcut pressed!")
    const window = BrowserWindow.getAllWindows()[0];
    if (!window) {
      console.log("no window found!")
      const newWindow = await createWindow();
      newWindow.on('ready-to-show', () => {
        console.log("ready to show window!")
        newWindow.webContents.send('quick-note');
      })
    } else {
      console.log("window found!")
      window.webContents.send('quick-note')
      window.show();
    }
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('db-run-query', async (_, query: string, params: any[]) => {
  if (!db) {
    db = await loadDatabase();
  }

  try {
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const result = db.exec(query);
      return result; // Return the query results
    } else {
      db.run(query, params);
      await saveDatabase(db)

      return [];
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
});


ipcMain.handle('db-save', async () => {
  if (db) {
    saveDatabase(db);
  }
});