import { Key } from '../../utils/scaleBuilder';

// Note names for VexFlow key format (index 0=C, 1=D, ..., 6=B)
const NOTE_NAMES = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

/**
 * Convert a position index to VexFlow key format.
 * Position 0-6 = octave 4, 7-13 = octave 5, -7 to -1 = octave 3, etc.
 */
export function positionToVexflowKey(position: number): string {
  const baseOctave = 4;
  const octaveOffset = Math.floor(position / 7);
  // Handle negative modulo correctly
  const noteIndex = ((position % 7) + 7) % 7;
  const octave = baseOctave + octaveOffset;
  return `${NOTE_NAMES[noteIndex]}/${octave}`;
}

/**
 * Convert a Key object to VexFlow key signature format.
 * Returns 'C' for no alterations, or 'sharps_N' / 'flats_N' format.
 */
export function keyToVexflowKeySignature(key: Key): string {
  if (!key.alteration) return 'C';

  const totalAlterations =
    key.alteredNotes.length + key.doubleAlteredNotes.length;
  if (totalAlterations === 0) return 'C';

  // VexFlow format: 'sharps_N' or 'flats_N'
  const type = key.alteration === 'sharp' ? 'sharps' : 'flats';
  return `${type}_${totalAlterations}`;
}

/**
 * Convert accidental type to VexFlow format.
 */
export function accidentalToVexflow(
  accidental: 'sharp' | 'flat' | 'doubleSharp' | 'doubleFlat' | null | undefined
): string | null {
  if (!accidental) return null;

  const map: Record<string, string> = {
    sharp: '#',
    flat: 'b',
    doubleSharp: '##',
    doubleFlat: 'bb',
  };
  return map[accidental] ?? null;
}

/**
 * Map color names to hex values for VexFlow styling.
 */
export const COLOR_MAP: Record<string, string> = {
  emerald: '#34d399', // emerald-400
  red: '#f87171', // red-400
  sky: '#38bdf8', // sky-400
  amber: '#fbbf24', // amber-400
  purple: '#a78bfa', // purple-400
};

/**
 * Calculate stave width based on content.
 */
export function calculateStaveWidth(
  noteCount: number,
  key: Key,
  hasClef: boolean = true
): number {
  const clefWidth = hasClef ? 50 : 0;
  const keySignatureWidth =
    (key.alteredNotes?.length || 0) * 12 +
    (key.doubleAlteredNotes?.length || 0) * 12;
  const notesWidth = Math.max(noteCount * 40, 50);
  const padding = 60;
  return clefWidth + keySignatureWidth + notesWidth + padding;
}
