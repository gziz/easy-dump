import { NoteProvider } from '@renderer/store/NoteContext';
import QuickNoteContainer from './container';

const QuickNote = () => (
  <NoteProvider>
    <QuickNoteContainer/>
  </NoteProvider>
);

export default QuickNote; 
