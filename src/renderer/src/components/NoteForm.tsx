import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Modal } from 'antd'
import { KeyboardEvent, useCallback, useEffect, useState } from 'react'
import SimpleMarkdownEditor from './SimpleMarkdownEditor'
import TagSelector from './TagSelector'
import TagSelectorModal from './TagSelectorModal'
import { handleKeyDownForForm as baseHandleKeyDownForForm } from './utils'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { useNotes } from '@renderer/store/NoteContext'

interface NoteFormProps {
  allTags: { value: string; label: string }[]
}

const NoteForm: React.FC<NoteFormProps> = ({ allTags }) => {
  const [showNoTagsModal, setShowNoTagsModal] = useState(false)
  const [shouldShowModal, setShouldShowSettingsModal] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const { editorRef, handleClear } = useMarkdownEditor()
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const { createNote } = useNotes()

  useEffect(() => {
    window.context.getSettings().then(settings => {
      setShouldShowSettingsModal(settings.showNoTagsModal)
    })
  }, [])

  const handleCreateNoteBase = () => {
    const content = editorRef.current
      ?.getMarkdown()
      .replace(/(\n\s*[-*]\s*)+$/, '') // Remove trailing empty bullets
      .replace(/(\n\s*\d+\.\s*)+$/, '') // Remove trailing empty numbered list items
      .replace(/\n+$/, '') // Remove any remaining trailing newlines
    if (content && content !== '') {
      createNote(content, newNoteTags)
      handleClear()
      setNewNoteTags([])
      setHasContent(false)
    }
  }

  const handleCreateNoteWithTagCheck = () => {
    if (newNoteTags.length === 0 && shouldShowModal) {
      setShowNoTagsModal(true)
    } else {
      handleCreateNoteBase()
    }
  }

  const handleCreateNote = () => {
    if (shouldShowModal) {
      handleCreateNoteWithTagCheck()
    } else {
      handleCreateNoteBase()
    }
  }

  const closeModalAndCreateNote = () => {
    setShowNoTagsModal(false)
    handleCreateNoteBase()
  }

  const handleKeyDownForForm = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) =>
      baseHandleKeyDownForForm(event, handleCreateNote),
    [baseHandleKeyDownForForm, handleCreateNote]
  )

  const handleKeyDownForModal = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) =>
      baseHandleKeyDownForForm(event, closeModalAndCreateNote),
    [baseHandleKeyDownForForm, closeModalAndCreateNote]
  )

  const handleEditorChange = useCallback((markdown: string) => {
    setHasContent(markdown.trim().length > 0)
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      console.log("focusing editor")
      editorRef.current.focus()
    }
  }, [editorRef])

  return (
    <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', overflow: 'auto' }}
        onKeyDown={handleKeyDownForForm}
      >
        <div
          style={{
            flex: 1,
            position: 'relative',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <div style={{ backgroundColor: '#141414', position: 'relative' }}>
            <SimpleMarkdownEditor
              ref={editorRef}
              initialMarkdown=""
              onChange={handleEditorChange}
            />
            {hasContent && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.45)',
                  pointerEvents: 'none'
                }}
              >
                ⌘ + Enter to save
              </div>
            )}
          </div>
          <Divider style={{ margin: '0px' }} />
          <TagSelector
            allTags={allTags}
            selectedTags={newNoteTags}
            setSelectedTags={setNewNoteTags}
            isBorderless={true}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateNote}
          style={{
            marginLeft: '8px',
            height: 'auto',
            alignSelf: 'stretch',
            borderRadius: '2px'
          }}
        />
      </div>
      <Modal
        title="No Tags Added"
        open={showNoTagsModal}
        onCancel={closeModalAndCreateNote}
        destroyOnClose={true}
        closable={false}
        footer={[
          <Button key="submit" type="primary" onClick={closeModalAndCreateNote}>
            {newNoteTags.length > 0 ? 'Save' : 'Skip'}
          </Button>
        ]}
      >
        <div onKeyDown={handleKeyDownForModal} tabIndex={0} style={{ position: 'relative' }}>
          <p>Do you want to add tags?</p>
          <TagSelectorModal
            allTags={allTags}
            selectedTags={newNoteTags}
            setSelectedTags={setNewNoteTags}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.45)',
              pointerEvents: 'none'
            }}
          >
            ⌘ + Enter to {newNoteTags.length > 0 ? 'save' : 'skip'}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default NoteForm
