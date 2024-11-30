import {
    enharmonicGroupTransposer,
    enharmonicGroupTransposerReverse,
    reverseEnharmonicGroups,
    scaleCrossInstrumentsTransposer,
    scaleTransposer,
    crossInstrumentsTransposer,
} from './transposer';

describe('Transposer', () => {
    it('Should return the correct transposed notes', () => {
        const result = crossInstrumentsTransposer(0, 0, 0);
        expect(result).toEqual([0, reverseEnharmonicGroups[0]]);
    });

    it('Should return the correct transposed notes for any n', () => {
        for (let n = 0; n <= 12; n++) {
            const result = crossInstrumentsTransposer(0, n, 0);
            expect(result).toEqual([n % 12, reverseEnharmonicGroups[n % 12]]);
        }
    });
});

describe('Enharmonic Group Transposer', () => {
    it('Should return the correct enharmonic group', () => {
        const result = crossInstrumentsTransposer(0, 0, 0);
        expect(result).toEqual([0, [0]]);
    });
});

// Test transposing notes with different `originKey` and `targetKey`
describe('Transposer - Key Variation', () => {
    it('should correctly transpose C to G', () => {
        const result = crossInstrumentsTransposer(0, 0, 7); // C to G key
        expect(result).toEqual([5, reverseEnharmonicGroups[5]]); // Expect G to be the target
    });
});

// Test enharmonic group transposer for reverse situations
describe('Enharmonic Group Transposer Reverse - Mode Variation', () => {
    it('should handle enharmonic equivalents correctly in mode 1', () => {
        const result = enharmonicGroupTransposerReverse(8, 1); // Handling G♯ / A♭
        expect(result).toBe(11); // Expected one of the enharmonic equivalents
    });
});

// Test scale transposer with modes
describe('Scale Transposer Cross instruments', () => {
    it('should return correct transposed scales for mode 0', () => {
        const result = scaleCrossInstrumentsTransposer(0, 0, 7, 0); // C to G in major mode
        expect(result).toBe(7); // Expect G
    });
});
