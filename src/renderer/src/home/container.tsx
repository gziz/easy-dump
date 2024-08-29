import { Button, Card, Tag, Divider } from 'antd'
import { useMemo, useState } from 'react'
import { useNotes } from './NoteContext'
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
          <DisplayedNote key={note.id} note={note} />
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
