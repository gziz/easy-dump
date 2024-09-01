import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import initSqlJs, { Database } from 'sql.js'

const dbPath = path.join(app.getPath('userData'), 'notes.sqlite')

const loadDatabase = async (): Promise<Database> => {
  const SQL = await initSqlJs()
  let db

  if (fs.existsSync(dbPath)) {
    // Load existing database
    const fileBuffer = fs.readFileSync(dbPath)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
    db.run(`
      CREATE TABLE notes (
        id TEXT PRIMARY KEY,
        content TEXT,
        tags TEXT,
        isMarkdown BOOLEAN,
        createdAt TEXT,
        updatedAt TEXT
      );
    `)
    saveDatabase(db)
  }

  return db
}

const saveDatabase = (db: Database) => {
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(dbPath, buffer)
}

export { loadDatabase, saveDatabase }
