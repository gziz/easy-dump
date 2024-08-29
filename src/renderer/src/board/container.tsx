import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Card } from 'antd';
import { useNotes } from '../context/NoteContext';
import NoteCard from './Card';

const BoardContainer = () => {
  const { notes, tags, editNote, deleteNote } = useNotes();
  const [state, setState] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    const groupedNotes = tags.reduce((acc, tag) => {
      acc[tag] = notes.filter(note => note.tags.includes(tag));
      return acc;
    }, {} as { [key: string]: any[] });
    setState(groupedNotes);
  }, [notes, tags]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceTag = source.droppableId;
    const destTag = destination.droppableId;

    if (sourceTag === destTag) {
      const items = Array.from(state[sourceTag]);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      setState({ ...state, [sourceTag]: items });
    } else {
      const sourceItems = Array.from(state[sourceTag]);
      const destItems = Array.from(state[destTag]);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);

      setState({
        ...state,
        [sourceTag]: sourceItems,
        [destTag]: destItems,
      });

      // Update the note's tags
      const updatedTags = movedItem.tags.filter(tag => tag !== sourceTag).concat(destTag);
      editNote(movedItem.id, movedItem.content, updatedTags);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-around', height: '90vh' }}>
        {Object.keys(state).map((tag) => (
          <Droppable key={tag} droppableId={tag}>
            {(provided, snapshot) => (
              <Card
                title={tag.toUpperCase()}
                style={{
                  width: 200,
                  margin: '0 18px',
                  background: snapshot.isDraggingOver ? '#f0f0f0' : 'white',
                  height: '90%',
                  overflowY: 'auto',
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {state[tag].map((note, index) => (
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
        ))}
      </div>
    </DragDropContext>
  );
};

export default BoardContainer;
