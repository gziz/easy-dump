import SimpleMarkdownEditor from './SimpleMarkdownEditor'
import { Button, Divider, Select, RefSelectProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRef } from 'react'

const NoteForm = ({ editorRef, allTags, newNoteTags, setNewNoteTags, handleCreateNote }) => {
  const selectRef = useRef<RefSelectProps>(null)

  const handleSelectChange = (tags) => {
    setNewNoteTags(tags)
    if (selectRef.current) {
      selectRef.current.blur()
      // editorRef.current?.focus()
    }
  }

  return (
    <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column' }}>
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
          <SimpleMarkdownEditor
            ref={editorRef}
            initialMarkdown=""
            onCreateNote={handleCreateNote}
          />
          <Divider style={{ margin: '4px 0px' }} />
          <Select
            ref={selectRef}
            mode="tags"
            options={allTags}
            style={{ width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingBottom: '4px' }}
            onChange={handleSelectChange}
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
            marginLeft: '8px',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            height: 'auto',
            alignSelf: 'stretch',
            borderRadius: '8px'
          }}
        />
      </div>
    </div>
  )
}

export default NoteForm
