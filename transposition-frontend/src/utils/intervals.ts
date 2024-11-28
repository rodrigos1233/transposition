import { Language } from '../hooks/useTranslation';

export const INTERVALS: Interval[] = [
    {
        translations: {
            [Language.English]: 'Perfect unison',
            [Language.French]: 'Unison parfait',
            [Language.Spanish]: 'Unísono',
            [Language.German]: 'Vollständiger Ton',
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
            [Language.Spanish]: 'Tercer menor',
            [Language.German]: 'Kleine Terz',
        },
        intervalValue: 3,
    },
    {
        translations: {
            [Language.English]: 'Major third',
            [Language.French]: 'Tierce majeure',
            [Language.Spanish]: 'Tercer mayor',
            [Language.German]: 'Großer Terz',
        },
        intervalValue: 4,
    },
    {
        translations: {
            [Language.English]: 'Perfect fourth',
            [Language.French]: 'Quarte',
            [Language.Spanish]: 'Cuarto menor',
            [Language.German]: 'Cuarta',
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
            [Language.French]: 'Quinte',
            [Language.Spanish]: 'Quinto menor',
            [Language.German]: 'Quinta',
        },
        intervalValue: 7,
    },
    {
        translations: {
            [Language.English]: 'Minor sixth',
            [Language.French]: 'Sixthe mineure',
            [Language.Spanish]: 'Sexto menor',
            [Language.German]: 'Kleine Sechs',
        },
        intervalValue: 8,
    },
    {
        translations: {
            [Language.English]: 'Major sixth',
            [Language.French]: 'Sixthe majeure',
            [Language.Spanish]: 'Sexto mayor',
            [Language.German]: 'Große Sechs',
        },
        intervalValue: 9,
    },
    {
        translations: {
            [Language.English]: 'Minor seventh',
            [Language.French]: 'Septieme mineure',
            [Language.Spanish]: 'Séptima menor',
            [Language.German]: 'Kleine Sieben',
        },
        intervalValue: 10,
    },
    {
        translations: {
            [Language.English]: 'Major seventh',
            [Language.French]: 'Septieme majeure',
            [Language.Spanish]: 'Séptima mayor',
            [Language.German]: 'Große Sieben',
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
