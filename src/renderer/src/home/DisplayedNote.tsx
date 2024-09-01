import { Dropdown, message, Select, Tag } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useNotes } from '../utils/NoteContext'
import SimpleMarkdownEditor from '../utils/SimpleMarkdownEditor'
import { Note } from '../utils/types'
import { useMarkdownEditor } from '../utils/useMarkdownEditor'

const NoteBox: React.FC<{ note: Note; allTagsFormatted: { value: string; label: string }[] }> = ({
  note,
  allTagsFormatted
}) => {
  const [editedNote, setEditedNote] = useState(note.content)
  const initialNoteContent = useRef(note.content)
  const [newTags, setNewTags] = useState<string[]>(note.tags)
  const [showSelect, setShowSelect] = useState(false)
  const { editorRef } = useMarkdownEditor()
  const editTimeoutRef = useRef<number | null>(null)
  const { editNote, deleteNote } = useNotes()
  const [selectPosition, setSelectPosition] = useState<{ x: number; y: number } | null>(null)

  const containerStyle = {
    padding: '0px 4px 16px 4px',
    marginBottom: '8px',
    backgroundColor: '#141414',
    boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)'
  }

  const tagContainerStyle = {
    marginTop: '0px',
    marginLeft: '12px'
  }

  const savedEditedNote = () => {
    editNote(note.id, editedNote, newTags)
  }

  const handleChange = () => {
    const newContent = editorRef.current?.getMarkdown() || ''
    setEditedNote(newContent)

    if (editTimeoutRef.current !== null) {
      clearTimeout(editTimeoutRef.current)
    }

    editTimeoutRef.current = window.setTimeout(() => {
      savedEditedNote()
    }, 1000)
  }

  const handleBlur = () => {
    if (editedNote !== initialNoteContent.current) {
      savedEditedNote()
      message.success('Note updated successfully')
    }
  }

  const handleDeleteNote = () => {
    deleteNote(note.id)
    message.success('Note deleted successfully')
  }

  const handleUpdateTags = () => {
    savedEditedNote()
    message.success('Tags updated successfully')
    setShowSelect(false)
  }

  const items = [
    {
      key: 'delete',
      label: <span onClick={handleDeleteNote}>Delete Note</span>
    },
    {
      key: 'update-tags',
      label: <span onClick={() => setShowSelect(true)}>Update Tags</span> // Show Select on click
    }
  ]

  const handleMenuClick = (e: any) => {
    if (e.key === 'update-tags') {
      const dropdownButton = e.domEvent.target.getBoundingClientRect()
      setSelectPosition({
        x: dropdownButton.right,
        y: dropdownButton.top
      })
      setShowSelect(true)
    } else {
      setShowSelect(false)
    }
  }

  const menuProps = {
    items,
    onClick: handleMenuClick
  }

  useEffect(() => {
    setEditedNote(note.content)
    initialNoteContent.current = note.content
  }, [note])

  return (
    <Dropdown menu={menuProps} trigger={['contextMenu']}>
      <div style={containerStyle} onContextMenu={(e) => e.preventDefault()}>
        <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
          <SimpleMarkdownEditor
            ref={editorRef}
            initialMarkdown={editedNote}
            onChange={handleChange}
          />
        </div>
        <div style={tagContainerStyle}>
          {newTags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </div>
        {showSelect && selectPosition && (
          <div
            style={{
              position: 'absolute',
              top: selectPosition.y,
              left: selectPosition.x,
              zIndex: 1000,
              minWidth: '200px'
            }}
          >
            <Select
              mode="tags"
              options={allTagsFormatted}
              style={{
                width: '100%',
                marginTop: '8px'
              }}
              onChange={setNewTags}
              value={newTags}
              placeholder="Select your tags..."
              onBlur={handleUpdateTags}
            />
          </div>
        )}
      </div>
    </Dropdown>
  )
}

export default NoteBox
