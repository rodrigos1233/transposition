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
  it('should return natural note when clicking a different position', () => {
    // currentNote is on a different position, so we get the natural
    expect(resolveChromaticClick(0, 7)).toBe(0);   // click C, current=G → C
    expect(resolveChromaticClick(1, 0)).toBe(2);   // click D, current=C → D
    expect(resolveChromaticClick(3, 9)).toBe(5);   // click F, current=A → F
    expect(resolveChromaticClick(4, 11)).toBe(7);  // click G, current=B → G
  });

  it('should advance to sharp when clicking the position of the current natural', () => {
    expect(resolveChromaticClick(0, 0)).toBe(1);   // C → C#
    expect(resolveChromaticClick(1, 2)).toBe(3);   // D → D#
    expect(resolveChromaticClick(3, 5)).toBe(6);   // F → F#
    expect(resolveChromaticClick(4, 7)).toBe(8);   // G → G#
    expect(resolveChromaticClick(5, 9)).toBe(10);  // A → A#
  });

  it('should cycle back to natural when clicking from the sharp', () => {
    expect(resolveChromaticClick(0, 1)).toBe(0);   // C# → C
    expect(resolveChromaticClick(1, 3)).toBe(2);   // D# → D
    expect(resolveChromaticClick(3, 6)).toBe(5);   // F# → F
    expect(resolveChromaticClick(4, 8)).toBe(7);   // G# → G
    expect(resolveChromaticClick(5, 10)).toBe(9);  // A# → A
  });

  it('should return E and B unchanged (no alteration cycling)', () => {
    expect(resolveChromaticClick(2, 4)).toBe(4);   // E → E (only option)
    expect(resolveChromaticClick(6, 11)).toBe(11); // B → B (only option)
  });

  it('should handle higher octave positions via modulo', () => {
    expect(resolveChromaticClick(7, 0)).toBe(1);   // position 7 = C (mod 7), C → C#
    expect(resolveChromaticClick(8, 2)).toBe(3);   // position 8 = D (mod 7), D → D#
  });
});

describe('resolveScaleClick', () => {
  it('should return natural SCALES index when clicking a different position', () => {
    expect(resolveScaleClick(0, 3)).toBe(0);   // click C, current=D → C
    expect(resolveScaleClick(1, 0)).toBe(3);   // click D, current=C → D
    expect(resolveScaleClick(2, 7)).toBe(6);   // click E, current=F → E
    expect(resolveScaleClick(3, 10)).toBe(7);  // click F, current=G → F
    expect(resolveScaleClick(4, 13)).toBe(10); // click G, current=A → G
    expect(resolveScaleClick(5, 0)).toBe(13);  // click A, current=C → A
    expect(resolveScaleClick(6, 0)).toBe(16);  // click B, current=C → B
  });

  it('should cycle through enharmonics for D (3 options: D→D#→Db)', () => {
    expect(resolveScaleClick(1, 3)).toBe(4);   // D → D#
    expect(resolveScaleClick(1, 4)).toBe(2);   // D# → Db
    expect(resolveScaleClick(1, 2)).toBe(3);   // Db → D
  });

  it('should cycle through enharmonics for G (3 options: G→G#→Gb)', () => {
    expect(resolveScaleClick(4, 10)).toBe(11); // G → G#
    expect(resolveScaleClick(4, 11)).toBe(9);  // G# → Gb
    expect(resolveScaleClick(4, 9)).toBe(10);  // Gb → G
  });

  it('should cycle through enharmonics for E (2 options: E→Eb)', () => {
    expect(resolveScaleClick(2, 6)).toBe(5);   // E → Eb
    expect(resolveScaleClick(2, 5)).toBe(6);   // Eb → E
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
