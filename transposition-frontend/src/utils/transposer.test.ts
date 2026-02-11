import {
  enharmonicGroupTransposer,
  enharmonicGroupTransposerReverse,
  reverseEnharmonicGroups,
  scaleCrossInstrumentsTransposer,
  crossInstrumentsTransposer,
  scaleTransposer,
  transposer,
} from './transposer';
import { SCALES } from './notes';

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

describe('scaleTransposer', () => {
  it('should return a valid SCALES index for all origin keys and intervals', () => {
    const maxScaleIndex = SCALES.length - 1;
    const directions: ('up' | 'down')[] = ['up', 'down'];

    for (let originKey = 0; originKey <= maxScaleIndex; originKey++) {
      for (let interval = 0; interval <= 12; interval++) {
        for (const direction of directions) {
          const result = scaleTransposer(originKey, interval, 0, direction);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(maxScaleIndex);
          expect(SCALES[result]).toBeDefined();
        }
      }
    }
  });

  it('should handle C♯ down one octave (the bug case)', () => {
    const result = scaleTransposer(1, 12, 0, 'down'); // C♯ down octave
    expect(result).toBeGreaterThanOrEqual(0);
    expect(SCALES[result]).toBeDefined();
  });

  it('should handle D♭ down one octave', () => {
    const result = scaleTransposer(2, 12, 0, 'down'); // D♭ down octave
    expect(result).toBeGreaterThanOrEqual(0);
    expect(SCALES[result]).toBeDefined();
  });

  it('octave transposition should return the same enharmonic group', () => {
    for (let originKey = 0; originKey <= 16; originKey++) {
      const originGroup = enharmonicGroupTransposer(originKey);
      const upResult = scaleTransposer(originKey, 12, 0, 'up');
      const downResult = scaleTransposer(originKey, 12, 0, 'down');

      // Octave up/down should land in the same enharmonic group
      expect(enharmonicGroupTransposer(upResult)).toBe(originGroup);
      expect(enharmonicGroupTransposer(downResult)).toBe(originGroup);
    }
  });

  it('should return valid results for all modes', () => {
    const maxScaleIndex = SCALES.length - 1;

    for (let mode = 0; mode <= 6; mode++) {
      for (let originKey = 0; originKey <= maxScaleIndex; originKey++) {
        const result = scaleTransposer(originKey, 7, mode, 'up');
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(maxScaleIndex);
        expect(SCALES[result]).toBeDefined();
      }
    }
  });
});

describe('transposer - wrapping', () => {
  it('should always return a result in 0-11 range', () => {
    for (let note = 0; note <= 11; note++) {
      for (let interval = 0; interval <= 12; interval++) {
        const [upResult] = transposer(note, interval, 'up');
        const [downResult] = transposer(note, interval, 'down');

        expect(upResult).toBeGreaterThanOrEqual(0);
        expect(upResult).toBeLessThanOrEqual(11);
        expect(downResult).toBeGreaterThanOrEqual(0);
        expect(downResult).toBeLessThanOrEqual(11);
      }
    }
  });

  it('should always return valid enharmonic groups', () => {
    for (let note = 0; note <= 11; note++) {
      for (let interval = 0; interval <= 12; interval++) {
        const [, upGroups] = transposer(note, interval, 'up');
        const [, downGroups] = transposer(note, interval, 'down');

        expect(upGroups).toBeDefined();
        expect(upGroups.length).toBeGreaterThan(0);
        expect(downGroups).toBeDefined();
        expect(downGroups.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('enharmonicGroupTransposer', () => {
  it('should return a value in 0-11 for all SCALES indices', () => {
    for (let i = 0; i <= 16; i++) {
      const group = enharmonicGroupTransposer(i);
      expect(group).toBeGreaterThanOrEqual(0);
      expect(group).toBeLessThanOrEqual(11);
    }
  });

  it('enharmonic pairs should map to the same group', () => {
    expect(enharmonicGroupTransposer(1)).toBe(enharmonicGroupTransposer(2)); // C♯ = D♭
    expect(enharmonicGroupTransposer(4)).toBe(enharmonicGroupTransposer(5)); // D♯ = E♭
    expect(enharmonicGroupTransposer(8)).toBe(enharmonicGroupTransposer(9)); // F♯ = G♭
    expect(enharmonicGroupTransposer(11)).toBe(enharmonicGroupTransposer(12)); // G♯ = A♭
    expect(enharmonicGroupTransposer(14)).toBe(enharmonicGroupTransposer(15)); // A♯ = B♭
  });
});
