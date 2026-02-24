import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NOTES, SCALES, INSTRUMENTS_PITCHES, Note } from '../../utils/notes';
import { getIntervalName, INTERVALS } from '../../utils/intervals';
import { getModeName, MODES } from '../../utils/modes';
import NotationContext from '../../contexts/NotationContext';
import LanguageContext from '../../contexts/LanguageContext';
import type { TranspositionController } from '../../pages/simple-transposition/NoteTranspositionResults';

type InlineParameterBarProps = {
  controller: TranspositionController;
  method: 'key' | 'interval';
  fromKey: number;
  toKey: number;
  interval: number;
  direction: 'up' | 'down';
  // For note transposition
  note?: number;
  // For scale transposition
  scale?: number;
  mode?: number;
};

function InlineParameterBar({
  controller,
  method,
  fromKey,
  toKey,
  interval,
  direction,
  note,
  scale,
  mode,
}: InlineParameterBarProps) {
  const { t } = useTranslation();
  const { selectedNotation } = useContext(NotationContext);
  const { selectedLanguage } = useContext(LanguageContext);

  const isScaleMode = scale !== undefined;
  const selectClass =
    'text-xs px-1.5 py-1 rounded border border-neutral-200 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-300';

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-neutral-600">
      {/* Note/Scale selector */}
      {isScaleMode ? (
        <label className="flex items-center gap-1">
          <span className="text-neutral-400">{t('inlineBar.scale')}:</span>
          <select
            className={selectClass}
            value={scale}
            onChange={(e) => controller.onChangeScale?.(Number(e.target.value))}
          >
            {SCALES.map((s: Note, i: number) => (
              <option key={i} value={i}>
                {s[selectedNotation]}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label className="flex items-center gap-1">
          <span className="text-neutral-400">{t('inlineBar.note')}:</span>
          <select
            className={selectClass}
            value={note}
            onChange={(e) => controller.onChangeNote?.(Number(e.target.value))}
          >
            {NOTES.map((n: Note, i: number) => (
              <option key={i} value={i}>
                {n[selectedNotation]}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Mode selector (scale only) */}
      {isScaleMode && mode !== undefined && (
        <label className="flex items-center gap-1">
          <span className="text-neutral-400">{t('inlineBar.mode')}:</span>
          <select
            className={selectClass}
            value={mode}
            onChange={(e) => controller.onChangeMode?.(Number(e.target.value))}
          >
            {MODES.map((_, i) => (
              <option key={i} value={i}>
                {getModeName(i, selectedLanguage)}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Method toggle */}
      <span className="flex items-center gap-0.5">
        <button
          className={`text-xs px-2 py-1 rounded-l border border-neutral-200 ${
            method === 'key'
              ? 'bg-neutral-700 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-50'
          }`}
          onClick={() => controller.onChangeMethod('key')}
        >
          {t('inlineBar.key')}
        </button>
        <button
          className={`text-xs px-2 py-1 rounded-r border border-neutral-200 border-l-0 ${
            method === 'interval'
              ? 'bg-neutral-700 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-50'
          }`}
          onClick={() => controller.onChangeMethod('interval')}
        >
          {t('inlineBar.interval')}
        </button>
      </span>

      {/* Key mode: origin + target key */}
      {method === 'key' && (
        <>
          <label className="flex items-center gap-1">
            <span className="text-neutral-400">{t('inlineBar.from')}:</span>
            <select
              className={selectClass}
              value={fromKey}
              onChange={(e) =>
                controller.onChangeFromKey(Number(e.target.value))
              }
            >
              {INSTRUMENTS_PITCHES.map((p: Note, i: number) => (
                <option key={i} value={i}>
                  {p[selectedNotation]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1">
            <span className="text-neutral-400">{t('inlineBar.to')}:</span>
            <select
              className={selectClass}
              value={toKey}
              onChange={(e) =>
                controller.onChangeToKey(Number(e.target.value))
              }
            >
              {INSTRUMENTS_PITCHES.map((p: Note, i: number) => (
                <option key={i} value={i}>
                  {p[selectedNotation]}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {/* Interval mode: direction + interval */}
      {method === 'interval' && (
        <>
          <span className="flex items-center gap-0.5">
            <button
              className={`text-xs px-2 py-1 rounded-l border border-neutral-200 ${
                direction === 'up'
                  ? 'bg-neutral-700 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
              onClick={() => controller.onChangeDirection('up')}
            >
              {t('inlineBar.up')}
            </button>
            <button
              className={`text-xs px-2 py-1 rounded-r border border-neutral-200 border-l-0 ${
                direction === 'down'
                  ? 'bg-neutral-700 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
              onClick={() => controller.onChangeDirection('down')}
            >
              {t('inlineBar.down')}
            </button>
          </span>
          <label className="flex items-center gap-1">
            <select
              className={selectClass}
              value={interval}
              onChange={(e) =>
                controller.onChangeInterval(Number(e.target.value))
              }
            >
              {INTERVALS.map((_, i) => (
                <option key={i} value={i}>
                  {getIntervalName(i, selectedLanguage)}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
    </div>
  );
}

export default InlineParameterBar;
