import {
    circleOfFifthModeShifter,
    keySignatureBuilder,
    scaleBuilder,
    startNotesFromCirclePosition,
} from './scaleBuilder';
import { MODES } from './modes';

describe('circleOfFifthModeShifter', () => {
    it('does not shift for Major mode (modeIndex = 0)', () => {
        expect(circleOfFifthModeShifter(0, 0)).toBe(0);
        expect(circleOfFifthModeShifter(0, 5)).toBe(5);
    });

    it('shifts correctly for Minor mode', () => {
        const minorPosition = MODES[1].modePosition;
        expect(circleOfFifthModeShifter(1, 0)).toBe(
            (0 + minorPosition + 12) % 12
        );
        expect(circleOfFifthModeShifter(1, 5)).toBe(
            (5 + minorPosition + 12) % 12
        );
    });

    it('shifts correctly for Dorian mode', () => {
        const dorianPosition = MODES[2].modePosition;
        expect(circleOfFifthModeShifter(2, 0)).toBe(
            (0 + dorianPosition + 12) % 12
        );
        expect(circleOfFifthModeShifter(2, 5)).toBe(
            (5 + dorianPosition + 12) % 12
        );
    });
});

describe('keySignatureBuilder', () => {
    it('creates correct signature for C major', () => {
        expect(keySignatureBuilder(0, 0)).toEqual({
            alteration: undefined,
            alteredNotes: [],
            doubleAlteredNotes: [],
        });
    });

    it('creates correct signature for G major', () => {
        expect(keySignatureBuilder(10, 0)).toEqual({
            alteration: 'sharp',
            alteredNotes: [3],
            doubleAlteredNotes: [],
        });
    });

    it('creates correct signature for F major', () => {
        expect(keySignatureBuilder(7, 0)).toEqual({
            alteration: 'flat',
            alteredNotes: [6],
            doubleAlteredNotes: [],
        });
    });

    it('creates correct signature for A minor', () => {
        expect(keySignatureBuilder(13, 1)).toEqual({
            alteration: undefined,
            alteredNotes: [],
            doubleAlteredNotes: [],
        });
    });
});

describe('scaleBuilder', () => {
    it('builds C major scale', () => {
        const scale = scaleBuilder(0, 0); // 0 should represent C in the `CIRCLE_OF_FIFTH_MAJOR_SUITE`

        // C major scale in indices: C D E F G A B C
        expect(scale.reducedNotes).toEqual([0, 1, 2, 3, 4, 5, 6, 0]);

        console.log(scale);

        // Since C major has no sharps or flats
        expect(scale.key.alteration).toEqual(undefined);
        expect(scale.key.alteredNotes).toEqual([]);
        expect(scale.key.doubleAlteredNotes).toEqual([]);
    });

    it('builds A minor scale (Aeolian mode)', () => {
        const scale = scaleBuilder(13, 1); // 9 represents A, and mode 1 is Minor

        console.log(scale);

        // A minor scale in indices: A B C D E F G A
        expect(scale.reducedNotes).toEqual([5, 6, 0, 1, 2, 3, 4, 5]);

        // Since A minor is the relative minor of C major (no sharps or flats)
        expect(scale.key.alteration).toEqual(undefined);
        expect(scale.key.alteredNotes).toEqual([]);
        expect(scale.key.doubleAlteredNotes).toEqual([]);
    });
});
