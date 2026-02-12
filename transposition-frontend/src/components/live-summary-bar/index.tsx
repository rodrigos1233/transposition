import { useContext } from 'react';
import { getNote, INSTRUMENTS_PITCHES, SCALES } from '../../utils/notes';
import { getModeName } from '../../utils/modes';
import NotationContext from '../../contexts/NotationContext';
import LanguageContext from '../../contexts/LanguageContext';

type LiveSummaryBarProps = {
  fromKey: number | null;
  scale: number | null;
  mode: number;
  toKey: number | null;
  method: 'key' | 'interval';
  originInstrumentName?: string;
  targetInstrumentName?: string;
};

function LiveSummaryBar({
  fromKey,
  scale,
  mode,
  toKey,
  method,
  originInstrumentName,
  targetInstrumentName,
}: LiveSummaryBarProps) {
  const { selectedNotation } = useContext(NotationContext);
  const { selectedLanguage } = useContext(LanguageContext);

  const scaleSegment =
    scale !== null
      ? `${getNote(scale, selectedNotation, SCALES)} ${getModeName(mode, selectedLanguage)}`
      : '\u2014';

  // Instrument segments only shown in key mode
  const showInstruments = method === 'key';

  const originSegment =
    showInstruments && fromKey !== null
      ? formatInstrumentSegment(
          originInstrumentName,
          getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES)
        )
      : null;

  const targetSegment =
    showInstruments && toKey !== null
      ? formatInstrumentSegment(
          targetInstrumentName,
          getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES)
        )
      : null;

  return (
    <div className="sticky top-14 z-10 mb-4">
      <div className="p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-soft border border-neutral-200">
        <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium flex-wrap">
          <span className="border-b-2 border-purple-400 px-1">
            {scaleSegment}
          </span>
          {showInstruments && (
            <>
              <span className="text-neutral-400">:</span>
              <span className="border-b-2 border-sky-400 px-1">
                {originSegment ?? '\u2014'}
              </span>
              <span className="text-neutral-400">{'\u2192'}</span>
              <span className="border-b-2 border-red-400 px-1">
                {targetSegment ?? '\u2014'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function formatInstrumentSegment(
  instrumentName: string | undefined,
  keyName: string
): string {
  if (instrumentName) {
    return `${instrumentName} (${keyName})`;
  }
  return keyName;
}

export default LiveSummaryBar;
