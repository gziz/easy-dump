import { Button, Card, Tag, Divider, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useMemo, useState } from 'react'
import { useNotes } from './NoteContext'
import { useMarkdownEditor } from './useMarkdownEditor'
import SimpleMarkdownEditor from './SimpleMarkdownEditor'

const NoteBox = ({ note, tags }) => {
  const { editorRef } = useMarkdownEditor()
  editorRef.current?.setMarkdown(note)

  return (
    <div
      style={{
        padding: '16px',
        paddingTop: '0px',
        marginBottom: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      <SimpleMarkdownEditor ref={editorRef} initialMarkdown={note} />
      <div style={{ marginTop: '4px' }}>
        {tags.map((tag, index) => (
          <Tag color="blue" tabIndex={index} key={index}>
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
  const reversedNotes = useMemo(() => {
    return notes.toReversed()
  }, [notes])

  const handleCreateNote = () => {
    const markdown = editorRef.current?.getMarkdown()
    if (markdown && markdown !== '') {
      createNote(markdown, newNoteTags)
      handleClear()
      setNewNoteTags([])
    }
  }

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '75%' }}>
        <div style={{ marginBottom: 24, display: 'flex' }}>
          <div style={{ flex: 1, position: 'relative', backgroundColor: '#FFF' }}>
            <SimpleMarkdownEditor ref={editorRef} initialMarkdown="" />
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
        {reversedNotes.map((note) => {
          return <NoteBox note={note.content} tags={note.tags} />
        })}
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
