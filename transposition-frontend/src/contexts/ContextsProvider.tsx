import React, { useEffect, useState } from 'react';
import { Note } from '../utils/notes';
import { Language } from '../hooks/useTranslationLegacy.ts';
import LanguageContext from '../contexts/LanguageContext';
import NotationContext from '../contexts/NotationContext';

const detectUserBrowserLanguage = (): Language => {
  const userLanguage = navigator.language.toLowerCase().split('-')[0];
  const localStorageLanguage = localStorage.getItem(
    'selectedLanguage'
  ) as Language;

  if (localStorageLanguage) {
    return localStorageLanguage;
  }

  switch (userLanguage) {
    case 'fr':
      return Language.French;
    case 'es':
      return Language.Spanish;
    case 'de':
      return Language.German;
    default:
      return Language.English;
  }
};

const defaultNotation = (): keyof Note => {
  const userLanguage = navigator.language.toLowerCase().split('-')[0];

  const localStorageNotation = localStorage.getItem('selectedNotation') as
    | keyof Note
    | null;

  if (localStorageNotation) {
    return localStorageNotation;
  }

  switch (userLanguage) {
    case 'fr':
      return 'romance';
    case 'es':
      return 'romance';
    case 'it':
      return 'romance';
    case 'pt':
      return 'romance';
    case 'de':
      return 'german';
    case 'nl':
      return 'german';
    default:
      return 'english';
  }
};

function ContextsProvider({ children }: { children: React.ReactNode }) {
  const [selectedNotation, setSelectedNotation]: [keyof Note, any] =
    useState(defaultNotation);
  const [selectedLanguage, setSelectedLanguage] = useState(
    detectUserBrowserLanguage
  );

  function handleChangeNotation(notation: keyof Note) {
    setSelectedNotation(notation);
    localStorage.setItem('selectedNotation', notation.toString());
  }

  function handleChangeLanguage(language: Language) {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  }

  useEffect(() => {
    localStorage.setItem('selectedNotation', selectedNotation.toString());
  }, [selectedNotation]);

  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  return (
    <>
      <LanguageContext.Provider
        value={{
          selectedLanguage,
          setSelectedLanguage: handleChangeLanguage,
        }}
      >
        <NotationContext.Provider
          value={{
            selectedNotation,
            setSelectedNotation: handleChangeNotation,
          }}
        >
          {children}
        </NotationContext.Provider>
      </LanguageContext.Provider>
    </>
  );
}

export default ContextsProvider;
