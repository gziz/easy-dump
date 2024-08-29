import { useMemo, useRef, useState } from 'react'
import { useNotes } from '../home/NoteContext'
import { useMarkdownEditor } from '../home/useMarkdownEditor'
import SimpleMarkdownEditor from '../home/SimpleMarkdownEditor'
import { Button, RefSelectProps, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const QuickNoteContainer = () => {
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const { editorRef, handleClear } = useMarkdownEditor()
  const { createNote, tags } = useNotes()

  const allTags = useMemo(() => tags.map((tag) => ({ value: tag, label: tag })), [tags])

  const handleCreateNote = () => {
    let content = editorRef.current?.getMarkdown()
    if (content && content !== '') {
      createNote(content, newNoteTags)
      handleClear()
      setNewNoteTags([])
    }
  }

  const selectRef = useRef<RefSelectProps>(null)

  const handleSelectChange = (tags) => {
    setNewNoteTags(tags)
    if (selectRef.current) {
      selectRef.current.blur()
      // editorRef.current?.focus()
    }
  }
  return (
    <div
      style={{
        marginBottom: 24,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#FFF',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ borderBottom: '1px solid #ddd', maxHeight: '500px', overflow: 'auto' }}>
            <SimpleMarkdownEditor
              ref={editorRef}
              initialMarkdown=""
              onCreateNote={handleCreateNote}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Select
              ref={selectRef}
              mode="tags"
              options={allTags}
              style={{
                width: '100%',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                paddingBottom: '4px'
              }}
              onChange={handleSelectChange}
              value={newNoteTags}
              placeholder="Select your tags..."
              variant="borderless"
            />
            <div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateNote}
                style={{
                  height: '100%',
                  // marginLeft: '8px',
                  // height: '30px', // Set a fixed height
                  // width: '30px', // Set a fixed width to make it circular
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0 0 8px 0px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickNoteContainer
