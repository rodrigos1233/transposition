import { useContext, useEffect, useState } from 'react';
import { getNote, SCALES } from '../../utils/notes';
import {
  enharmonicGroupTransposer,
  scaleTransposer,
} from '../../utils/transposer';
import { Key, scaleBuilder } from '../../utils/scaleBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import useTranslationLegacy, {
  Language,
  Translations,
} from '../../hooks/useTranslationLegacy.ts';
import { getModeName } from '../../utils/modes';
import Staff from '../../components/staff';
import LanguageContext from '../../contexts/LanguageContext';
import NotationContext from '../../contexts/NotationContext';
import ModeSelector from '../../components/mode-selector';
import IntervalSelector from '../../components/interval-selector';
import NoteSelector from '../../components/note-selector';
import { getIntervalName } from '../../utils/intervals';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';
import { useTranslation, Trans } from 'react-i18next';

const MAX_ORIGIN_KEY = 16;
const MAX_INTERVAL = 12;

function IntervalsScaleTransposition() {
  const { linkParams } = useParams();
  const navigate = useNavigate();

  const languageContext = useContext(LanguageContext);
  const selectedLanguage = languageContext.selectedLanguage;

  const notationContext = useContext(NotationContext);
  const selectedNotation = notationContext.selectedNotation;
  const { t } = useTranslation();

  const [originKeyString, intervalString, directionString] =
    linkParams?.split('-') || [];

  function validateParam(value: string, max: number) {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue <= max ? numValue : 0;
  }

  const originKey = validateParam(originKeyString, MAX_ORIGIN_KEY);
  const interval = validateParam(intervalString, MAX_INTERVAL);
  const direction: 'up' | 'down' = directionString === 'down' ? 'down' : 'up';

  const [selectedOriginKey, setSelectedOriginKey] = useState<number>(
    Number(originKey) || 0
  );
  const [selectedInterval, setSelectedInterval] = useState<number>(
    Number(interval) || 0
  );
  const [selectedMode, setSelectedMode] = useState<number>(0);
  const [selectedDirection, setSelectedDirection] = useState<'up' | 'down'>(
    direction
  );
  const [showAdditionalModes, setShowAdditionalModes] = useState(
    selectedMode > 1
  );

  let targetKey = enharmonicGroupTransposer(selectedOriginKey);

  if (selectedDirection === 'down') {
    targetKey -= selectedInterval;
  } else {
    targetKey += selectedInterval;
  }

  // Wrap into valid 0-11 enharmonic group range
  targetKey = ((targetKey % 12) + 12) % 12;

  const targetNote = scaleTransposer(
    originKey,
    selectedInterval,
    selectedMode,
    selectedDirection
  );
  const scale = scaleBuilder(originKey, selectedMode);

  useEffect(() => {
    if ([originKey, targetKey].some(isNaN)) {
      navigate('0-0-0-up', { replace: true }); // Redirect to default if invalid
    }
  }, [originKey, direction, targetKey, navigate]);

  const notesSuite = scale.notesInScale
    .map((noteInScale) => noteInScale.note[selectedNotation])
    .join(', ');

  const transposedScale = scaleBuilder(targetNote, selectedMode);

  const originKeySignature: Key = scale.key;
  const targetKeySignature: Key = transposedScale.key;

  const transposedScaleNotesSuite = transposedScale.notesInScale
    .map((noteInScale) => noteInScale.note[selectedNotation])
    .join(', ');

  const modeText = getModeName(selectedMode, selectedLanguage);

  function handleChangeOriginKey(newOriginKey: number) {
    setSelectedOriginKey(newOriginKey);
    navigate(
      `/scale-intervals/${newOriginKey}-${selectedInterval}-${selectedMode}-${selectedDirection}`,
      { replace: true }
    );
  }

  function handleChangeInterval(newInterval: number) {
    setSelectedInterval(newInterval);
    navigate(
      `/scale-intervals/${selectedOriginKey}-${newInterval}-${selectedMode}-${selectedDirection}`,
      { replace: true }
    );
  }

  function handleChangeDirection(newDirection: 'up' | 'down') {
    setSelectedDirection(newDirection);
    navigate(
      `/scale-intervals/${selectedOriginKey}-${selectedInterval}-${selectedMode}-${newDirection}`,
      { replace: true }
    );
  }

  function handleChangeMode(newMode: number) {
    setSelectedMode(newMode);
    navigate(
      `/scale-intervals/${selectedOriginKey}-${selectedInterval}-${newMode}-${selectedDirection}`,
      { replace: true }
    );
  }

  const resultMessage = [0, 12].includes(selectedInterval) ? (
    <>
      <Trans
        i18nKey="transposition.scaleIntervals.originScaleDefinition"
        values={{
          scale: `${getNote(originKey, selectedNotation, SCALES)} ${modeText}`,
        }}
        components={[<span className="border-b-4 border-purple-400" />]}
      />
      <span className="font-bold text-lg">{notesSuite}</span>.
      {selectedInterval === 0 &&
        t('transposition.scaleIntervals.noKeyChangeNeeded')}
      {originKeySignature.alteration !== targetKeySignature.alteration && (
        <>
          <Trans
            i18nKey="transposition.scaleIntervals.simplerEnharmonicEquivalent"
            values={{
              enharmonicScale: `${getNote(targetNote, selectedNotation, SCALES)} ${modeText}`,
            }}
            components={[<span className="border-b-4 border-amber-300" />]}
          />
          <span className="font-bold text-lg">{transposedScaleNotesSuite}</span>
          {'.'}
        </>
      )}
    </>
  ) : (
    <>
      <Trans
        i18nKey="transposition.scaleIntervals.originScaleDefinition"
        values={{
          scale: `${getNote(originKey, selectedNotation, SCALES)} ${modeText}`,
        }}
        components={[<span className="border-b-4 border-purple-400" />]}
      />
      <span className="font-bold text-lg">{notesSuite}</span>.{' '}
      <Trans
        i18nKey="transposition.scaleIntervals.transpositionResult"
        values={{
          targetScale: `${getNote(targetNote, selectedNotation, SCALES)} ${modeText}`,
          notes: transposedScaleNotesSuite,
          direction: t(`transposition.common.${selectedDirection}`),
          interval: getIntervalName(selectedInterval, selectedLanguage),
        }}
        components={[
          <span className="border-b-4 border-amber-300" />,
          <span className="font-bold text-lg" />,
        ]}
      />
    </>
  );

  const titleTextTranslations: Translations = {
    [Language.English]: [
      `${getNote(originKey, selectedNotation, SCALES)} ${modeText} ${
        selectedInterval !== 0 ? `${selectedDirection} one` : ' '
      } ${getIntervalName(
        selectedInterval,
        selectedLanguage
      )} | Scale Transposition`,
    ],
  };

  const pageTitleText = useTranslationLegacy(
    selectedLanguage,
    titleTextTranslations,
    [
      selectedNotation,
      selectedMode,
      selectedOriginKey,
      selectedDirection,
      selectedInterval,
    ]
  );
  useChangePageTitle(pageTitleText[0] as unknown as string);

  const isMobile = useIsMobile();

  const displayedNotes = scale.reducedNotes.map((note, i) => {
    if (selectedDirection === 'up') {
      if (scale.reducedNotes[i] > transposedScale.reducedNotes[i]) {
        return {
          origin: note,
          target: transposedScale.reducedNotes[i] + 7,
        };
      }

      if (selectedInterval === 12) {
        return {
          origin: note,
          target: transposedScale.reducedNotes[i] + 7,
        };
      }
    }
    if (selectedDirection === 'down') {
      if (scale.reducedNotes[i] < transposedScale.reducedNotes[i]) {
        return {
          origin: note,
          target: transposedScale.reducedNotes[i] - 7,
        };
      }

      if (selectedInterval === 12) {
        return {
          origin: note,
          target: transposedScale.reducedNotes[i] - 7,
        };
      }
    }

    return {
      origin: note,
      target: transposedScale.reducedNotes[i],
    };
  });

  const displayedOriginNotes = displayedNotes.map((note) => note.origin);
  const displayedTargetNotes = displayedNotes.map((note) => note.target);

  return (
    <ContentPage className="simple-transposition">
      <ContentCard>
        <ModeSelector
          selectedMode={selectedMode}
          handleChangeMode={handleChangeMode}
          showAdditionalModes={showAdditionalModes}
          setShowAdditionalModes={setShowAdditionalModes}
        />
        <h2 className="mb-3">
          {t('transposition.scaleIntervals.toolDescription')}
        </h2>
      </ContentCard>
      <ContentCard>
        <ContentCard level={2}>
          <div className="simple-transposition__origin-key-select w-full mb-3">
            {t('transposition.common.originKey')}:
            <NoteSelector
              selected={selectedOriginKey}
              setSelected={handleChangeOriginKey}
              colour="sky"
              usedScale={SCALES}
              blackNotesAreHalf={true}
            />
          </div>
        </ContentCard>
        <ContentCard level={2}>
          <div className="simple-transposition__note-select w-full mb-3">
            {t('transposition.scaleIntervals.intervalLabel')}:
            <IntervalSelector
              selectedInterval={selectedInterval}
              handleChangeInterval={handleChangeInterval}
              selectedDirection={selectedDirection}
              setSelectedDirection={handleChangeDirection}
            />
          </div>
        </ContentCard>
      </ContentCard>
      <ContentCard>
        <p className="mb-3">{resultMessage}</p>
        <div
          className={`scale-transposition__staff-container flex ${
            isMobile
              ? 'flex-col gap-8 mt-16 mb-16'
              : 'flex-row gap-5 mt-20 mb-20'
          }`}
        >
          <Staff
            displayedNotes={displayedOriginNotes}
            correspondingNotes={scale.notesInScale}
            musicalKey={originKeySignature}
            colour="sky"
            noteColour="purple"
          />
          <Staff
            displayedNotes={displayedTargetNotes}
            correspondingNotes={transposedScale.notesInScale}
            musicalKey={targetKeySignature}
            colour="red"
            noteColour="amber"
          />
        </div>
        {/*<CircleOfFifth*/}
        {/*    modeIndex={selectedMode}*/}
        {/*    selectedLanguage={selectedLanguage}*/}
        {/*    selectedStartNote={selectedNote}*/}
        {/*    targetNote={targetNote}*/}
        {/*    setSelectedMode={handleChangeMode}*/}
        {/*    selectedOriginKey={selectedOriginKey}*/}
        {/*    selectedTargetKey={selectedTargetKey}*/}
        {/*    showAdditionalModes={showAdditionalModes}*/}
        {/*/>*/}
      </ContentCard>
    </ContentPage>
  );
}

export default IntervalsScaleTransposition;
