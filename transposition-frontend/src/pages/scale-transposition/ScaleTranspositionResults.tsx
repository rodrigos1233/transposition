import { useContext, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  getNote,
  INSTRUMENTS_PITCHES,
  SCALES,
} from '../../utils/notes';
import { getIntervalName } from '../../utils/intervals';
import { Key } from '../../utils/scaleBuilder';
import type { NoteInScale } from '../../utils/scaleBuilder';
import { enharmonicGroupTransposer } from '../../utils/transposer';
import Staff from '../../components/staff';
import CircleOfFifth from '../../components/circle-of-fifth';
import ContentCard from '../../components/content-card';
import Button from '../../components/button';
import PlayButton from '../../components/play-button';
import NotationContext from '../../contexts/NotationContext';
import LanguageContext from '../../contexts/LanguageContext';

type ScaleTranspositionResultsProps = {
  method: 'key' | 'interval';
  fromKey: number;
  toKey: number;
  scale: number;
  mode: number;
  interval: number;
  direction: 'up' | 'down';
  targetNote: number;
  originScale: {
    notes: number[];
    notesInScale: NoteInScale[];
    reducedNotes: number[];
    key: Key;
  };
  transposedScale: {
    notes: number[];
    notesInScale: NoteInScale[];
    reducedNotes: number[];
    key: Key;
  };
  displayedOriginNotes: number[];
  displayedTargetNotes: number[];
  notesSuite: string;
  transposedNotesSuite: string;
  modeText: string;
  showAdditionalModes: boolean;
  handleChangeMode: (mode: number) => void;
  originInstrumentName?: string;
  targetInstrumentName?: string;
  isMobile: boolean;
};

