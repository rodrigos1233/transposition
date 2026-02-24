import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  getNote,
  INSTRUMENTS_PITCHES,
  REDUCED_NOTES,
  SCALES,
} from '../../utils/notes';
import { getIntervalName } from '../../utils/intervals';
import { NoteInScale } from '../../utils/scaleBuilder';
import {
  resolveChromaticClick,
  reverseNoteFromTarget,
} from '../../utils/staffClickResolver';
import Staff from '../../components/staff';
import PlayButton from '../../components/play-button';
import InlineParameterBar from '../../components/inline-parameter-bar';
import ContentCard from '../../components/content-card';
import NotationContext from '../../contexts/NotationContext';
import LanguageContext from '../../contexts/LanguageContext';

export type TranspositionController = {
  onChangeNote?: (note: number) => void;
  onChangeScale?: (scale: number) => void;
  onChangeFromKey: (key: number) => void;
  onChangeToKey: (key: number) => void;
  onChangeMethod: (method: 'key' | 'interval') => void;
  onChangeInterval: (interval: number) => void;
  onChangeDirection: (direction: 'up' | 'down') => void;
  onChangeMode?: (mode: number) => void;
};

type NoteTranspositionResultsProps = {
  method: 'key' | 'interval';
  note: number;
  fromKey: number;
  toKey: number;
  interval: number;
  direction: 'up' | 'down';
  targetNote: number;
  reversedEnharmonicOriginGroupNotes: number[];
  reversedEnharmonicTargetGroupNotes: number[];
  originInstrumentName?: string;
  targetInstrumentName?: string;
  isMobile: boolean;
  controller: TranspositionController;
};

