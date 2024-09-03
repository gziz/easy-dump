import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, globalShortcut, ipcMain, shell } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import icon from '../../resources/icon.png?asset'
import { loadDatabase, runQuery, saveDatabase } from './lib/database'

let db: any
const settingsPath = join(app.getPath('userData'), 'settings.json')
let settings = readSettings()


function readSettings() {
  try {
    return JSON.parse(readFileSync(settingsPath, 'utf-8'))
  } catch (error) {
    return {
      quickNoteShortcut: 'CmdOrCtrl+Shift+D',
      showNoTagsModal: true
    }
  }
}

function writeSettings(settings) {
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
}


const handleQuickNote = async () => {
  console.log("global shortcut pressed")
  const window = BrowserWindow.getAllWindows()[0]
  if (!window) {
    console.log("no window from shortcut, creating new window")
    const newWindow = await createWindow(true)
    newWindow.on('ready-to-show', () => {
      newWindow.webContents.send('quick-note')
    })
  } else {
    console.log("window from shortcut found, showing window")
    window.webContents.send('quick-note')
    window.show()
  }
}

const registerGlobalShortcut = () => {
  console.log("registerGlobalShortcut called")
  globalShortcut.unregisterAll()
  globalShortcut.register(settings.quickNoteShortcut, () => handleQuickNote())
}

async function createWindow(isQuickNote?: boolean): Promise<BrowserWindow> {
  console.log("createWindow called")
  const dimensions = isQuickNote ? { width: 800, height: 500 } : { width: 1000, height: 800 }
  const mainWindow = new BrowserWindow({
    width: dimensions.width,
    height: dimensions.height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })
  db = await loadDatabase()

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
  return mainWindow
}


app.whenReady().then(async () => {
  console.log("app.whenReady called")
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await createWindow()
  registerGlobalShortcut()

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
    db = await loadDatabase()
  }
  return runQuery(db, query, params)
})

ipcMain.handle('db-save', async () => {
  if (!db) {
    db = await loadDatabase()
  }
  saveDatabase(db)
})

ipcMain.handle('set-quick-note-shortcut', (_, newShortcut: string) => {
  settings.quickNoteShortcut = newShortcut
  writeSettings(settings)
})

ipcMain.handle('get-settings', () => {
  return settings
})

ipcMain.handle('set-settings', (_, newSettings: any) => {
  const oldShortcut = settings.quickNoteShortcut
  settings = { ...settings, ...newSettings }
  if (oldShortcut !== settings.quickNoteShortcut) {
    registerGlobalShortcut()
  }
  writeSettings(settings)
})
