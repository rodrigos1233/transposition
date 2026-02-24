let audioContext: AudioContext | null = null;
let currentAbortController: AbortController | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

/**
 * Convert a chromatic note index (0=C, 1=C#, ..., 9=A, 11=B)
 * to frequency in Hz using equal temperament.
 * Default octave 4 (middle C = C4).
 */
export function noteIndexToFrequency(noteIndex: number, octave = 4): number {
  return 440 * Math.pow(2, (noteIndex - 9) / 12 + (octave - 4));
}

/**
 * Play a single note as a sine wave.
 */
export function playNote(noteIndex: number, durationMs = 500, octave = 4): void {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = noteIndexToFrequency(noteIndex, octave);

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  const fadeStart = ctx.currentTime + durationMs / 1000 - 0.05;
  gainNode.gain.setValueAtTime(0.3, fadeStart);
  gainNode.gain.linearRampToValueAtTime(0, fadeStart + 0.05);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + durationMs / 1000);
}

/**
 * Play a sequence of notes (for scales). Returns a promise that resolves when done.
 * Call stopPlayback() to cancel.
 */
export async function playScale(
  noteIndices: number[],
  tempoMs = 400
): Promise<void> {
  stopPlayback();
  const controller = new AbortController();
  currentAbortController = controller;

  let currentOctave = 4;

  for (let i = 0; i < noteIndices.length; i++) {
    if (controller.signal.aborted) return;

    // When the next note is lower than the previous, we've wrapped around the octave
    if (i > 0 && noteIndices[i] < noteIndices[i - 1]) {
      currentOctave++;
    }

    playNote(noteIndices[i], tempoMs - 50, currentOctave);
    if (i < noteIndices.length - 1) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(resolve, tempoMs);
        controller.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true });
      }).catch(() => {});
      if (controller.signal.aborted) return;
    }
  }
  currentAbortController = null;
}

/**
 * Stop any in-progress scale playback.
 */
export function stopPlayback(): void {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
}

/**
 * Check if audio is currently playing.
 */
export function isPlaying(): boolean {
  return currentAbortController !== null;
}
