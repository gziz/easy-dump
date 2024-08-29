import React, { createContext, useContext, useEffect, useState } from 'react';
import { createNote, editNote, deleteNote, getNotes } from './noteService';
import { Note } from '../home/types';

type NoteContextType = {
  notes: Note[];
  tags: string[];
  createNote: (noteContent: string, selectedTags: string[]) => Promise<void>;
  editNote: (noteId: string, updatedContent: string, updatedTags: string[]) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
};

type NoteProviderProps = React.PropsWithChildren<{}>;

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesFromDb = await getNotes();
      setNotes(notesFromDb);
      const allTags = notesFromDb.reduce<string[]>((acc, note) => {
        return acc.concat(note.tags);
      }, []);
      setTags([...new Set(allTags)]);
    };
    fetchNotes();
  }, []);

  const handleCreateNote = async (noteContent: string, selectedTags: string[]) => {
    const updatedNotes = await createNote(notes, noteContent, selectedTags);
    setNotes(updatedNotes);
    setTags(prevTags => [...new Set([...prevTags, ...selectedTags])]);
  };

  const handleEditNote = async (noteId: string, updatedContent: string, updatedTags: string[]) => {
    const updatedNotes = await editNote(notes, noteId, updatedContent, updatedTags);
    setNotes(updatedNotes);
    setTags(prevTags => [...new Set([...prevTags, ...updatedTags])]);
  };

  const handleDeleteNote = async (noteId: string) => {
    const updatedNotes = await deleteNote(notes, noteId);
    setNotes(updatedNotes);
  };


  return (
    <NoteContext.Provider value={{ notes, tags, createNote: handleCreateNote, editNote: handleEditNote, deleteNote: handleDeleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};
