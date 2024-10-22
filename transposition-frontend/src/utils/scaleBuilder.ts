import {
    FLAT_LIST,
    getNote,
    MAJOR_SCALES,
    MINOR_SCALES,
    Note,
    REDUCED_NOTES,
    SHARP_LIST,
} from './notes';

const circleOfFifthMajorSuite = [
    0, // do
    7, // sol
    2, // ré
    9, // la
    4, // mi
    11, // si
    6, // sol b / fa #
    1, // ré b
    8, // la b
    3, // mi b
    10, // si b
    5, //fa
];

const notesMajorSuite = [2, 2, 1, 2, 2, 2, 1];
const notesMinorSuite = [...notesMajorSuite.slice(5), ...notesMajorSuite.slice(0, 5)];

export function scaleBuilder(
    startNote: number,
    mode: 'major' | 'minor'
): Scale {
    let positionInCircleOfFifth = circleOfFifthMajorSuite.indexOf(startNote);

    if (mode === 'minor') {
        positionInCircleOfFifth -= 3;

        if (positionInCircleOfFifth < 0) {
            positionInCircleOfFifth += 12;
        }
    }

    const reducedNotesCopy = REDUCED_NOTES.map((reducedNote) => ({
        ...reducedNote
    }));

    const startingNoteName = getNote(
        startNote,
        'english',
        mode === 'major' ? MAJOR_SCALES : MINOR_SCALES
    ).substring(0, 1);

    const startingReducedNote = reducedNotesCopy
        .map((reducedNote: { english: string }) => reducedNote.english)
        .indexOf(startingNoteName);

    let alteration: 'flat' | 'sharp' | null = null;
    let notes: number[] = [];
    let reducedNotes: number[] = [];
    let alteredNotes: number[] = [];

    const usedSuite = mode === 'major' ? notesMajorSuite : notesMinorSuite;

    let currentNote: number = startNote;
    let currentReducedNote: number = startingReducedNote;

    for (let i = 0; i < 8; i++) {
        currentNote = currentNote + (i > 0 ? usedSuite[i - 1] : 0);
        reducedNotes.push(currentReducedNote);
        currentReducedNote = currentReducedNote + 1;

        if (currentNote > 11) {
            currentNote -= 12;
        }

        if (currentReducedNote > 6) {
            currentReducedNote -= 7;
        }

        notes.push(currentNote);
    }

    if (positionInCircleOfFifth > 0 && positionInCircleOfFifth <= 6) {
        alteration = 'sharp';

        for (let i = 1; i <= positionInCircleOfFifth; i++) {
            alteredNotes.push(SHARP_LIST[i - 1]);
        }
    }

    if (positionInCircleOfFifth > 6) {
        alteration = 'flat';

        for (let i = 11; i >= positionInCircleOfFifth; i--) {
            alteredNotes.push(FLAT_LIST[-1 * i + 11]);
        }
    }

    const notesInScale: NoteInScale[] = [];

    for (const reducedNote of reducedNotes) {
        const note = { ...reducedNotesCopy[reducedNote] }; // Clone each note object

        if (!!alteration) {
            if (
                alteredNotes.includes(reducedNote) &&
                !(note.english.includes('♭') || note.english.includes('♯'))
            ) {
                note.english = `${note.english}${
                    alteration === 'flat' ? '♭' : '♯'
                }`;
                note.romance = `${note.romance}${
                    alteration === 'flat' ? '♭' : '♯'
                }`;
                note.german = `${note.german}${
                    alteration === 'flat' ? 'es' : 'is'
                }`;
            }

            //german exceptions
            if (note.german === 'hes') {
                note.german = 'b';
            }
            if (note.german === 'ees') {
                note.german = 'es';
            }
            if (note.german === 'aes') {
                note.german = 'as';
            }
        }

        notesInScale.push({ note });
    }

    const key = { alteration, alteredNotes };

    return { notes, notesInScale, key };
}

type Scale = {
    notes: number[];
    key: Key;
    notesInScale: NoteInScale[];
};

type Key = {
    alteration: 'flat' | 'sharp' | null;
    alteredNotes: number[];
};

type NoteInScale = {
    note: Note;
};
