import {
  resolveChromaticClick,
  resolveScaleClick,
  reverseNoteFromTarget,
  reverseScaleFromTarget,
} from './staffClickResolver';
import {
  crossInstrumentsTransposer,
  transposer,
  enharmonicGroupTransposer,
  scaleTransposer,
  scaleCrossInstrumentsTransposer,
} from './transposer';

describe('resolveChromaticClick', () => {
  it('should return natural notes on first click', () => {
    expect(resolveChromaticClick(0, 1)).toBe(0);  // C
    expect(resolveChromaticClick(1, 1)).toBe(2);  // D
    expect(resolveChromaticClick(2, 1)).toBe(4);  // E
    expect(resolveChromaticClick(3, 1)).toBe(5);  // F
    expect(resolveChromaticClick(4, 1)).toBe(7);  // G
    expect(resolveChromaticClick(5, 1)).toBe(9);  // A
    expect(resolveChromaticClick(6, 1)).toBe(11); // B
  });

  it('should cycle to sharps/flats on second click', () => {
    expect(resolveChromaticClick(0, 2)).toBe(1);  // C#/Db
    expect(resolveChromaticClick(1, 2)).toBe(3);  // D#/Eb
    expect(resolveChromaticClick(3, 2)).toBe(6);  // F#/Gb
    expect(resolveChromaticClick(4, 2)).toBe(8);  // G#/Ab
    expect(resolveChromaticClick(5, 2)).toBe(10); // A#/Bb
  });

  it('should return E and B with no alteration cycling', () => {
    expect(resolveChromaticClick(2, 1)).toBe(4);  // E
    expect(resolveChromaticClick(2, 2)).toBe(4);  // E (wraps)
    expect(resolveChromaticClick(6, 1)).toBe(11); // B
    expect(resolveChromaticClick(6, 2)).toBe(11); // B (wraps)
  });

  it('should wrap back on third click for positions with 2 options', () => {
    expect(resolveChromaticClick(0, 3)).toBe(0); // C again
    expect(resolveChromaticClick(1, 3)).toBe(2); // D again
  });
});

describe('resolveScaleClick', () => {
  it('should return natural SCALES indices on first click', () => {
    expect(resolveScaleClick(0, 1)).toBe(0);  // C
    expect(resolveScaleClick(1, 1)).toBe(3);  // D
    expect(resolveScaleClick(2, 1)).toBe(6);  // E
    expect(resolveScaleClick(3, 1)).toBe(7);  // F
    expect(resolveScaleClick(4, 1)).toBe(10); // G
    expect(resolveScaleClick(5, 1)).toBe(13); // A
    expect(resolveScaleClick(6, 1)).toBe(16); // B
  });

  it('should cycle through enharmonics on subsequent clicks', () => {
    // D has 3 options: D(3) → D#(4) → Db(2)
    expect(resolveScaleClick(1, 1)).toBe(3);  // D
    expect(resolveScaleClick(1, 2)).toBe(4);  // D#
    expect(resolveScaleClick(1, 3)).toBe(2);  // Db

    // G has 3 options: G(10) → G#(11) → Gb(9)
    expect(resolveScaleClick(4, 1)).toBe(10); // G
    expect(resolveScaleClick(4, 2)).toBe(11); // G#
    expect(resolveScaleClick(4, 3)).toBe(9);  // Gb
  });
});

describe('reverseNoteFromTarget — key mode roundtrip', () => {
  it('should roundtrip origin → target → origin for all notes and key pairs', () => {
    for (let note = 0; note <= 11; note++) {
      for (let fromKey = 0; fromKey <= 11; fromKey++) {
        for (let toKey = 0; toKey <= 11; toKey++) {
          const [target] = crossInstrumentsTransposer(note, fromKey, toKey);
          const origin = reverseNoteFromTarget(
            target, 'key', fromKey, toKey, 0, 'up'
          );
          expect(origin).toBe(note);
        }
      }
    }
  });
});

describe('reverseNoteFromTarget — interval mode roundtrip', () => {
  it('should roundtrip for all notes and intervals (up)', () => {
    for (let note = 0; note <= 11; note++) {
      for (let interval = 0; interval <= 12; interval++) {
        const [target] = transposer(note, interval, 'up');
        const origin = reverseNoteFromTarget(
          target, 'interval', 0, 0, interval, 'up'
        );
        expect(origin).toBe(note);
      }
    }
  });

  it('should roundtrip for all notes and intervals (down)', () => {
    for (let note = 0; note <= 11; note++) {
      for (let interval = 0; interval <= 12; interval++) {
        const [target] = transposer(note, interval, 'down');
        const origin = reverseNoteFromTarget(
          target, 'interval', 0, 0, interval, 'down'
        );
        expect(origin).toBe(note);
      }
    }
  });
});

describe('reverseScaleFromTarget — key mode roundtrip', () => {
  it('should roundtrip origin → target → origin for modes 0 and 1', () => {
    for (const mode of [0, 1]) {
      for (let scale = 0; scale <= 16; scale++) {
        for (let fromKey = 0; fromKey <= 11; fromKey++) {
          for (let toKey = 0; toKey <= 11; toKey++) {
            const target = scaleCrossInstrumentsTransposer(
              scale, fromKey, toKey, mode
            );
            const reversed = reverseScaleFromTarget(
              target, 'key', fromKey, toKey, 0, mode, 'up'
            );
            // They should be in the same enharmonic group
            expect(enharmonicGroupTransposer(reversed)).toBe(
              enharmonicGroupTransposer(scale)
            );
          }
        }
      }
    }
  });
});

describe('reverseScaleFromTarget — interval mode roundtrip', () => {
  it('should roundtrip for common intervals (up)', () => {
    for (const mode of [0, 1]) {
      for (let scale = 0; scale <= 16; scale++) {
        for (const interval of [0, 1, 5, 7, 12]) {
          const target = scaleTransposer(scale, interval, mode, 'up');
          const reversed = reverseScaleFromTarget(
            target, 'interval', 0, 0, interval, mode, 'up'
          );
          expect(enharmonicGroupTransposer(reversed)).toBe(
            enharmonicGroupTransposer(scale)
          );
        }
      }
    }
  });

  it('should roundtrip for common intervals (down)', () => {
    for (const mode of [0, 1]) {
      for (let scale = 0; scale <= 16; scale++) {
        for (const interval of [0, 1, 5, 7, 12]) {
          const target = scaleTransposer(scale, interval, mode, 'down');
          const reversed = reverseScaleFromTarget(
            target, 'interval', 0, 0, interval, mode, 'down'
          );
          expect(enharmonicGroupTransposer(reversed)).toBe(
            enharmonicGroupTransposer(scale)
          );
        }
      }
    }
  });
});

describe('boundary cases', () => {
  it('unison (interval=0) should return the same note', () => {
    const origin = reverseNoteFromTarget(5, 'interval', 0, 0, 0, 'up');
    expect(origin).toBe(5);
  });

  it('octave (interval=12) should return the same note', () => {
    for (let note = 0; note <= 11; note++) {
      const [target] = transposer(note, 12, 'up');
      const origin = reverseNoteFromTarget(target, 'interval', 0, 0, 12, 'up');
      expect(origin).toBe(note);
    }
  });
});
