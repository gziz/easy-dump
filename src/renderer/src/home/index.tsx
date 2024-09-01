import { NoteProvider } from '../utils/NoteContext';
import HomeContainer from './container';

const Home = () => (
  <NoteProvider>
    <HomeContainer/>
  </NoteProvider>
);

export default Home; 
