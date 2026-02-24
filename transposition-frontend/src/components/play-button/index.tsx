import { useState, useCallback, useEffect } from 'react';
import { playNote, playScale, stopPlayback } from '../../utils/audioPlayer';

type PlayButtonProps = {
  /** Chromatic note indices (0=C, 1=C#, ..., 11=B). Single note or scale. */
  noteIndices: number[];
  colour?: 'sky' | 'red' | 'amber' | 'purple';
  /** Starting octave for playback (default 4 = middle C octave). */
  startOctave?: number;
};

function PlayButton({ noteIndices, colour = 'sky', startOctave = 4 }: PlayButtonProps) {
  const [playing, setPlaying] = useState(false);

  const colourClasses: Record<string, string> = {
    sky: 'text-sky-500 hover:text-sky-700',
    red: 'text-red-400 hover:text-red-600',
    amber: 'text-amber-500 hover:text-amber-700',
    purple: 'text-purple-500 hover:text-purple-700',
  };

  const handleClick = useCallback(async () => {
    if (playing) {
      stopPlayback();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    if (noteIndices.length === 1) {
      playNote(noteIndices[0], 500, startOctave);
      setTimeout(() => setPlaying(false), 500);
    } else {
      await playScale(noteIndices, 400, startOctave);
      setPlaying(false);
    }
  }, [playing, noteIndices]);

  useEffect(() => {
    return () => stopPlayback();
  }, []);

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${colourClasses[colour]} focus:outline-none focus:ring-2 focus:ring-offset-1`}
      aria-label={playing ? 'Stop playback' : 'Play'}
      title={playing ? 'Stop' : 'Play'}
    >
      {playing ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="3" width="10" height="10" rx="1" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2.5v11l9-5.5z" />
        </svg>
      )}
    </button>
  );
}

export default PlayButton;
