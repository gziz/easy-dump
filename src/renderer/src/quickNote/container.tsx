import { useNotes } from '@renderer/store/NoteContext'
import NoteForm from '@renderer/components/NoteForm'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { message } from 'antd'
import { useMemo, useState } from 'react'

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
      message.success('Note created successfully')
    }
  }

  return (
    <NoteForm
      editorRef={editorRef}
      allTags={allTags}
      newNoteTags={newNoteTags}
      setNewNoteTags={setNewNoteTags}
      handleCreateNote={handleCreateNote}
      isQuickNote={true}
    />
  )
}

export default QuickNoteContainer
