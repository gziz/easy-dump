import { NoteProvider } from '../utils/NoteContext';
import QuickNoteContainer from './container';

const QuickNote = () => (
  <NoteProvider>
    <QuickNoteContainer/>
  </NoteProvider>
);

export default QuickNote; 
