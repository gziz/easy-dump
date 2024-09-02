import { NoteProvider } from '@renderer/store/NoteContext';
import BoardContainer from './container';

const Board = () => (
  <NoteProvider>
    <BoardContainer/>
  </NoteProvider>
);

export default Board; 
