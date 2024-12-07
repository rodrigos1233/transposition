import { createContext } from 'react';
import { Language } from '../hooks/useTranslation';

const LanguageContext = createContext({
    selectedLanguage: Language.English,
    setSelectedLanguage: (language: Language) => {},
});

export default LanguageContext;
