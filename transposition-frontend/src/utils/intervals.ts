import { Language } from '../hooks/useTranslation';

export const INTERVALS: Interval[] = [
  {
    translations: {
      [Language.English]: 'Perfect unison',
      [Language.French]: 'Unisson parfait',
      [Language.Spanish]: 'Unísono perfecto',
      [Language.German]: 'Reiner Einklang',
    },
    intervalValue: 0,
  },
  {
    translations: {
      [Language.English]: 'Minor second',
      [Language.French]: 'Seconde mineure',
      [Language.Spanish]: 'Segunda menor',
      [Language.German]: 'Kleine Sekunde',
    },
    intervalValue: 1,
  },
  {
    translations: {
      [Language.English]: 'Major second',
      [Language.French]: 'Seconde majeure',
      [Language.Spanish]: 'Segunda mayor',
      [Language.German]: 'Große Sekunde',
    },
    intervalValue: 2,
  },
  {
    translations: {
      [Language.English]: 'Minor third',
      [Language.French]: 'Tierce mineure',
      [Language.Spanish]: 'Tercera menor',
      [Language.German]: 'Kleine Terz',
    },
    intervalValue: 3,
  },
  {
    translations: {
      [Language.English]: 'Major third',
      [Language.French]: 'Tierce majeure',
      [Language.Spanish]: 'Tercera mayor',
      [Language.German]: 'Große Terz',
    },
    intervalValue: 4,
  },
  {
    translations: {
      [Language.English]: 'Perfect fourth',
      [Language.French]: 'Quarte juste',
      [Language.Spanish]: 'Cuarta justa',
      [Language.German]: 'Reine Quarte',
    },
    intervalValue: 5,
  },
  {
    translations: {
      [Language.English]: 'Tritone',
      [Language.French]: 'Triton',
      [Language.Spanish]: 'Tritono',
      [Language.German]: 'Tritonus',
    },
    intervalValue: 6,
  },
  {
    translations: {
      [Language.English]: 'Perfect fifth',
      [Language.French]: 'Quinte juste',
      [Language.Spanish]: 'Quinta justa',
      [Language.German]: 'Reine Quinte',
    },
    intervalValue: 7,
  },
  {
    translations: {
      [Language.English]: 'Minor sixth',
      [Language.French]: 'Sixte mineure',
      [Language.Spanish]: 'Sexta menor',
      [Language.German]: 'Kleine Sexte',
    },
    intervalValue: 8,
  },
  {
    translations: {
      [Language.English]: 'Major sixth',
      [Language.French]: 'Sixte majeure',
      [Language.Spanish]: 'Sexta mayor',
      [Language.German]: 'Große Sexte',
    },
    intervalValue: 9,
  },
  {
    translations: {
      [Language.English]: 'Minor seventh',
      [Language.French]: 'Septième mineure',
      [Language.Spanish]: 'Séptima menor',
      [Language.German]: 'Kleine Septime',
    },
    intervalValue: 10,
  },
  {
    translations: {
      [Language.English]: 'Major seventh',
      [Language.French]: 'Septième majeure',
      [Language.Spanish]: 'Séptima mayor',
      [Language.German]: 'Große Septime',
    },
    intervalValue: 11,
  },
  {
    translations: {
      [Language.English]: 'Octave',
      [Language.French]: 'Octave',
      [Language.Spanish]: 'Octava',
      [Language.German]: 'Oktave',
    },
    intervalValue: 12,
  },
];

export interface Interval {
  translations: {
    [key in Language]: string;
  };
  intervalValue: number;
}

export function getIntervalName(index: number, language: Language): string {
  // Fallback to English if the selected language is not available
  return (
    INTERVALS[index].translations[language] ||
    INTERVALS[index].translations[Language.English]
  );
}
