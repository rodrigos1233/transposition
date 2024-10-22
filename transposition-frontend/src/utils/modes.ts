import { Language } from "../hooks/useTranslation";

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
            [Language.French]: 'Dorian',
            [Language.Spanish]: 'Dorian',
            [Language.German]: 'Dorian',
        },
        modePosition: -2,
    },
    {
        translations: {
            [Language.English]: 'Phrygian',
            [Language.French]: 'Phrygian',
            [Language.Spanish]: 'Phrygian',
            [Language.German]: 'Phrygian',
        },
        modePosition: -4,
    },
    {
        translations: {
            [Language.English]: 'Lydian',
            [Language.French]: 'Lydien',
            [Language.Spanish]: 'Lydian',
            [Language.German]: 'Lydian',
        },
        modePosition: 1,
    },
    {
        translations: {
            [Language.English]: 'Mixolydian',
            [Language.French]: 'Mixolydien',
            [Language.Spanish]: 'Mixolídia',
            [Language.German]: 'Mixolydian',
        },
        modePosition: -1,
    },
    {
        translations: {
            [Language.English]: 'Locrian',
            [Language.French]: 'Locrien',
            [Language.Spanish]: 'Locrian',
            [Language.German]: 'Locrian',
        },
        modePosition: -5,
    },
];

export function getModeName(index: number, language: Language): string {
    // Fallback to English if the selected language is not available
    return MODES[index].translations[language] || MODES[index].translations[Language.English];
}