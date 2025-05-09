import { Language } from '../hooks/useTranslationLegacy.ts';

export interface Mode {
  translations: {
    [key in Language]: string;
  };
  modePosition: number;
}

export const MODES: Mode[] = [
  {
    translations: {
      [Language.English]: 'Major',
      [Language.French]: 'Majeur',
      [Language.Spanish]: 'Mayor',
      [Language.German]: 'Dur',
    },
    modePosition: 0,
  },
  {
    translations: {
      [Language.English]: 'Minor',
      [Language.French]: 'Mineur',
      [Language.Spanish]: 'Menor',
      [Language.German]: 'Moll',
    },
    modePosition: -3,
  },
  {
    translations: {
      [Language.English]: 'Dorian',
      [Language.French]: 'Dorien',
      [Language.Spanish]: 'Dórico',
      [Language.German]: 'Dorisch',
    },
    modePosition: -2,
  },
  {
    translations: {
      [Language.English]: 'Phrygian',
      [Language.French]: 'Phrygien',
      [Language.Spanish]: 'Frigio',
      [Language.German]: 'Phrygisch',
    },
    modePosition: -4,
  },
  {
    translations: {
      [Language.English]: 'Lydian',
      [Language.French]: 'Lydien',
      [Language.Spanish]: 'Lidio',
      [Language.German]: 'Lydisch',
    },
    modePosition: 1,
  },
  {
    translations: {
      [Language.English]: 'Mixolydian',
      [Language.French]: 'Mixolydien',
      [Language.Spanish]: 'Mixolídio',
      [Language.German]: 'Mixolydisch',
    },
    modePosition: -1,
  },
  {
    translations: {
      [Language.English]: 'Locrian',
      [Language.French]: 'Locrien',
      [Language.Spanish]: 'Locrio',
      [Language.German]: 'Lokrisch',
    },
    modePosition: -5,
  },
];

function i18nLanguageToEnum(language: string): Language {
  switch (language) {
    case 'fr':
      return Language.French;
    case 'es':
      return Language.Spanish;
    case 'de':
      return Language.German;
    default:
      return Language.English;
  }
}

export function getModeName(index: number, language: string | Language): string {
  const selectedLanguage = typeof language === 'string' ? i18nLanguageToEnum(language) : language;
  // Fallback to English if the selected language is not available
  return (
    MODES[index].translations[selectedLanguage] ||
    MODES[index].translations[Language.English]
  );
}
