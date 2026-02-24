import { useState, useCallback, useEffect } from 'react';
import { playNote, playScale, stopPlayback } from '../../utils/audioPlayer';

type PlayButtonProps = {
  /** Chromatic note indices (0=C, 1=C#, ..., 11=B). Single note or scale. */
  noteIndices: number[];
  colour?: 'sky' | 'red' | 'amber' | 'purple';
};

function PlayButton({ noteIndices, colour = 'sky' }: PlayButtonProps) {
  const [playing, setPlaying] = useState(false);

  const colourClasses: Record<string, string> = {
    sky: 'text-sky-500 hover:text-sky-600 hover:bg-sky-50',
    red: 'text-red-400 hover:text-red-500 hover:bg-red-50',
    amber: 'text-amber-500 hover:text-amber-600 hover:bg-amber-50',
    purple: 'text-purple-500 hover:text-purple-600 hover:bg-purple-50',
  };

  const handleClick = useCallback(async () => {
    if (playing) {
      stopPlayback();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    if (noteIndices.length === 1) {
      playNote(noteIndices[0]);
      setTimeout(() => setPlaying(false), 500);
    } else {
      await playScale(noteIndices);
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
