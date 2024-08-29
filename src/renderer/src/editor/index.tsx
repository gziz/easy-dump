import { NoteProvider } from '../context/NoteContext';
import EditorContainer from './container';

const Editor = () => (
  <NoteProvider>
    <EditorContainer/>
  </NoteProvider>
);

export default Editor; 
