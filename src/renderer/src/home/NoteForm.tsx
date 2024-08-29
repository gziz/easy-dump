import SimpleMarkdownEditor from './SimpleMarkdownEditor'
import { Button, Divider, Select, RefSelectProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useCallback, KeyboardEvent, useRef, useEffect } from 'react'
import { MDXEditorMethods } from '@mdxeditor/editor';

interface NoteFormProps {
  editorRef:  React.RefObject<MDXEditorMethods>; // Adjust type as necessary
  allTags: { value: string; label: string }[];
  newNoteTags: string[];
  setNewNoteTags: (tags: string[]) => void;
  handleCreateNote: () => void;
  isQuickNote?: boolean; // Make isQuickNote optional
}

const NoteForm: React.FC<NoteFormProps> = ({ editorRef, allTags, newNoteTags, setNewNoteTags, handleCreateNote, isQuickNote }) => {
  const selectRef = useRef<RefSelectProps>(null)

  const handleSelectChange = (tags) => {
    setNewNoteTags(tags)
    if (selectRef.current) {
      selectRef.current.blur()
    }
  }

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      handleCreateNote?.()
    }
  }, [handleCreateNote])

  // Focus on the SimpleMarkdownEditor when the component mounts
  useEffect(() => {
    if (editorRef.current && isQuickNote) {
      editorRef.current.focus();
    }
  }, [editorRef, isQuickNote]);

  console.log(editorRef.current?.getMarkdown())
  return (
    <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', width: '100%' }} onKeyDown={handleKeyDown}>
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
          <div style={{ maxHeight: '85vh', overflow: 'auto' }}>
            <SimpleMarkdownEditor
              ref={editorRef}
              initialMarkdown=""
              onCreateNote={handleCreateNote}
            />
          </div>
          <Divider style={{ margin: '4px 0px' }} />
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