function ScaleTranspositionResults({
  method,
  fromKey,
  toKey,
  scale,
  mode,
  interval,
  direction,
  targetNote,
  originScale,
  transposedScale,
  displayedOriginNotes,
  displayedTargetNotes,
  notesSuite,
  transposedNotesSuite,
  modeText,
  showAdditionalModes,
  handleChangeMode,
  originInstrumentName,
  targetInstrumentName,
  isMobile,
}: ScaleTranspositionResultsProps) {
  const { t } = useTranslation();
  const { selectedNotation } = useContext(NotationContext);
  const { selectedLanguage } = useContext(LanguageContext);
  const [circleExpanded, setCircleExpanded] = useState(method === 'key');
  const [originActiveNote, setOriginActiveNote] = useState<number | null>(null);
  const [transposedActiveNote, setTransposedActiveNote] = useState<number | null>(null);

  // --- Concert pitches for audio playback ---
  // scaleBuilder.notes wraps values at 12, losing the original SCALES index (0-16).
  // Use the scale/targetNote props (true SCALES indices) for the chromatic root,
  // then derive each note's offset from the raw notes array.
  function scaleToConcertPitches(
    scaleNotes: number[],
    scaleRoot: number,
    instrumentKey: number
  ): number[] {
    const chromaticRoot = enharmonicGroupTransposer(scaleRoot);
    const firstRawNote = scaleNotes[0];
    return scaleNotes.map(n => {
      const offset = ((n - firstRawNote) % 12 + 12) % 12;
      return (chromaticRoot + offset + instrumentKey) % 12;
    });
  }

  // In key mode, offset by instrument key for concert pitch.
  // In interval mode, there's no instrument — notes are already concert pitch.
  const originInstrumentKey = method === 'key' ? fromKey : 0;
  const targetInstrumentKey = method === 'key' ? toKey : 0;

  const originConcertPitches = scaleToConcertPitches(originScale.notes, scale, originInstrumentKey);
  const transposedConcertPitches = scaleToConcertPitches(transposedScale.notes, targetNote, targetInstrumentKey);

  // Compute the start octave for the transposed scale in interval mode.
  // When transposing up, if the interval crosses an octave boundary the
  // transposed scale must start in a higher octave (and vice versa for down).
  const transposedStartOctave = (() => {
    if (method === 'key') return 4; // same concert pitch, same octave
    const originChromatic = enharmonicGroupTransposer(scale);
    const originAbsolute = originChromatic + 4 * 12;
    const transposedAbsolute =
      direction === 'up'
        ? originAbsolute + interval
        : originAbsolute - interval;
    return Math.floor(transposedAbsolute / 12);
  })();

  // --- Staff labels ---
  const originStaffLabel = originInstrumentName
    ? t('stepper.originalInstrumentStaffLabel', {
        instrument: `${originInstrumentName} (${getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES)})`,
      })
    : t('stepper.originalStaffLabel');

  const transposedStaffLabel = targetInstrumentName
    ? t('stepper.transposedInstrumentStaffLabel', {
        instrument: `${targetInstrumentName} (${getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES)})`,
      })
    : t('stepper.transposedStaffLabel');

  // --- Result message ---
  const resultMessage =
    method === 'key'
      ? renderKeyModeMessage()
      : renderIntervalModeMessage();

  function renderKeyModeMessage() {
    if (fromKey === toKey) {
      return (
        <Trans
          i18nKey="transposition.crossInstruments.sameKeyMessage"
          values={{
            scale: getNote(scale, selectedNotation, SCALES),
            mode: modeText,
            originKey: getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES),
            notes: notesSuite,
          }}
          components={{
            0: <span className="border-b-4 border-purple-300" />,
            1: <span className="border-b-4 border-sky-300" />,
            2: <span className="font-bold text-lg" />,
          }}
        />
      );
    }

    return (
      <Trans
        i18nKey="transposition.crossInstruments.transpositionMessage"
        values={{
          scale: getNote(scale, selectedNotation, SCALES),
          mode: modeText,
          originKey: getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES),
          notes: notesSuite,
          targetScale: getNote(targetNote, selectedNotation, SCALES),
          transposedNotes: transposedNotesSuite,
          targetKey: getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES),
        }}
        components={{
          0: <span className="border-b-4 border-purple-400" />,
          1: <span className="border-b-4 border-sky-300" />,
          2: <span className="font-bold text-lg" />,
          3: <span className="border-b-4 border-amber-300" />,
          4: <span className="font-bold text-lg" />,
          5: <span className="border-b-4 border-red-300" />,
        }}
      />
    );
  }

  function renderIntervalModeMessage() {
    if ([0, 12].includes(interval)) {
      return (
        <>
          <Trans
            i18nKey="transposition.scaleIntervals.originScaleDefinition"
            values={{
              scale: `${getNote(scale, selectedNotation, SCALES)} ${modeText}`,
            }}
            components={[<span className="border-b-4 border-purple-400" />]}
          />
          <span className="font-bold text-lg">{notesSuite}</span>.
          {interval === 0 &&
            t('transposition.scaleIntervals.noKeyChangeNeeded')}
          {originScale.key.alteration !== transposedScale.key.alteration && (
            <>
              <Trans
                i18nKey="transposition.scaleIntervals.simplerEnharmonicEquivalent"
                values={{
                  enharmonicScale: `${getNote(targetNote, selectedNotation, SCALES)} ${modeText}`,
                }}
                components={[
                  <span className="border-b-4 border-amber-300" />,
                ]}
              />
              <span className="font-bold text-lg">
                {transposedNotesSuite}
              </span>
              {'.'}
            </>
          )}
        </>
      );
    }

    return (
      <>
        <Trans
          i18nKey="transposition.scaleIntervals.originScaleDefinition"
          values={{
            scale: `${getNote(scale, selectedNotation, SCALES)} ${modeText}`,
          }}
          components={[<span className="border-b-4 border-purple-400" />]}
        />
        <span className="font-bold text-lg">{notesSuite}</span>.{' '}
        <Trans
          i18nKey="transposition.scaleIntervals.transpositionResult"
          values={{
            targetScale: `${getNote(targetNote, selectedNotation, SCALES)} ${modeText}`,
            notes: transposedNotesSuite,
            direction: t(`transposition.common.${direction}`),
            interval: getIntervalName(interval, selectedLanguage),
          }}
          components={[
            <span className="border-b-4 border-amber-300" />,
            <span className="font-bold text-lg" />,
          ]}
        />
      </>
    );
  }

  return (
    <ContentCard>
      <output>
        <ContentCard level={2}>
          <p className="mb-3">{resultMessage}</p>
          <div
            className={`flex ${
              isMobile
                ? 'flex-col gap-8 mt-16 mb-16'
                : 'flex-row gap-5 mt-20 mb-20'
            }`}
          >
            <Staff
              displayedNotes={displayedOriginNotes}
              correspondingNotes={originScale.notesInScale}
              musicalKey={originScale.key}
              activeNoteIndex={originActiveNote}
              text={
                <span className="flex items-center gap-2">
                  <span className="border-b-4 border-sky-300">
                    {originStaffLabel}
                  </span>
                  <PlayButton noteIndices={originConcertPitches} colour="sky" onNotePlay={setOriginActiveNote} />
                </span>
              }
              colour="sky"
              noteColour="purple"
            />
            <Staff
              displayedNotes={displayedTargetNotes}
              correspondingNotes={transposedScale.notesInScale}
              musicalKey={transposedScale.key}
              activeNoteIndex={transposedActiveNote}
              text={
                <span className="flex items-center gap-2">
                  <span className="border-b-4 border-red-300">
                    {transposedStaffLabel}
                  </span>
                  <PlayButton noteIndices={transposedConcertPitches} colour="red" startOctave={transposedStartOctave} onNotePlay={setTransposedActiveNote} />
                </span>
              }
              colour="red"
              noteColour="amber"
            />
          </div>
        </ContentCard>
      </output>

      {/* Collapsible Circle of Fifths */}
      {method === 'key' && (
        <ContentCard level={2}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm md:text-base">
              {t('stepper.circleOfFifthsTitle')}
            </h3>
            <Button
              onClick={() => setCircleExpanded(!circleExpanded)}
              className="bg-neutral-100"
            >
              {circleExpanded ? '\u25B2' : '\u25BC'}
            </Button>
          </div>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              circleExpanded
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            }`}
            {...(!circleExpanded ? { inert: true, 'aria-hidden': true } : {})}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
                <div className="lg:flex-1 lg:pt-4">
                  <p className="text-sm text-neutral-500 mb-2">
                    {t('stepper.circleOfFifthsDescription')}
                  </p>
                  <p className="text-sm text-neutral-500 mb-3 lg:mb-0">
                    {t('stepper.circleOfFifthsExplanation')}
                  </p>
                </div>
                <div className="lg:flex-shrink-0">
                  <CircleOfFifth
                    modeIndex={mode}
                    selectedStartNote={scale}
                    targetNote={targetNote}
                    setSelectedMode={handleChangeMode}
                    selectedOriginKey={fromKey}
                    selectedTargetKey={toKey}
                    showAdditionalModes={showAdditionalModes}
                  />
                </div>
              </div>
            </div>
          </div>
        </ContentCard>
      )}
    </ContentCard>
  );
}

export default ScaleTranspositionResults;
