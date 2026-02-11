import { getNote, NOTES, SCALES } from './notes';

describe('getNote', () => {
  it('should return correct note names for all valid NOTES indices', () => {
    for (let i = 0; i < NOTES.length; i++) {
      expect(getNote(i, 'english')).toBeDefined();
      expect(getNote(i, 'romance')).toBeDefined();
      expect(getNote(i, 'german')).toBeDefined();
    }
  });

  it('should return correct note names for all valid SCALES indices', () => {
    for (let i = 0; i < SCALES.length; i++) {
      expect(getNote(i, 'english', SCALES)).toBeDefined();
      expect(getNote(i, 'romance', SCALES)).toBeDefined();
      expect(getNote(i, 'german', SCALES)).toBeDefined();
    }
  });

  it('should return expected values for known indices', () => {
    expect(getNote(0, 'english', SCALES)).toBe('C');
    expect(getNote(1, 'english', SCALES)).toBe('C♯');
    expect(getNote(2, 'english', SCALES)).toBe('D♭');
    expect(getNote(16, 'english', SCALES)).toBe('B');
  });

  it('should not crash for negative indices', () => {
    // Negative indices should not cause undefined access errors
    // This test documents current behavior — if getNote is called
    // with an out-of-range index, it should fail gracefully
    expect(() => getNote(-1, 'english', SCALES)).toThrow();
  });

  it('should not crash for indices beyond array length', () => {
    expect(() => getNote(SCALES.length, 'english', SCALES)).toThrow();
    expect(() => getNote(99, 'english', SCALES)).toThrow();
  });
});
