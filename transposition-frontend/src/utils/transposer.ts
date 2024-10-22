import {CIRCLE_OF_FIFTH_MAJOR_SUITE} from "./notes";

export function transposer(
    originNote: number,
    originKey: number,
    targetKey: number
) {
    let keyDifference = originKey - targetKey;

    let targetNote = originNote + keyDifference;

    if (targetNote > 11) {
        targetNote = targetNote - 12;
    }

    if (targetNote < 0) {
        targetNote = targetNote + 12;
    }

    return targetNote;
}

export function scaleTransposer(
    originNote: number,
    originKey: number,
    targetKey: number,
    mode: 'major' | 'minor'
) {
    let keyDifference = originKey - targetKey;

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
        16: 11 // B
    };

    const reverseEnharmonicGroups: { [key: number]: number[] } = {
        0: [0],       // C
        1: [1, 2],    // C♯ / D♭
        2: [3],       // D
        3: [4, 5],    // D♯ / E♭
        4: [6],       // E
        5: [7],       // F
        6: [8, 9],    // F♯ / G♭
        7: [10],      // G
        8: [11, 12],  // G♯ / A♭
        9: [13],      // A
        10: [14, 15], // A♯ / B♭
        11: [16]      // B
    };

    // If the note is part of an enharmonic group, return the index of the group
    const actualNote = enharmonicGroups[originNote];

    console.log({actualNote, originNote})

    let actualTargetNote = actualNote + keyDifference;

    if (actualTargetNote > 11) {
        actualTargetNote = actualTargetNote - 12;
    }

    if (actualTargetNote < 0) {
        actualTargetNote = actualTargetNote + 12;
    }

    const possibleTargetNotes = reverseEnharmonicGroups[actualTargetNote];

    if (possibleTargetNotes.length === 1) {
        return possibleTargetNotes[0];
    }

    let targetNote = possibleTargetNotes[0];

    if (possibleTargetNotes.length > 1) {
        let position = CIRCLE_OF_FIFTH_MAJOR_SUITE[possibleTargetNotes[0]];

        if (mode === 'minor') {
            position -= 3;


            if (position < 0) {
                position += 12;
            }
        }

        const alteration1 = Math.abs(12 - position);
        const alteration2 = position;

        // Select the note with the smallest alteration
        targetNote = Math.min(alteration1, alteration2);
    }

    return targetNote;
}