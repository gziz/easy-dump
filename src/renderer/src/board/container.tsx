import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, Select } from 'antd'
import { useNotes } from '@renderer/store/NoteContext'
import NoteCard from './Card'

const BoardContainer = () => {
  const { notes, tags, editNote, deleteNote } = useNotes()
  const [state, setState] = useState<{ [key: string]: any[] }>({})
  const [selectedTags, setSelectedTags] = useState<string[]>(tags)

  useEffect(() => {
    const groupedNotes = selectedTags.reduce(
      (acc, tag) => {
        acc[tag] = notes.filter((note) => note.tags.includes(tag))
        return acc
      },
      {} as { [key: string]: any[] }
    )
    setState(groupedNotes)
  }, [notes, selectedTags])

  const onDragEnd = (result) => {
    const { source, destination, type } = result

    if (!destination) {
      return
    }

    if (type === 'COLUMN') {
      const items = Array.from(selectedTags)
      const [reorderedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, reorderedItem)
      setSelectedTags(items)
    } else {
      const sourceTag = source.droppableId
      const destTag = destination.droppableId

      if (sourceTag === destTag) {
        const items = Array.from(state[sourceTag])
        const [reorderedItem] = items.splice(source.index, 1)
        items.splice(destination.index, 0, reorderedItem)
        setState({ ...state, [sourceTag]: items })
      } else {
        const sourceItems = Array.from(state[sourceTag])
        const destItems = Array.from(state[destTag])
        const [movedItem] = sourceItems.splice(source.index, 1)
        destItems.splice(destination.index, 0, movedItem)

        setState({
          ...state,
          [sourceTag]: sourceItems,
          [destTag]: destItems
        })

        // Update the note's tags
        const updatedTags = movedItem.tags.filter((tag) => tag !== sourceTag).concat(destTag)
        editNote(movedItem.id, movedItem.content, updatedTags)
      }
    }
  }

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '75%' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
            {(provided) => (
              <div
                style={{ display: 'flex', height: '90vh' }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {selectedTags.map((tag, index) => (
                  <Draggable key={tag} draggableId={tag} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          margin: '0 18px',
                          background: snapshot.isDragging ? '#f0f0f0' : 'white'
                        }}
                      >
                        <Droppable key={tag} droppableId={tag}>
                          {(provided, snapshot) => (
                            <Card
                              title={tag.toUpperCase()}
                              style={{
                                width: 200,
                                height: '90%',
                                overflowY: 'auto'
                              }}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {state[tag]?.map((note, index) => (
                                <NoteCard
                                  key={note.id}
                                  note={note}
                                  index={index}
                                  deleteNote={deleteNote}
                                />
                              ))}
                              {provided.placeholder}
                            </Card>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div style={{ width: '20%', borderLeft: '1px solid #ddd' }}>
        <div style={{ marginLeft: 10 }}>
          <Card title="Tags" style={{ marginBottom: 24, padding: 0 }}>
            <Select
              mode="multiple"
              style={{ width: '100%', marginBottom: 10 }}
              placeholder="Select tags to filter"
              onChange={setSelectedTags}
              defaultValue={tags}
            >
              {tags.map((tag) => (
                <Select.Option key={tag} value={tag}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BoardContainer
