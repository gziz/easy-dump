import { useNotes } from '@renderer/store/NoteContext'
import { Calendar, Card, Divider, Input, Tag } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

import NoteForm from '@renderer/components/NoteForm'
import DisplayedNote from '@renderer/components/DisplayedNote'
import CompactCalendar from '@renderer/components/CompactCalendar'

const { Search } = Input

const HomeContainer = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [displayMode, setDisplayMode] = useState<'full' | 'partial' | 'minimal'>('minimal')
  const [searchTerm, setSearchTerm] = useState('')
  const { notes, tags } = useNotes()

  const allTagsFormatted = useMemo(() => tags.map((tag) => ({ value: tag, label: tag })), [tags])
  

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

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth > 1100) {
        setDisplayMode('full')
      } else if (window.innerWidth > 800) {
        setDisplayMode('partial')
      } else {
        setDisplayMode('minimal')
      }
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ 
        width: displayMode === 'minimal' ? '100%' : '70%', 
        overflowY: 'auto', 
        maxHeight: 'calc(100vh - 50px)' 
      }}>
        <NoteForm allTags={allTagsFormatted} />
        {filteredNotes.toReversed().map((note) => (
          <DisplayedNote key={note.id} note={note} allTagsFormatted={allTagsFormatted} />
        ))}
      </div>
      {displayMode !== 'minimal' && (
        <>
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
            {displayMode === 'full' && (
              <Card title="Calendar" style={{ marginBottom: 24, padding: 0 }}>
                <CompactCalendar onSelect={onDateSelect} />
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default HomeContainer
