import { createContext } from 'react';
import { Note } from '../utils/notes';

const NotationContext = createContext({
  selectedNotation: 'english' as keyof Note,
  setSelectedNotation: (_: keyof Note) => {},
});

export default NotationContext;
