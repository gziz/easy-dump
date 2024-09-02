import { Calendar, Card, Divider, Input, Tag } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNotes } from '@renderer/store/NoteContext'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'

import NewNote from '@renderer/components/NoteForm'
import DisplayedNote from './DisplayedNote'

const { Search } = Input

const HomeContainer = () => {
  const [newNoteTags, setNewNoteTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { editorRef, handleClear } = useMarkdownEditor()
  const { notes, createNote, tags } = useNotes()

  const allTagsFormatted = useMemo(() => tags.map((tag) => ({ value: tag, label: tag })), [tags])

  useEffect(() => {
    const checkWidth = () => {
      setShowCalendar(window.innerWidth > 1200)
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  const handleCreateNote = () => {
    let content = editorRef.current?.getMarkdown()
    if (content && content !== '') {
      createNote(content, newNoteTags)
      handleClear()
      setNewNoteTags([])
    }
  }

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesTags =
        selectedTags.length === 0 || note.tags.some((tag) => selectedTags.includes(tag))
      const matchesDate = !selectedDate || dayjs(note.createdAt).isSame(selectedDate, 'day')
      const matchesSearch =
        searchTerm === '' || note.content.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesTags && matchesDate && matchesSearch
    })
  }, [notes, selectedTags, selectedDate, searchTerm])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const onDateSelect = (date: dayjs.Dayjs) => {
    setSelectedDate((prevDate) => (prevDate && prevDate.isSame(date, 'day') ? null : date))
  }

  const onSearch = (value: string) => {
    setSearchTerm(value)
  }

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '70%' }}>
        <NewNote
          editorRef={editorRef}
          allTags={allTagsFormatted}
          newNoteTags={newNoteTags}
          setNewNoteTags={setNewNoteTags}
          handleCreateNote={handleCreateNote}
        />
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 180px)' }}>
          {filteredNotes.toReversed().map((note) => (
            <DisplayedNote key={note.id} note={note} allTagsFormatted={allTagsFormatted} />
          ))}
        </div>
      </div>
      <Divider type="vertical" style={{ height: '100%' }} />
      <div style={{ width: '25%' }}>
        <Search
          placeholder="Search notes..."
          allowClear
          onChange={(e) => onSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Card title="Tags" style={{ marginBottom: 24, padding: 0 }}>
          <div>
            {tags.map((tag, index) => (
              <Tag
                color={selectedTags.includes(tag) ? 'blue' : 'default'}
                key={index}
                onClick={() => toggleTag(tag)}
                style={{ cursor: 'pointer', marginBottom: '8px' }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </Card>
        {showCalendar && (
          <Card title="Calendar" style={{ marginBottom: 24, padding: 0 }}>
            <Calendar fullscreen={false} onSelect={onDateSelect} style={{ maxWidth: '100%' }} />
          </Card>
        )}
      </div>
    </div>
  )
}

export default HomeContainer
