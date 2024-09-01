import React from 'react';
import { Card as AntCard } from 'antd';
import { Draggable } from 'react-beautiful-dnd';

interface NoteCardProps {
  note: {
    id: string;
    content: string;
  };
  index: number;
  deleteNote: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index }) => {
  return (
    <Draggable key={note.id} draggableId={note.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            marginBottom: "10px",
            ...provided.draggableProps.style,
          }}
        >
          <AntCard
            size="small"
            style={{
              backgroundColor: "white",
              boxShadow: snapshot.isDragging ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
              background: snapshot.isDragging ? '#e6f7ff' : '#ffffff',
              transition: 'all 0.3s ease',
            }}
          >
            <span style={{ wordBreak: 'break-word', fontWeight: '500', color: '#333', display: 'block' }}>
              {note.content}
            </span>
          </AntCard>
        </div>
      )}
    </Draggable>
  );
};

export default NoteCard;
