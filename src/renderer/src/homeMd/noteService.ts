import { loadDatabase, saveDatabase } from '../../../main/database'
import { Note } from './types'

export const createNote = async (
  notes: Note[],
  noteContent: string,
  selectedTags: string[]
): Promise<Note[]> => {

  const newNote: Note = {
    id: generateUniqueId(),
    content: noteContent,
    tags: selectedTags,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  // Insert the note into the database
  window.electronAPI.runQuery(
    `INSERT INTO notes (id, content, tags, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`,
    [
      newNote.id,
      newNote.content,
      JSON.stringify(newNote.tags),
      newNote.createdAt.toISOString(),
      newNote.updatedAt.toISOString()
    ]
  )

  // saveDatabase(db)
  return [...notes, newNote]
}

export const editNote = async (
  notes: Note[],
  noteId: string,
  updatedContent: string,
  updatedTags: string[]
): Promise<Note[]> => {
  // const db = await loadDatabase()

  // Update the note in the database
  window.electronAPI.runQuery(
    `UPDATE notes SET content = ?, tags = ?, updatedAt = ? WHERE id = ?`,
    [updatedContent, JSON.stringify(updatedTags), new Date().toISOString(), noteId]
  )

  // saveDatabase(db)
  return notes.map((note) =>
    note.id === noteId
      ? { ...note, content: updatedContent, tags: updatedTags, updatedAt: new Date() }
      : note
  )
}

export const deleteNote = async (notes: Note[], noteId: string): Promise<Note[]> => {
  const db = await loadDatabase()

  // Delete the note from the database
  window.electronAPI.runQuery(`DELETE FROM notes WHERE id = ?`, [noteId])

  saveDatabase(db)
  return notes.filter((note) => note.id !== noteId)
}

export const getNotes = async (): Promise<Note[]> => {
  const queryResult = await window.electronAPI.runQuery(`SELECT * FROM notes`)
  const results = queryResult[0]
  const notes: Note[] = results.values.map((row) => {
    return {
      id: row[0] as string,
      content: row[1] as string,
      tags: JSON.parse(row[2] as string),
      createdAt: new Date(row[3] || (Date.now().toString() as string)),
      updatedAt: new Date(row[4] || (Date.now().toString() as string))
    }
  })

  return notes;
}

const generateUniqueId = () =>{
  return '_' + Math.random().toString(36).slice(2, 9)
}


