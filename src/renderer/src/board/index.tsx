import { NoteProvider } from '../context/NoteContext';
import BoardContainer from './container';

const Board = () => (
  <NoteProvider>
    <BoardContainer/>
  </NoteProvider>
);

export default Board; 
