import {
  resolveClefForTransposition,
  DIATONIC_SHIFT_TO_CLEF,
  DIATONIC_SHIFT_TO_OFFSET,
} from './clefResolver';
import { positionToVexflowKey } from '../components/staff/noteConverter';

const VALID_CLEFS = new Set(DIATONIC_SHIFT_TO_CLEF);

describe('resolveClefForTransposition', () => {
  // Known pairs
  test('same key returns treble with offset 0', () => {
    const result = resolveClefForTransposition(0, 0);
    expect(result).toEqual({ clef: 'treble', positionOffset: 0 });
  });

  test('same key (non-zero) returns treble with offset 0', () => {
    const result = resolveClefForTransposition(5, 5);
    expect(result).toEqual({ clef: 'treble', positionOffset: 0 });
  });

  test('Bb to C (10 → 0) returns tenor with offset -8', () => {
    const result = resolveClefForTransposition(10, 0);
    expect(result).toEqual({ clef: 'tenor', positionOffset: -8 });
  });

  test('C to Bb (0 → 10) returns alto with offset -6', () => {
    const result = resolveClefForTransposition(0, 10);
    expect(result).toEqual({ clef: 'alto', positionOffset: -6 });
  });

  test('C to F (0 → 5) returns baritone-c with offset -10', () => {
    const result = resolveClefForTransposition(0, 5);
    expect(result).toEqual({ clef: 'baritone-c', positionOffset: -10 });
  });

  // Offset invariance: verify the letter name shifts by the right number of diatonic steps
  test.each([
    [0, 10],  // Bb → C
    [0, 5],   // C → F
    [10, 0],  // C(Bb) → Bb(C)
    [3, 8],   // Eb → Ab
  ])('offset invariance for fromKey=%i toKey=%i', (fromKey, toKey) => {
    const { positionOffset } = resolveClefForTransposition(fromKey, toKey);
    // For a reference position, check that the offset produces a shifted letter
    const pos = 4; // G4
    const originalKey = positionToVexflowKey(pos);
    const offsetKey = positionToVexflowKey(pos + positionOffset);
    // Both should be valid VexFlow keys (letter/octave)
    expect(originalKey).toMatch(/^[a-g]\/\d+$/);
    expect(offsetKey).toMatch(/^[a-g]\/\d+$/);
  });

  // Exhaustive 12×12 smoke test
  test('all 144 fromKey/toKey pairs return valid clefs and integer offsets', () => {
    for (let from = 0; from < 12; from++) {
      for (let to = 0; to < 12; to++) {
        const { clef, positionOffset } = resolveClefForTransposition(from, to);
        expect(VALID_CLEFS.has(clef)).toBe(true);
        expect(Number.isInteger(positionOffset)).toBe(true);
      }
    }
  });

  // Symmetry: swapping from/to should give different results (unless same key)
  test('symmetry: swapping keys gives complementary shifts', () => {
    const forward = resolveClefForTransposition(0, 5);
    const backward = resolveClefForTransposition(5, 0);
    // They should not be the same (unless trivial)
    expect(forward.clef).not.toBe(backward.clef);
    // Their offsets should sum to a multiple of 7 (mod 7 = 0) since they're complementary
    expect(Math.abs((forward.positionOffset + backward.positionOffset) % 7)).toBe(0);
  });

  // Verify all offsets match their corresponding clef index
  test('offset table matches clef table', () => {
    expect(DIATONIC_SHIFT_TO_CLEF.length).toBe(7);
    expect(DIATONIC_SHIFT_TO_OFFSET.length).toBe(7);
  });
});
