import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
// import path from 'path';

// const dbPath = path.join(__dirname, 'notes.sqlite');
const dbPath = './notes.sqlite';


// Load the database from a file or create a new one
const loadDatabase = async (): Promise<Database> => {
  const SQL = await initSqlJs();
  let db;

  if (fs.existsSync(dbPath)) {
    // Load existing database
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    // Create a new database
    db = new SQL.Database();
    // Create a notes table
    db.run(`
      CREATE TABLE notes (
        id TEXT PRIMARY KEY,
        content TEXT,
        tags TEXT,
        createdAt TEXT,
        updatedAt TEXT
      );
    `);
    saveDatabase(db);
  }

  return db;
};

// Save the database to the file system
const saveDatabase = (db: Database) => {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
};

export { loadDatabase, saveDatabase };
