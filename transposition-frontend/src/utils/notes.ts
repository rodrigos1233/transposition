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

export interface Note {
    romance: string;
    english: string;
    german: string;
}

export function getNote(index: number, notation: keyof Note) {
    return NOTES[index][`${notation}`];
}

export const FLAT_LIST: number[] = [
    11, // si
    4, // mi
    9, // la
    2, // ré
    7, // sol
    0, // do
    5, //fa
];

export const SHARP_LIST: number[] = FLAT_LIST.reverse();
