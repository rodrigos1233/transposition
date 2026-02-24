import {
  scaleTransposer,
  scaleCrossInstrumentsTransposer,
  crossInstrumentsTransposer,
} from './transposer';

// Maps staff position (0-6 = C D E F G A B) to chromatic note indices
// Each position maps to an array of chromatic values to cycle through on repeated clicks
const CHROMATIC_CYCLES: Record<number, number[]> = {
  0: [0, 1],    // C → C#/Db
  1: [2, 3],    // D → D#/Eb
  2: [4],       // E only
  3: [5, 6],    // F → F#/Gb
  4: [7, 8],    // G → G#/Ab
  5: [9, 10],   // A → A#/Bb
  6: [11],      // B only
};

// Maps staff position (0-6) to SCALES indices to cycle through
const SCALE_CYCLES: Record<number, number[]> = {
  0: [0, 1],          // C → C#
  1: [3, 4, 2],       // D → D# → Db
  2: [6, 5],          // E → Eb
  3: [7, 8],          // F → F#
  4: [10, 11, 9],     // G → G# → Gb
  5: [13, 14, 12],    // A → A# → Ab
  6: [16, 15],        // B → Bb
};

/**
 * Resolves a staff click position to a chromatic note index (0-11).
 * If the current note is already in the cycle for this position,
 * advances to the next alteration. Otherwise selects the natural.
 * Used for simple (note) transposition.
 */
export function resolveChromaticClick(
  position: number,
  currentNote: number
): number {
  const normalized = ((position % 7) + 7) % 7;
  const cycle = CHROMATIC_CYCLES[normalized];
  const currentIndex = cycle.indexOf(currentNote);
  if (currentIndex !== -1) {
    // Current note is on this position — advance to next alteration
    return cycle[(currentIndex + 1) % cycle.length];
  }
  // Different position — select the natural (first in cycle)
  return cycle[0];
}

/**
 * Resolves a staff click position to a SCALES index (0-16).
 * If the current scale is already in the cycle for this position,
 * advances to the next alteration. Otherwise selects the natural.
 * Used for scale transposition.
 */
export function resolveScaleClick(
  position: number,
  currentScale: number
): number {
  const normalized = ((position % 7) + 7) % 7;
  const cycle = SCALE_CYCLES[normalized];
  const currentIndex = cycle.indexOf(currentScale);
  if (currentIndex !== -1) {
    return cycle[(currentIndex + 1) % cycle.length];
  }
  return cycle[0];
}

/**
 * Given a target chromatic note, reverse-compute the origin note for simple transposition.
 */
export function reverseNoteFromTarget(
  target: number,
  method: 'key' | 'interval',
  fromKey: number,
  toKey: number,
  interval: number,
  direction: 'up' | 'down'
): number {
  if (method === 'key') {
    // crossInstrumentsTransposer: originNote transposed from fromKey to toKey
    // Reverse: from toKey back to fromKey
    const [origin] = crossInstrumentsTransposer(target, toKey, fromKey);
    return origin;
  }
  // interval mode: target = (origin ± interval) % 12
  const reverseDirection = direction === 'up' ? 'down' : 'up';
  const origin =
    reverseDirection === 'up'
      ? ((target + interval) % 12 + 12) % 12
      : ((target - interval) % 12 + 12) % 12;
  return origin;
}

/**
 * Given a target SCALES index, reverse-compute the origin scale for scale transposition.
 */
export function reverseScaleFromTarget(
  target: number,
  method: 'key' | 'interval',
  fromKey: number,
  toKey: number,
  interval: number,
  mode: number,
  direction: 'up' | 'down'
): number {
  if (method === 'key') {
    // scaleCrossInstrumentsTransposer: originNote from fromKey → toKey
    // Reverse: target from toKey → fromKey
    return scaleCrossInstrumentsTransposer(target, toKey, fromKey, mode);
  }
  // interval mode: reverse the direction
  const reverseDirection = direction === 'up' ? 'down' : 'up';
  return scaleTransposer(target, interval, mode, reverseDirection);
}
