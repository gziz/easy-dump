import { Button, Card, Tag, Divider, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useMemo, useState, useEffect, useRef } from 'react'
import { useNotes } from './NoteContext'
import { useMarkdownEditor } from './useMarkdownEditor'
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

const HomeContainer = () => {
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const { editorRef, handleClear } = useMarkdownEditor()
  const { notes, createNote, tags } = useNotes()

  const allTagsFormatted = useMemo(() => tags.map((tag) => ({ value: tag, label: tag })), [tags])

  const handleCreateNote = () => {
    let content = editorRef.current?.getMarkdown()
    if (content && content !== '') {
      createNote(content, newNoteTags)
      handleClear()
      setNewNoteTags([])
    }
  }

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '75%' }}>
        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, position: 'relative', backgroundColor: '#FFF' }}>
              <SimpleMarkdownEditor
                ref={editorRef}
                initialMarkdown=""
                onCreateNote={handleCreateNote}
              />
              <Select
                mode="tags"
                options={allTagsFormatted}
                style={{ width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                onChange={(tags) => setNewNoteTags(tags)}
                value={newNoteTags}
                placeholder="Select your tags..."
                variant="borderless"
              />
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateNote}
              style={{
                marginLeft: '-1px',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: 'auto',
                alignSelf: 'stretch',
                borderLeft: 'none'
              }}
            />
          </div>
        </div>
        {notes.toReversed().map((note) => (
          <NoteBox key={note.id} note={note} />
        ))}
      </div>

      <div style={{ width: '20%', borderLeft: '1px solid #ddd' }}>
        <div style={{ marginLeft: 10 }}>
          <Card title="Tags" style={{ marginBottom: 24 }}>
            <div>
              {tags.map((tag, index) => (
                <Tag color="blue" key={index}>
                  {tag}
                </Tag>
              ))}
            </div>
          </Card>
          <Divider />
          <div>
            <Button type="link">Links 1</Button>
            <Button type="link">To-do 0/2</Button>
            <Button type="link">Code 0</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeContainer
