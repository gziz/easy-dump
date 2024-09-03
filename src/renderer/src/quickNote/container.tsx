import { useNotes } from '@renderer/store/NoteContext'
import NoteForm from '@renderer/components/NoteForm'
import { useMemo } from 'react'

const QuickNoteContainer = () => {
  const { tags } = useNotes()

  const allTags = useMemo(() => tags.map((tag) => ({ value: tag, label: tag })), [tags])
  return <NoteForm allTags={allTags} />
}

export default QuickNoteContainer
