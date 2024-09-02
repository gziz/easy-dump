import { NoteProvider } from '@renderer/store/NoteContext';
import HomeContainer from './container';

const Home = () => (
  <NoteProvider>
    <HomeContainer/>
  </NoteProvider>
);

export default Home; 
