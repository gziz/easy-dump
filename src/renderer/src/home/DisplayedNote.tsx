import { Dropdown, message, Tag } from 'antd'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNotes } from '../utils/NoteContext'
import SimpleMarkdownEditor from '../utils/SimpleMarkdownEditor'
import { Note } from '../utils/types'
import { useMarkdownEditor } from '../utils/useMarkdownEditor'
import { handleKeyDownForForm } from '@renderer/utils/utils'
import TagSelector from '@renderer/utils/TagSelector'

const NoteBox: React.FC<{ note: Note; allTagsFormatted: { value: string; label: string }[] }> = ({
  note,
  allTagsFormatted
}) => {
  const [editedNote, setEditedNote] = useState(note.content)
  const previousNoteContent = useRef(note.content)
  const [newTags, setNewTags] = useState<string[]>(note.tags)
  const [showSelect, setShowSelect] = useState(false)
  const { editorRef } = useMarkdownEditor()
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

  const saveEditedContent = useCallback(() => {
    if (editedNote !== previousNoteContent.current) {
      editNote(note.id, editedNote, newTags)
      previousNoteContent.current = editedNote
      return true
    }
    return false
  }, [editedNote, newTags, note.id, editNote])

  const saveEditedTags = useCallback(() => {
    if (newTags !== note.tags) {
      editNote(note.id, editedNote, newTags)
      return true
    }
    return false
  }, [editedNote, newTags, note.id, editNote])

  const handleChange = () => {
    const newContent = editorRef.current?.getMarkdown() || ''
    setEditedNote(newContent)
  }

  const handleBlur = () => {
    if (saveEditedContent()) {
      message.success('Note updated successfully')
    }
  }

  const handleDeleteNote = () => {
    deleteNote(note.id)
    message.success('Note deleted successfully')
  }

  const handleUpdateTags = () => {
    if (saveEditedTags()) {
      message.success('Tags updated successfully')
    }
    setShowSelect(false)
  }

  const items = [
    {
      key: 'delete',
      label: <span onClick={handleDeleteNote}>Delete Note</span>
    },
    {
      key: 'update-tags',
      label: <span onClick={() => setShowSelect(true)}>Update Tags</span>
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
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (editedNote !== previousNoteContent.current) {
        saveEditedContent()
        saveEditedTags()
        event.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [editedNote, saveEditedContent, saveEditedTags])

  useEffect(() => {
    setEditedNote(note.content)
    setNewTags(note.tags)
    previousNoteContent.current = note.content
  }, [note])

  return (
    <Dropdown menu={menuProps} trigger={['contextMenu']}>
      <div style={containerStyle} onContextMenu={(e) => e.preventDefault()}>
        <div style={{ maxHeight: '50vh', overflow: 'auto' }} onBlur={handleBlur} onKeyDown={(event) => handleKeyDownForForm(event, handleBlur)}>
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
            <TagSelector
              allTags={allTagsFormatted}
              selectedTags={newTags}
              setSelectedTags={setNewTags}
              onBlur={handleUpdateTags}
              autoFocus={true}
              onKeyDown={(event) => handleKeyDownForForm(event, handleUpdateTags)}
            />
          </div>
        )}
      </div>
    </Dropdown>
  )
}

export default NoteBox
