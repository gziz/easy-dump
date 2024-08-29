import { NoteProvider } from '../context/NoteContext';
import QuickNoteContainer from './container';

const QuickNote = () => (
  <NoteProvider>
    <QuickNoteContainer/>
  </NoteProvider>
);

export default QuickNote; 
