import { useMemo, useState } from 'react'
import { useNotes } from '../context/NoteContext'
import { useMarkdownEditor } from '../home/useMarkdownEditor'
import NoteForm from '@renderer/home/NoteForm'

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