function NoteTranspositionResults({
  method,
  note,
  fromKey,
  toKey,
  interval,
  direction,
  targetNote,
  reversedEnharmonicOriginGroupNotes,
  reversedEnharmonicTargetGroupNotes,
  originInstrumentName,
  targetInstrumentName,
  isMobile,
  controller,
}: NoteTranspositionResultsProps) {
  const { t } = useTranslation();
  const { selectedNotation } = useContext(NotationContext);
  const { selectedLanguage } = useContext(LanguageContext);

  function defineCorrespondingNotes(reversedEnharmonicGroupNotes: number[]) {
    if (reversedEnharmonicGroupNotes.length > 1) {
      const firstNote = SCALES[reversedEnharmonicGroupNotes[0]];
      const secondNote = SCALES[reversedEnharmonicGroupNotes[1]];
      return [{ note: firstNote }, { note: secondNote }];
    }
    return [{ note: SCALES[reversedEnharmonicGroupNotes[0]] }];
  }

  function defineDisplayedNotes(reversedEnharmonicGroupNotes: number[]) {
    return reversedEnharmonicGroupNotes
      .map((noteIndex) => {
        const noteName = SCALES[noteIndex].english.charAt(0);
        return REDUCED_NOTES.findIndex(
          (reducedNote) => reducedNote.english === noteName
        );
      })
      .filter((index) => index !== null);
  }

  const correspondingOriginNotes = defineCorrespondingNotes(
    reversedEnharmonicOriginGroupNotes
  );
  const correspondingTargetNotes = defineCorrespondingNotes(
    reversedEnharmonicTargetGroupNotes
  );

  const displayedOriginNotes = defineDisplayedNotes(
    reversedEnharmonicOriginGroupNotes
  );
  const rawTargetNotes = defineDisplayedNotes(
    reversedEnharmonicTargetGroupNotes
  );

  // In interval mode, adjust target positions so they appear in the correct
  // octave relative to the origin on the staff.  The raw positions are 0-6
  // (C-B) with no octave info, so we shift by ±7 when the direction requires it.
  const displayedTargetNotes = (() => {
    if (method !== 'interval' || interval === 0) return rawTargetNotes;
    const originPos = displayedOriginNotes[0];
    const targetPos = rawTargetNotes[0];
    if (direction === 'down' && targetPos >= originPos) {
      return rawTargetNotes.map(p => p - 7);
    }
    if (direction === 'up' && targetPos <= originPos) {
      return rawTargetNotes.map(p => p + 7);
    }
    return rawTargetNotes;
  })();

  // --- Concert pitch for audio playback ---
  // In key mode, the written note is not what sounds: a Bb clarinet playing
  // written C sounds concert Bb. Concert pitch = (writtenNote + instrumentKey) % 12.
  // In interval mode, notes are already concert pitch (no instrument context).
  const originConcertPitch = method === 'key' ? (note + fromKey) % 12 : note;
  const targetConcertPitch = method === 'key' ? (targetNote + toKey) % 12 : targetNote;

  // In interval mode, compute the target octave when the interval crosses an octave boundary.
  const targetStartOctave = (() => {
    if (method === 'key') return 4; // same concert pitch
    const originAbsolute = note + 4 * 12;
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
    method === 'key' ? renderKeyModeMessage() : renderIntervalModeMessage();

  function renderKeyModeMessage() {
    if (fromKey === toKey) {
      return (
        <Trans
          i18nKey="transposition.simpleTransposition.sameKeyMessage"
          values={{
            note: getNote(note, selectedNotation),
            originKey: getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES),
          }}
          components={[
            <span className="border-b-4 border-purple-300" />,
            <span className="border-b-4 border-sky-300" />,
            <span className="border-b-4 border-purple-300" />,
          ]}
        />
      );
    }

    return (
      <Trans
        i18nKey="transposition.simpleTransposition.transpositionMessage"
        values={{
          note: getNote(note, selectedNotation),
          originKey: getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES),
          transposedNote: getNote(targetNote, selectedNotation),
          targetKey: getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES),
        }}
        components={[
          <span className="border-b-4 border-purple-300" />,
          <span className="border-b-4 border-sky-300" />,
          <span className="border-b-4 border-amber-300 font-bold text-lg" />,
          <span className="border-b-4 border-red-300" />,
        ]}
      />
    );
  }

  function renderIntervalModeMessage() {
    if (interval === 0) {
      return (
        <Trans
          i18nKey="transposition.noteIntervals.noChangeNeeded"
          values={{
            note: getNote(note, selectedNotation),
          }}
          components={[
            <span className="border-b-4 border-purple-300" />,
          ]}
        />
      );
    }

    return (
      <Trans
        i18nKey="transposition.noteIntervals.transpositionResult"
        values={{
          note: getNote(note, selectedNotation),
          transposedNote: getNote(targetNote, selectedNotation),
          direction: t(`transposition.common.${direction}`),
          interval: getIntervalName(interval, selectedLanguage),
        }}
        components={[
          <span className="border-b-4 border-purple-300" />,
          <span className="border-b-4 border-amber-300 font-bold text-lg" />,
        ]}
      />
    );
  }

  // Staff click handlers
  function handleOriginStaffClick(position: number, clickCount: number) {
    const chromaticNote = resolveChromaticClick(position, clickCount);
    controller.onChangeNote?.(chromaticNote);
  }

  function handleTargetStaffClick(position: number, clickCount: number) {
    const chromaticTarget = resolveChromaticClick(position, clickCount);
    const origin = reverseNoteFromTarget(
      chromaticTarget,
      method,
      fromKey,
      toKey,
      interval,
      direction
    );
    controller.onChangeNote?.(origin);
  }

  // Should we show the target staff?
  const showTargetStaff =
    method === 'key' ? fromKey !== toKey : interval !== 0;

  return (
    <ContentCard>
      <output>
        <ContentCard level={2}>
          <InlineParameterBar
            controller={controller}
            method={method}
            fromKey={fromKey}
            toKey={toKey}
            interval={interval}
            direction={direction}
            note={note}
          />
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
              correspondingNotes={
                correspondingOriginNotes as unknown as NoteInScale[]
              }
              musicalKey={{
                alteration: null,
                doubleAlteredNotes: [],
                alteredNotes: [],
              }}
              accidentals={
                displayedOriginNotes.length > 1
                  ? ['sharp', 'flat']
                  : undefined
              }
              text={
                <span className="flex items-center gap-2">
                  <span className="border-b-4 border-sky-300">
                    {originStaffLabel}
                  </span>
                  <PlayButton noteIndices={[originConcertPitch]} colour="sky" />
                </span>
              }
              colour="sky"
              noteColour="purple"
              onNoteClick={handleOriginStaffClick}
            />
            {showTargetStaff && (
              <Staff
                displayedNotes={displayedTargetNotes}
                correspondingNotes={
                  correspondingTargetNotes as unknown as NoteInScale[]
                }
                musicalKey={{
                  alteration: null,
                  doubleAlteredNotes: [],
                  alteredNotes: [],
                }}
                accidentals={
                  displayedTargetNotes.length > 1
                    ? ['sharp', 'flat']
                    : undefined
                }
                text={
                  <span className="flex items-center gap-2">
                    <span className="border-b-4 border-red-300">
                      {transposedStaffLabel}
                    </span>
                    <PlayButton noteIndices={[targetConcertPitch]} colour="red" startOctave={targetStartOctave} />
                  </span>
                }
                colour="red"
                noteColour="amber"
                onNoteClick={handleTargetStaffClick}
              />
            )}
          </div>
        </ContentCard>
      </output>
    </ContentCard>
  );
}

export default NoteTranspositionResults;
