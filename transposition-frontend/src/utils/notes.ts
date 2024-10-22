export const REDUCED_NOTES: Note[] = [
    { romance: 'do', english: 'C', german: 'c' },
    { romance: 'ré', english: 'D', german: 'd' },
    { romance: 'mi', english: 'E', german: 'e' },
    { romance: 'fa', english: 'F', german: 'f' },
    { romance: 'sol', english: 'G', german: 'g' },
    { romance: 'la', english: 'A', german: 'a' },
    { romance: 'si', english: 'B', german: 'h' },
];

export const NOTES: Note[] = [
    { romance: 'do', english: 'C', german: 'c' },
    { romance: 'do♯ / ré♭', english: 'C♯ / D♭', german: 'cis / des' },
    { romance: 'ré', english: 'D', german: 'd' },
    { romance: 'ré♯ / mi♭', english: 'D♯ / E♭', german: 'dis / es' },
    { romance: 'mi', english: 'E', german: 'e' },
    { romance: 'fa', english: 'F', german: 'f' },
    { romance: 'fa♯ / sol♭', english: 'F♯ / G♭', german: 'fis / ges' },
    { romance: 'sol', english: 'G', german: 'g' },
    { romance: 'sol♯ / la♭', english: 'G♯ / A♭', german: 'gis / as' },
    { romance: 'la', english: 'A', german: 'a' },
    { romance: 'la♯ / si♭', english: 'A♯ / B♭', german: 'ais / b' },
    { romance: 'si', english: 'B', german: 'h' },
];

export const MAJOR_SCALES: Note[] = [
    { romance: 'do', english: 'C', german: 'c' },
    { romance: 'ré♭', english: 'D♭', german: 'des' },
    { romance: 'ré', english: 'D', german: 'd' },
    { romance: 'mi♭', english: 'E♭', german: 'es' },
    { romance: 'mi', english: 'E', german: 'e' },
    { romance: 'fa', english: 'F', german: 'f' },
    { romance: 'fa♯', english: 'F♯', german: 'fis' },
    { romance: 'sol', english: 'G', german: 'g' },
    { romance: 'la♭', english: 'A♭', german: 'as' },
    { romance: 'la', english: 'A', german: 'a' },
    { romance: 'si♭', english: 'B♭', german: 'b' },
    { romance: 'si', english: 'B', german: 'h' },
];

export const MINOR_SCALES: Note[] = [
    { romance: 'do', english: 'C', german: 'c' },
    { romance: 'do♯', english: 'C♯', german: 'cis' },
    { romance: 'ré', english: 'D', german: 'd' },
    { romance: 'ré♯', english: 'D♯', german: 'dis' },
    { romance: 'mi', english: 'E', german: 'e' },
    { romance: 'fa', english: 'F', german: 'f' },
    { romance: 'fa♯', english: 'F♯', german: 'fis' },
    { romance: 'sol', english: 'G', german: 'g' },
    { romance: 'sol♯', english: 'G♯', german: 'gis' },
    { romance: 'la', english: 'A', german: 'a' },
    { romance: 'si♭', english: 'B♭', german: 'b' },
    { romance: 'si', english: 'B', german: 'h' },
];

export const SCALES: Note[] = [
    { romance: 'do', english: 'C', german: 'c' },
    { romance: 'do♯', english: 'C♯', german: 'cis' },
    { romance: 'ré♭', english: 'D♭', german: 'des' },
    { romance: 'ré', english: 'D', german: 'd' },
    { romance: 'ré♯', english: 'D♯', german: 'dis' },
    { romance: 'mi♭', english: 'E♭', german: 'es' },
    { romance: 'mi', english: 'E', german: 'e' },
    { romance: 'fa', english: 'F', german: 'f' },
    { romance: 'fa♯', english: 'F♯', german: 'fis' },
    { romance: 'sol♭', english: 'G♭', german: 'ges' },
    { romance: 'sol', english: 'G', german: 'g' },
    { romance: 'sol♯', english: 'G♯', german: 'gis' },
    { romance: 'la♭', english: 'A♭', german: 'as' },
    { romance: 'la', english: 'A', german: 'a' },
    { romance: 'la♯', english: 'A♯', german: 'ais' },
    { romance: 'si♭', english: 'B♭', german: 'b' },
    { romance: 'si', english: 'B', german: 'h' },
]

export const CIRCLE_OF_FIFTH_MAJOR_SUITE = [
    0, // c
    7, // c#
    7, // db
    2, // d
    9, // d#
    9, // eb
    4, // e
    11, // f
    6, // f#
    6, // gb
    1, // g
    8, // g#
    8, // ab
    3, // a
    10, // a#
    10, // bb
    5, // b
];

export interface Note {
    romance: string;
    english: string;
    german: string;
}

export function getNote(
    index: number,
    notation: keyof Note,
    usedScale?: Note[]
) {
    if (usedScale) {
        return usedScale[index][`${notation}`];
    }
    return NOTES[index][`${notation}`];
}

export const FLAT_LIST: number[] = [
    6, // si
    2, // mi
    5, // la
    1, // ré
    4, // sol
    0, // do
    3, // fa
    6, // si
    2, // mi
    5, // la
    1, // ré
    4, // sol
    0, // do
    3, // fa
];

export const SHARP_LIST: number[] = [
    3, //fa
    0, // do
    4, // sol
    1, // ré
    5, // la
    2, // mi
    6, // si
    3, //fa
    0, // do
    4, // sol
    1, // ré
    5, // la
    2, // mi
    6, // si
];
