import React, { useState, useRef, useEffect } from 'react'
import { Tag } from 'antd'
import { useMarkdownEditor } from './useMarkdownEditor'
import { useNotes } from './NoteContext'
import SimpleMarkdownEditor from './SimpleMarkdownEditor'
import { Note } from './types'

const NoteBox: React.FC<{ note: Note }> = ({ note }) => {
  const [editedNote, setEditedNote] = useState(note.content)
  const { editorRef } = useMarkdownEditor()
  const editTimeoutRef = useRef<number | null>(null)
  const { editNote } = useNotes()

  const containerStyle = {
    padding: '0px 4px 16px 4px',
    marginBottom: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)'
  }

  const tagContainerStyle = {
    marginTop: '8px',
    marginLeft: '12px'
  }

  const savedEditedNote = () => {
    editNote(note.id, editedNote, note.tags)
  }

  const handleChange = () => {
    console.log('handleChange')
    setEditedNote(editorRef.current?.getMarkdown() || '')

    if (editTimeoutRef.current !== null) {
      clearTimeout(editTimeoutRef.current)
    }

    editTimeoutRef.current = window.setTimeout(() => {
      savedEditedNote()
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (editTimeoutRef.current !== null) {
        clearTimeout(editTimeoutRef.current)
        savedEditedNote()
      }
    }
  }, [note])

  return (
    <div style={containerStyle}>
      <SimpleMarkdownEditor ref={editorRef} initialMarkdown={editedNote} onChange={handleChange} />
      <div style={tagContainerStyle}>
        {note.tags.map((tag) => (
          <Tag color="blue" key={tag}>
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  )
}

export default NoteBox