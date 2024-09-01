import { NoteProvider } from '../utils/NoteContext';
import BoardContainer from './container';

const Board = () => (
  <NoteProvider>
    <BoardContainer/>
  </NoteProvider>
);

export default Board; 
