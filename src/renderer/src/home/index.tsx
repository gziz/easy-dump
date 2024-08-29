import { NoteProvider } from '../context/NoteContext';
import HomeContainer from './container';

const Home = () => (
  <NoteProvider>
    <HomeContainer/>
  </NoteProvider>
);

export default Home; 
