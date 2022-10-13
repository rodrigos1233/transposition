export const NOTES: Note[] = [
    { romance: 'do', english: 'C', german: 'c' },
    { romance: 'do♯ / ré♭', english: 'C♯ / D♭', german: 'cis / des' },
    { romance: 'ré', english: 'D', german: 'd' },
    { romance: 'ré♯ / si♭', english: 'D♯ / E♭', german: 'dis / es' },
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

export function getNote(index: number, notation: Extract<keyof Note, string>) {
    return NOTES[index][`${notation}`];
}
