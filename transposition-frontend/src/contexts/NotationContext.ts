import { createContext } from 'react';
import { Note } from '../utils/notes';

const NotationContext = createContext({
    selectedNotation: 'english' as keyof Note,
    setSelectedNotation: (notation: keyof Note) => {},
});

export default NotationContext;
