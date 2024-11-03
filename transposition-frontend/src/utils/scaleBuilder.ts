import {
    CIRCLE_OF_FIFTH_MAJOR_SUITE,
    FLAT_LIST,
    getNote,
    Note,
    REDUCED_NOTES,
    SCALES,
    SHARP_LIST,
} from './notes';
import { MODES } from './modes';

const reducedCircleOfFifthMajorSuite = [
    0, // c
    2, // d
    4, // e
    6, // f
    1, // g
    3, // a
    5, // b
];

const notesMajorSuite = [2, 2, 1, 2, 2, 2, 1];
const notesMinorSuite = [
    ...notesMajorSuite.slice(5),
    ...notesMajorSuite.slice(0, 5),
];

export function scaleBuilder(startNote: number, modeIndex: number): Scale {
    let positionInCircleOfFifth = CIRCLE_OF_FIFTH_MAJOR_SUITE[startNote];
    const mode = MODES[modeIndex];

    if (modeIndex !== 0) {
        positionInCircleOfFifth += mode.modePosition;

        if (positionInCircleOfFifth < 0) {
            positionInCircleOfFifth += 12;
        }
    }

    const reducedNotesCopy = REDUCED_NOTES.map((reducedNote) => ({
        ...reducedNote,
    }));

    const startingNoteName = getNote(startNote, 'english', SCALES);

    const startingNoteNameReduced = startingNoteName.substring(0, 1);

    const startingReducedNote = reducedNotesCopy
        .map((reducedNote: { english: string }) => reducedNote.english)
        .indexOf(startingNoteNameReduced);

    let alteration: 'flat' | 'sharp' | null = null;
    let notes: number[] = [];
    let reducedNotes: number[] = [];
    let alteredNotes: number[] = [];
    let doubleAlteredNotes: number[] = [];

    let modeShift = reducedCircleOfFifthMajorSuite.indexOf(
        Math.abs(mode.modePosition)
    );

    const usedSuite = [
        ...notesMajorSuite.slice(modeShift),
        ...notesMajorSuite.slice(0, modeShift),
    ];

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
    }

    if (positionInCircleOfFifth > 6) {
        alteration = 'flat';
    }

    if (startingNoteName.includes('♭')) {
        alteration = 'flat';
    }

    if (startingNoteName.includes('♯')) {
        alteration = 'sharp';
    }

    if (alteration === 'sharp') {
        for (let i = 1; i <= positionInCircleOfFifth; i++) {
            if (alteredNotes.includes(SHARP_LIST[i - 1])) {
                doubleAlteredNotes.push(SHARP_LIST[i - 1]);
            }

            alteredNotes.push(SHARP_LIST[i - 1]);
        }
    }

    if (alteration === 'flat') {
        for (let i = 11; i >= positionInCircleOfFifth; i--) {
            if (alteredNotes.includes(FLAT_LIST[-1 * i + 11])) {
                doubleAlteredNotes.push(FLAT_LIST[-1 * i + 11]);
            }
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
                if (doubleAlteredNotes.includes(reducedNote)) {
                    note.english = `${note.english}${
                        alteration === 'flat' ? '𝄫' : '𝄪'
                    }`;
                    note.romance = `${note.romance}${
                        alteration === 'flat' ? '𝄫' : '𝄪'
                    }`;
                    note.german = `${note.german}${
                        alteration === 'flat' ? 'eses' : 'isis'
                    }`;
                } else {
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
            if (note.german === 'heses') {
                note.german = 'bes';
            }
            if (note.german === 'eeses') {
                note.german = 'eses';
            }
            if (note.german === 'aeses') {
                note.german = 'ases';
            }
        }

        notesInScale.push({ note });
    }

    const key = {
        alteration,
        alteredNotes,
        doubleAlteredNotes,
    };

    return { notes, notesInScale, key, reducedNotes };
}

type Scale = {
    notes: number[];
    key: Key;
    notesInScale: NoteInScale[];
    reducedNotes: number[];
};

export type Key = {
    alteration: 'flat' | 'sharp' | null;
    alteredNotes: number[];
    doubleAlteredNotes: number[];
};

export type NoteInScale = {
    note: Note;
};
