import { ReactNode, useEffect, useState } from 'react';

export enum Language {
  English = 'en',
  French = 'fr',
  Spanish = 'es',
  German = 'de',
}

// Update the type to allow either ReactNode or arrays of ReactNodes
export type Translations = {
  [K in Language]?: (ReactNode | ReactNode[])[];
};

const ensureArrayStructure = (value: ReactNode | ReactNode[]): ReactNode[] => {
  // If it's already an array, return it as is. Otherwise, wrap it in an array.
  return Array.isArray(value) ? value : [value];
};

const useTranslation = (
  selectedLanguage: Language,
  translations: Translations,
  customDependencies: any[]
): ReactNode[][] => {
  const [translatedStrings, setTranslatedStrings] = useState<ReactNode[][]>([]);

  useEffect(() => {
    const translate = () => {
      const fallbackLanguage = Language.English;
      const fallbackStrings = translations[fallbackLanguage] || [];
      const selectedStrings = translations[selectedLanguage] || fallbackStrings;

      // Ensure every element is an array of ReactNodes
      const structuredStrings = selectedStrings.map(ensureArrayStructure);

      // Set the structured array into state
      setTranslatedStrings(structuredStrings);
    };

    translate();
  }, [selectedLanguage, ...customDependencies]);

  return translatedStrings;
};

export default useTranslation;
