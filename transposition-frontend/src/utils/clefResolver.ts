export type ClefInfo = {
  clef: string;
  positionOffset: number;
};

// Chromatic semitone count → diatonic step count (canonical teaching-oriented mapping)
export const CHROMATIC_TO_DIATONIC = [0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6];

// Diatonic shift (mod 7) → VexFlow clef name
export const DIATONIC_SHIFT_TO_CLEF = [
  'treble',         // 0
  'alto',           // 1
  'french',         // 2
  'mezzo-soprano',  // 3
  'baritone-c',     // 4
  'soprano',        // 5
  'tenor',          // 6
];

// Diatonic shift (mod 7) → position offset for visual alignment
export const DIATONIC_SHIFT_TO_OFFSET = [
  0,   // treble
  -6,  // alto
  2,   // french
  -4,  // mezzo-soprano
  -10, // baritone-c
  -2,  // soprano
  -8,  // tenor
];

export function resolveClefForTransposition(
  fromKey: number,
  toKey: number
): ClefInfo {
  const direction = toKey > fromKey ? 'down' : 'up';
  const interval = Math.abs(fromKey - toKey) % 12;

  const rawDiatonic = CHROMATIC_TO_DIATONIC[interval];
  const diatonicShift =
    direction === 'up'
      ? rawDiatonic % 7
      : (7 - rawDiatonic) % 7;

  return {
    clef: DIATONIC_SHIFT_TO_CLEF[diatonicShift],
    positionOffset: DIATONIC_SHIFT_TO_OFFSET[diatonicShift],
  };
}
