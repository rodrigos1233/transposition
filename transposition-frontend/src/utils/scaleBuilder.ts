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

export function circleOfFifthModeShifter(
    modeIndex: number,
    positionInCircleOfFifth: number
) {
    const mode = MODES[modeIndex];

    if (modeIndex !== 0) {
        positionInCircleOfFifth += mode.modePosition;

        if (positionInCircleOfFifth < 0) {
            positionInCircleOfFifth += 12;
        }
    }

    return positionInCircleOfFifth;
}

export function startNotesFromCirclePosition(
    positionInCircleOfFifth: number,
    modeIndex: number
) {
    const mode = MODES[modeIndex];
    const circleOfFifthSuite = CIRCLE_OF_FIFTH_MAJOR_SUITE.map((position) => {
        position += mode.modePosition;
        if (position < 0) {
            position += 12;
        }
        if (position > 11) {
            position -= 12;
        }
        return position;
    });

    const startNotes = circleOfFifthSuite.reduce(
        (indexes: number[], value, index) => {
            if (value === positionInCircleOfFifth) {
                indexes.push(index);
            }
            return indexes;
        },
        []
    );

    return startNotes;
}

export function positionInCircleOfFifthDeterminer(
    noteIndex: number,
    modeIndex: number
) {
    let position = CIRCLE_OF_FIFTH_MAJOR_SUITE[noteIndex];

    position = circleOfFifthModeShifter(modeIndex, position);

    return position;
}

export function keySignatureBuilder(
    startNote: number,
    modeIndex: number,
    alterationFromStartNote?: 'flat' | 'sharp'
) {
    let alteredNotes: number[] = [];
    let doubleAlteredNotes: number[] = [];
    let alteration = alterationFromStartNote;

    const positionInCircleOfFifth = positionInCircleOfFifthDeterminer(
        startNote,
        modeIndex
    );

    if (!alterationFromStartNote) {
        if (positionInCircleOfFifth > 0 && positionInCircleOfFifth <= 6) {
            alteration = 'sharp';
        }

        if (positionInCircleOfFifth > 6) {
            alteration = 'flat';
        }
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

    const key = {
        alteration,
        alteredNotes,
        doubleAlteredNotes,
    };

    return key as Key;
}

export function getKeySignaturesForPositionInCircleOfFifth(
    circlePosition: number,
    modeIndex: number
): Key[] {
    const possibleStartNotes = startNotesFromCirclePosition(
        circlePosition,
        modeIndex
    );

    return possibleStartNotes.map((startNote) => {
        const startNoteName = getNote(startNote, 'english', SCALES);
        const alterationFromStartNote = startNoteName.includes('♭')
            ? 'flat'
            : startNoteName.includes('♯')
            ? 'sharp'
            : undefined;
        return keySignatureBuilder(
            startNote,
            modeIndex,
            alterationFromStartNote
        );
    });
}

export function scaleBuilder(startNote: number, modeIndex: number): Scale {
    const mode = MODES[modeIndex];

    const reducedNotesCopy = REDUCED_NOTES.map((reducedNote) => ({
        ...reducedNote,
    }));

    const startingNoteName = getNote(startNote, 'english', SCALES);

    const startingNoteNameReduced = startingNoteName.substring(0, 1);

    const startingReducedNote = reducedNotesCopy
        .map((reducedNote: { english: string }) => reducedNote.english)
        .indexOf(startingNoteNameReduced);

    let notes: number[] = [];
    let reducedNotes: number[] = [];

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

    const notesInScale: NoteInScale[] = [];

    const alterationFromStartNote = startingNoteName.includes('♭')
        ? 'flat'
        : startingNoteName.includes('♯')
        ? 'sharp'
        : undefined;

    const key = keySignatureBuilder(
        startNote,
        modeIndex,
        alterationFromStartNote
    );

    const { alteration, alteredNotes, doubleAlteredNotes } = key;

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
