import { CIRCLE_OF_FIFTH_MAJOR_SUITE } from './notes';
import { MODES } from './modes';

const enharmonicGroups: { [key: number]: number } = {
    0: 0, // C
    1: 1, // C♯ is equivalent to D♭
    2: 1, // D♭ is equivalent to C♯
    3: 2, // D
    4: 3, // D♯ is equivalent to E♭
    5: 3, // E♭ is equivalent to D♯
    6: 4, // E
    7: 5, // F
    8: 6, // F♯ is equivalent to G♭
    9: 6, // G♭ is equivalent to F♯
    10: 7, // G
    11: 8, // G♯ is equivalent to A♭
    12: 8, // A♭ is equivalent to G♯
    13: 9, // A
    14: 10, // A♯ is equivalent to B♭
    15: 10, // B♭ is equivalent to A♯
    16: 11, // B
};

export const reverseEnharmonicGroups: { [key: number]: number[] } = {
    0: [0], // C
    1: [1, 2], // C♯ / D♭
    2: [3], // D
    3: [4, 5], // D♯ / E♭
    4: [6], // E
    5: [7], // F
    6: [8, 9], // F♯ / G♭
    7: [10], // G
    8: [11, 12], // G♯ / A♭
    9: [13], // A
    10: [14, 15], // A♯ / B♭
    11: [16], // B
};

export function transposer(
    originNote: number,
    interval: number,
    direction: 'up' | 'down'
): [number, number[]] {
    let transposedNote =
        direction === 'up' ? originNote + interval : originNote - interval;

    // Wrap the note within octave limits
    transposedNote = ((transposedNote % 12) + 12) % 12;

    const reversedEnharmonicGroupNotes =
        reverseEnharmonicGroups[transposedNote];

    return [transposedNote, reversedEnharmonicGroupNotes];
}

export function crossInstrumentsTransposer(
    originNote: number,
    originKey: number,
    targetKey: number
): [number, number[]] {
    const direction = targetKey > originKey ? 'down' : 'up';
    const keyDifference = Math.abs(originKey - targetKey);

    return transposer(originNote, keyDifference, direction);
}

export function enharmonicGroupTransposer(originNote: number) {
    return enharmonicGroups[originNote];
}

export function enharmonicGroupTransposerReverse(
    originNote: number,
    mode: number
) {
    const possibleTargetNotes = reverseEnharmonicGroups[originNote];

    if (possibleTargetNotes.length === 1) {
        return possibleTargetNotes[0];
    }

    let targetNote = possibleTargetNotes[0];

    if (possibleTargetNotes.length > 1) {
        let position = CIRCLE_OF_FIFTH_MAJOR_SUITE[possibleTargetNotes[0]];

        if (mode !== 0) {
            position += MODES[mode].modePosition;

            if (position < 0) {
                position += 12;
            }
        }

        const alteration1 = Math.abs(12 - position);
        const alteration2 = position;

        // Select the note with the smallest alteration
        if (alteration1 < alteration2) {
            targetNote = possibleTargetNotes[1];
        }
    }

    return targetNote;
}

export function scaleTransposer(
    originStartNote: number,
    interval: number,
    mode: number,
    direction: 'up' | 'down'
) {
    let actualNote = enharmonicGroupTransposer(originStartNote);

    let transposedNote =
        direction === 'up' ? actualNote + interval : actualNote - interval;

    // Wrap the note within octave limits
    if (transposedNote > 11) {
        transposedNote = transposedNote - 12;
    }
    if (transposedNote < 0) {
        transposedNote = transposedNote + 12;
    }

    return enharmonicGroupTransposerReverse(transposedNote, mode);
}

export function scaleCrossInstrumentsTransposer(
    originNote: number,
    originKey: number,
    targetKey: number,
    mode: number
) {
    const direction = targetKey > originKey ? 'down' : 'up';
    const keyDifference = Math.abs(originKey - targetKey);

    return scaleTransposer(originNote, keyDifference, mode, direction);
}
