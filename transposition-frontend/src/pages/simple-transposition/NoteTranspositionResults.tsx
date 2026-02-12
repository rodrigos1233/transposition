import { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  getNote,
  INSTRUMENTS_PITCHES,
  REDUCED_NOTES,
  SCALES,
} from '../../utils/notes';
import { NoteInScale } from '../../utils/scaleBuilder';
import Staff from '../../components/staff';
import ContentCard from '../../components/content-card';
import NotationContext from '../../contexts/NotationContext';

type NoteTranspositionResultsProps = {
  note: number;
  fromKey: number;
  toKey: number;
  targetNote: number;
  reversedEnharmonicOriginGroupNotes: number[];
  reversedEnharmonicTargetGroupNotes: number[];
  originInstrumentName?: string;
  targetInstrumentName?: string;
  isMobile: boolean;
};

function NoteTranspositionResults({
  note,
  fromKey,
  toKey,
  targetNote,
  reversedEnharmonicOriginGroupNotes,
  reversedEnharmonicTargetGroupNotes,
  originInstrumentName,
  targetInstrumentName,
  isMobile,
}: NoteTranspositionResultsProps) {
  const { t } = useTranslation();
  const { selectedNotation } = useContext(NotationContext);

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
  const displayedTargetNotes = defineDisplayedNotes(
    reversedEnharmonicTargetGroupNotes
  );

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

  const message =
    fromKey === toKey ? (
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
    ) : (
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

  return (
    <ContentCard>
      <output>
        <ContentCard level={2}>
          <p className="mb-3">{message}</p>
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
                <span className="border-b-4 border-sky-300">
                  {originStaffLabel}
                </span>
              }
              colour="sky"
              noteColour="purple"
            />
            {fromKey !== toKey && (
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
                  <span className="border-b-4 border-red-300">
                    {transposedStaffLabel}
                  </span>
                }
                colour="red"
                noteColour="amber"
              />
            )}
          </div>
        </ContentCard>
      </output>
    </ContentCard>
  );
}

export default NoteTranspositionResults;
