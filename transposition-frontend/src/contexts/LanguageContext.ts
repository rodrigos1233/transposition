import { createContext } from 'react';
import { Language } from '../hooks/useTranslation';

const LanguageContext = createContext({
  selectedLanguage: Language.English,
  setSelectedLanguage: (_: Language) => {},
});

export default LanguageContext;
