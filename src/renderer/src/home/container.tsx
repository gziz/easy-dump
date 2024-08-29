import { Button, Card, Tag, Divider } from 'antd'
import { useMemo, useState } from 'react'
import { useNotes } from '../context/NoteContext'
import { useMarkdownEditor } from './useMarkdownEditor'

import NewNote from './NoteForm'
import DisplayedNote from './DisplayedNote'

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
        <NewNote
          editorRef={editorRef}
          allTags={allTagsFormatted}
          newNoteTags={newNoteTags}
          setNewNoteTags={setNewNoteTags}
          handleCreateNote={handleCreateNote}
        />
        {notes.toReversed().map((note) => (
          <DisplayedNote key={note.id} note={note} allTagsFormatted={allTagsFormatted} />
        ))}
      </div>

      <div style={{ width: '20%', borderLeft: '1px solid #ddd' }}>
        <div style={{ marginLeft: 10 }}>
          <Card title="Tags" style={{ marginBottom: 24, padding: 0 }}>
            <div>
              {tags.map((tag, index) => (
                <Tag color="blue" key={index}>
                  {tag}
                </Tag>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomeContainer
