import { PlusOutlined } from '@ant-design/icons'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { Button, Divider, Modal } from 'antd'
import { KeyboardEvent, useCallback, useEffect, useState } from 'react'
import SimpleMarkdownEditor from './SimpleMarkdownEditor'
import TagSelector from './TagSelector'
import TagSelectorModal from './TagSelectorModal'

interface NoteFormProps {
  editorRef: React.RefObject<MDXEditorMethods> // Adjust type as necessary
  allTags: { value: string; label: string }[]
  newNoteTags: string[]
  setNewNoteTags: (tags: string[]) => void
  handleCreateNote: () => void
  isQuickNote?: boolean
}

const NoteForm: React.FC<NoteFormProps> = ({
  editorRef,
  allTags,
  newNoteTags,
  setNewNoteTags,
  handleCreateNote,
  isQuickNote
}) => {
  const [showNoTagsModal, setShowNoTagsModal] = useState(false)

  const handleCreateNoteWithTagCheck = () => {
    if (editorRef.current) {
      const content = editorRef.current.getMarkdown()
        .replace(/(\n\s*[-*]\s*)+$/, '') // Remove trailing empty bullets
        .replace(/(\n\s*\d+\.\s*)+$/, '') // Remove trailing empty numbered list items
        .replace(/\n+$/, ''); // Remove any remaining trailing newlines
      editorRef.current.setMarkdown(content);
    }

    if (newNoteTags.length === 0) {
      openModal()
    } else {
      handleCreateNote()
    }
  }

  const closeModalAndCreateNote = () => {
    setShowNoTagsModal(false)
    handleCreateNote()
  }
  
  const handleKeyDownForForm = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        handleCreateNoteWithTagCheck()
      }
    },
    [handleCreateNoteWithTagCheck]
  )


  const handleKeyDownForModal = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        closeModalAndCreateNote()
      }
    },
    [closeModalAndCreateNote, setShowNoTagsModal]
  )

  const openModal = () => {
    setShowNoTagsModal(true)
  }



  useEffect(() => {
    if (editorRef.current && isQuickNote) {
      editorRef.current.focus()
    }
  }, [editorRef, isQuickNote])

  return (
    <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }} onKeyDown={handleKeyDownForForm}>
        <div
          style={{
            flex: 1,
            position: 'relative',
            borderRadius: '2px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ maxHeight: '50vh', overflow: 'auto', backgroundColor: '#141414' }}>
            <SimpleMarkdownEditor 
              ref={editorRef} 
              initialMarkdown="" 
            />
          </div>
          <Divider style={{ margin: '0px' }} />
          <TagSelector
            allTags={allTags}
            selectedTags={newNoteTags}
            setSelectedTags={setNewNoteTags}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateNoteWithTagCheck}
          style={{
            marginLeft: '8px',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
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
        footer={[
          <Button key="submit" type="primary" onClick={closeModalAndCreateNote}>
            Ok
          </Button>,
        ]}
      >
        <div onKeyDown={handleKeyDownForModal} tabIndex={0}>
          <p>No tags were added. Do you want to add tags?</p>
          <TagSelectorModal
            allTags={allTags}
            selectedTags={newNoteTags}
            setSelectedTags={setNewNoteTags}
          />
        </div>
      </Modal>
    </div>
  )
}

export default NoteForm
