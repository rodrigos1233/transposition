export const NOTES: Note[] = [
    { romance: 'do', english: 'C' },
    { romance: 'do♯ / ré♭', english: 'C♯ / D♭' },
    { romance: 'ré', english: 'D' },
    { romance: 'ré♯ / si♭', english: 'D♯ / E♭' },
    { romance: 'mi', english: 'E' },
    { romance: 'fa', english: 'F' },
    { romance: 'fa♯ / sol♭', english: 'F♯ / G♭' },
    { romance: 'sol', english: 'G' },
    { romance: 'sol♯ / la♭', english: 'G♯ / A♭' },
    { romance: 'la', english: 'A' },
    { romance: 'la♯ / si♭', english: 'A♯ / B♭' },
    { romance: 'si', english: 'B' },
];

export interface Note {
    romance: string;
    english: string;
}

export function getNote(index: number, notation: keyof Note) {
    return NOTES[index][`${notation}`];
}
