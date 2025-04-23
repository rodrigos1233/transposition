import { createContext } from 'react';
import { Language } from '../hooks/useTranslationLegacy.ts';

const LanguageContext = createContext({
  selectedLanguage: Language.English,
  setSelectedLanguage: (_: Language) => {},
});

export default LanguageContext;
