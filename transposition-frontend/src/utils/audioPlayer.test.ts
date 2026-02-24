import { describe, it, expect } from 'vitest';
import { noteIndexToFrequency } from './audioPlayer';

describe('noteIndexToFrequency', () => {
  it('returns 261.63 for C (index 0)', () => {
    expect(noteIndexToFrequency(0)).toBeCloseTo(261.63, 1);
  });

  it('returns 440 for A (index 9)', () => {
    expect(noteIndexToFrequency(9)).toBeCloseTo(440, 1);
  });

  it('returns 493.88 for B (index 11)', () => {
    expect(noteIndexToFrequency(11)).toBeCloseTo(493.88, 1);
  });

  it('returns 277.18 for C#/Db (index 1)', () => {
    expect(noteIndexToFrequency(1)).toBeCloseTo(277.18, 1);
  });

  it('returns 523.25 for C in octave 5', () => {
    expect(noteIndexToFrequency(0, 5)).toBeCloseTo(523.25, 1);
  });

  it('returns 130.81 for C in octave 3', () => {
    expect(noteIndexToFrequency(0, 3)).toBeCloseTo(130.81, 1);
  });
});
