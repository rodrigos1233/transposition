import { Navigate, useParams } from 'react-router-dom';

/**
 * Redirects old /scale-cross-instruments/:linkParams and /scale/:linkParams URLs
 * to the new /scale?query format.
 *
 * Old format: originKey-note-targetKey-mode (e.g., 10-0-3-0)
 * New format: /scale?from_key=10&scale=0&to_key=3&mode=0
 */
export function CrossInstrumentsRedirect() {
  const { linkParams } = useParams();
  const [originKeyStr, noteStr, targetKeyStr, modeStr] =
    linkParams?.split('-') || [];

  const fromKey = Number(originKeyStr) || 0;
  const scale = Number(noteStr) || 0;
  const toKey = Number(targetKeyStr) || 0;
  const mode = Number(modeStr) || 0;

  return (
    <Navigate
      to={`/scale?from_key=${fromKey}&scale=${scale}&to_key=${toKey}&mode=${mode}`}
      replace
    />
  );
}

/**
 * Redirects old /scale-intervals/:linkParams URLs to the new /scale?query format.
 *
 * Old format: originKey-interval-mode-direction (e.g., 0-5-0-up)
 * or: originKey-interval-direction (e.g., 0-5-up)
 * New format: /scale?from_key=0&scale=originKey&mode=0&method=interval&interval=5&direction=up
 *
 * Note: In the old intervals page, the "origin key" was actually the scale root note.
 * In the new unified page, we put it in 'scale' and default 'from_key' to 0 (C).
 */
export function IntervalsRedirect() {
  const { linkParams } = useParams();
  const parts = linkParams?.split('-') || [];

  const originKey = Number(parts[0]) || 0;
  const interval = Number(parts[1]) || 0;

  // The old format could be originKey-interval-direction or originKey-interval-mode-direction
  let mode = 0;
  let direction = 'up';
  if (parts.length >= 4) {
    mode = Number(parts[2]) || 0;
    direction = parts[3] === 'down' ? 'down' : 'up';
  } else if (parts.length === 3) {
    direction = parts[2] === 'down' ? 'down' : 'up';
  }

  return (
    <Navigate
      to={`/scale?from_key=0&scale=${originKey}&mode=${mode}&method=interval&interval=${interval}&direction=${direction}`}
      replace
    />
  );
}
