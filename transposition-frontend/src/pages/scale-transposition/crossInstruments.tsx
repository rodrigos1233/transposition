import { useContext, useEffect, useState } from 'react';
import { getNote, INSTRUMENTS_PITCHES, Note, SCALES } from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { scaleCrossInstrumentsTransposer } from '../../utils/transposer';
import { Key, scaleBuilder } from '../../utils/scaleBuilder';
import useTranslationLegacy, {
  Language,
  Translations,
} from '../../hooks/useTranslationLegacy.ts';
import { useTranslation, Trans } from 'react-i18next';
import { getModeName } from '../../utils/modes';
import { useNavigate, useParams } from 'react-router-dom';
import Staff from '../../components/staff';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';

import ModeSelector from '../../components/mode-selector';
import CircleOfFifth from '../../components/circle-of-fifth';
import LanguageContext from '../../contexts/LanguageContext';
import NotationContext from '../../contexts/NotationContext';
import SelectComponent, { OptionType } from '../../components/select';
import { LIST_OF_INSTRUMENTS } from '../../utils/instruments';
import { SingleValue } from 'react-select';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';

const MAX_ORIGIN_KEY = 11;
const MAX_NOTE = 16;
const MAX_TARGET_KEY = 11;
const MAX_MODE = 6;

function CrossInstrumentsScaleTransposition() {
  const { linkParams } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { selectedNotation } = useContext(NotationContext);

  const languageContext = useContext(LanguageContext);
  const selectedLanguage = languageContext.selectedLanguage;

  const [originKeyString, noteString, targetKeyString, modeString] =
    linkParams?.split('-') || [];

  function validateParam(value: string, max: number) {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue <= max ? numValue : 0;
  }

  const originKey = validateParam(originKeyString, MAX_ORIGIN_KEY);
  const note = validateParam(noteString, MAX_NOTE);
  const targetKey = validateParam(targetKeyString, MAX_TARGET_KEY);
  const mode = validateParam(modeString, MAX_MODE);

  const [selectedOriginKey, setSelectedOriginKey] = useState<number>(
    Number(originKey) || 0
  );
  const [selectedNote, setSelectedNote] = useState<number>(Number(note) || 0);
  const [selectedTargetKey, setSelectedTargetKey] = useState<number>(
    Number(targetKey) || 0
  );
  const [selectedMode, setSelectedMode] = useState<number>(Number(mode) || 0);
  const [showAdditionalModes, setShowAdditionalModes] = useState(
    selectedMode > 1
  );
  const [selectedOriginOption, setSelectedOriginOption] =
    useState<SingleValue<OptionType>>(null);
  const [selectedTargetOption, setSelectedTargetOption] =
    useState<SingleValue<OptionType>>(null);

  const targetNote = scaleCrossInstrumentsTransposer(
    selectedNote,
    selectedOriginKey,
    selectedTargetKey,
    selectedMode
  );
  const scale = scaleBuilder(selectedNote, selectedMode);

  useEffect(() => {
    if ([originKey, note, targetKey].some(isNaN)) {
      navigate('0-0-0-0', { replace: true });
    }
  }, [originKey, note, targetKey, navigate]);

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
    setSelectedOriginOption(null);
    navigate(
      `/scale-cross-instruments/${newOriginKey}-${selectedNote}-${selectedTargetKey}-${selectedMode}`,
      { replace: true }
    );
  }

  function handleChangeNote(newNote: number) {
    setSelectedNote(newNote);
    navigate(
      `/scale-cross-instruments/${selectedOriginKey}-${newNote}-${selectedTargetKey}-${selectedMode}`,
      { replace: true }
    );
  }

  function handleChangeTargetKey(newTargetKey: number) {
    setSelectedTargetKey(newTargetKey);
    setSelectedTargetOption(null);
    navigate(
      `/scale-cross-instruments/${selectedOriginKey}-${selectedNote}-${newTargetKey}-${selectedMode}`,
      { replace: true }
    );
  }

  function handleChangeMode(newMode: number) {
    setSelectedMode(newMode);
    navigate(
      `/scale-cross-instruments/${selectedOriginKey}-${selectedNote}-${selectedTargetKey}-${newMode}`,
      { replace: true }
    );
  }

  const titleTextTranslations: Translations = {
    [Language.English]: [
      `${getNote(
        selectedNote,
        selectedNotation,
        SCALES
      )} ${modeText} from ${getNote(
        selectedOriginKey,
        selectedNotation,
        INSTRUMENTS_PITCHES
      )} to ${getNote(
        selectedTargetKey,
        selectedNotation,
        INSTRUMENTS_PITCHES
      )} | Scale Transposition`,
    ],
    [Language.French]: [
      `${getNote(
        selectedNote,
        selectedNotation,
        SCALES
      )} ${modeText} de ${getNote(
        selectedOriginKey,
        selectedNotation,
        INSTRUMENTS_PITCHES
      )} à ${getNote(
        selectedTargetKey,
        selectedNotation,
        INSTRUMENTS_PITCHES
      )} | Transposition de gamme`,
    ],
    [Language.Spanish]: [
      `${getNote(
        selectedNote,
        selectedNotation,
        SCALES
      )} ${modeText} de ${getNote(
        selectedOriginKey,
        selectedNotation,
        INSTRUMENTS_PITCHES
      )} a ${getNote(
        selectedTargetKey,
        selectedNotation,
        INSTRUMENTS_PITCHES
      )} | Transposición de escala`,
    ],
    [Language.German]: [
      `${getNote(
        selectedNote,
        selectedNotation,
        SCALES
      )} ${modeText} von ${getNote(
        selectedOriginKey,
        selectedNotation,
        INSTRUMENTS_PITCHES
      )} nach ${getNote(
        selectedTargetKey,
        selectedNotation,
        INSTRUMENTS_PITCHES
      )} | Tonleiter-Transposition`,
    ],
  };

  const pageTitleText = useTranslationLegacy(
    selectedLanguage,
    titleTextTranslations,
    [
      selectedTargetKey,
      selectedNotation,
      selectedMode,
      selectedNote,
      selectedOriginKey,
    ]
  );
  useChangePageTitle(pageTitleText[0] as unknown as string);

  const isMobile = useIsMobile();

  const listOfInstruments = LIST_OF_INSTRUMENTS[selectedLanguage];

  const selectOptions: OptionType[] = INSTRUMENTS_PITCHES.flatMap(
    (pitch, index) => {
      const instruments = listOfInstruments?.[index] as string[] | undefined;
      const pitchName = pitch[selectedNotation];

      return instruments
        ? instruments.map((instrument) => ({
            label: `${pitchName} | ${instrument}`,
            value: `${pitchName}_${instrument}`.replace(/\s/g, '_'),
          }))
        : [];
    }
  ).sort((a, b) => {
    const instrumentNameA = a.label.split('|')[1].trim();
    const instrumentNameB = b.label.split('|')[1].trim();
    return instrumentNameA.localeCompare(instrumentNameB);
  });

  function getInstrumentKey(value: string, notation: keyof Note): number {
    const trimmedValue = value.trim();
    return INSTRUMENTS_PITCHES.findIndex((note) => {
      const parts = note[notation].split(' / ').map((part) => part.trim());

      return parts.includes(trimmedValue);
    });
  }

  function createHandleChange(
    setState: React.Dispatch<React.SetStateAction<number>>,
    setInstrumentState: React.Dispatch<
      React.SetStateAction<SingleValue<OptionType>>
    >
  ) {
    return (option: SingleValue<OptionType>) => {
      if (option) {
        setInstrumentState(option);

        const [pitch] = option.value.split('_');
        const instrumentKey = getInstrumentKey(pitch, selectedNotation);

        if (!isNaN(instrumentKey)) {
          setState(instrumentKey);
        }
      }
    };
  }

  return (
    <ContentPage className="simple-transposition">
      <ContentCard>
        <ContentCard level={2}>
          <ModeSelector
            selectedMode={selectedMode}
            handleChangeMode={handleChangeMode}
            showAdditionalModes={showAdditionalModes}
            setShowAdditionalModes={setShowAdditionalModes}
          />
        </ContentCard>
        <h2 className="mb-3">
          {t('transposition.crossInstruments.toolDescription')}
        </h2>
      </ContentCard>
      <ContentCard>
        <ContentCard level={2}>
          <div className="simple-transposition__origin-key-select w-full mb-3">
            <div className="flex items-center gap-2">
              {t('transposition.common.originKey')}
              <SelectComponent
                onChange={createHandleChange(
                  setSelectedOriginKey,
                  setSelectedOriginOption
                )}
                options={selectOptions}
                value={selectedOriginOption}
                placeHolder={t('transposition.common.instrumentPlaceholder')}
              />
            </div>

            <NoteSelector
              selected={selectedOriginKey}
              setSelected={handleChangeOriginKey}
              colour="sky"
              usedScale={INSTRUMENTS_PITCHES}
            />
          </div>
        </ContentCard>
        <ContentCard level={2}>
          <div className="simple-transposition__note-select w-full mb-3">
            {t('transposition.common.scale')}
            <NoteSelector
              selected={selectedNote}
              setSelected={handleChangeNote}
              usedScale={SCALES}
              blackNotesAreHalf={true}
              colour="purple"
            />
          </div>
        </ContentCard>
        <ContentCard level={2}>
          <div className="simple-transposition__target-key-select w-full mb-3">
            <div className="flex items-center gap-2">
              {t('transposition.common.targetKey')}
              <SelectComponent
                onChange={createHandleChange(
                  setSelectedTargetKey,
                  setSelectedTargetOption
                )}
                options={selectOptions}
                value={selectedTargetOption}
                placeHolder={t('transposition.common.instrumentPlaceholder')}
              />
            </div>
            <NoteSelector
              selected={selectedTargetKey}
              setSelected={handleChangeTargetKey}
              colour="red"
              usedScale={INSTRUMENTS_PITCHES}
            />
          </div>
        </ContentCard>
      </ContentCard>
      <ContentCard>
        <output>
          <ContentCard level={2}>
            <p className="mb-3">
              {selectedOriginKey === selectedTargetKey ? (
                <Trans
                  i18nKey="transposition.crossInstruments.sameKeyMessage"
                  values={{
                    scale: getNote(selectedNote, selectedNotation, SCALES),
                    mode: modeText,
                    originKey: getNote(
                      selectedOriginKey,
                      selectedNotation,
                      INSTRUMENTS_PITCHES
                    ),
                    notes: notesSuite,
                  }}
                  components={{
                    0: <span className="border-b-4 border-purple-300" />,
                    1: <span className="border-b-4 border-sky-300" />,
                    2: <span className="font-bold text-lg" />,
                  }}
                />
              ) : (
                <Trans
                  i18nKey="transposition.crossInstruments.transpositionMessage"
                  values={{
                    scale: getNote(selectedNote, selectedNotation, SCALES),
                    mode: modeText,
                    originKey: getNote(
                      selectedOriginKey,
                      selectedNotation,
                      INSTRUMENTS_PITCHES
                    ),
                    notes: notesSuite,
                    targetScale: getNote(targetNote, selectedNotation, SCALES),
                    transposedNotes: transposedScaleNotesSuite,
                    targetKey: getNote(
                      selectedTargetKey,
                      selectedNotation,
                      INSTRUMENTS_PITCHES
                    ),
                  }}
                  components={{
                    0: <span className="border-b-4 border-purple-400" />,
                    1: <span className="border-b-4 border-sky-300" />,
                    2: <span className="font-bold text-lg" />,
                    3: <span className="border-b-4 border-yellow-300" />,
                    4: <span className="font-bold text-lg" />,
                    5: <span className="border-b-4 border-red-300" />,
                  }}
                />
              )}
            </p>
            <div
              className={`scale-transposition__staff-container flex ${
                isMobile
                  ? 'flex-col gap-24 mt-16 mb-16'
                  : 'flex-row gap-5 mt-20 mb-20'
              }`}
            >
              <Staff
                displayedNotes={scale.reducedNotes}
                correspondingNotes={scale.notesInScale}
                musicalKey={originKeySignature}
                text={t('transposition.common.staffLabel', {
                  key: getNote(
                    selectedOriginKey,
                    selectedNotation,
                    INSTRUMENTS_PITCHES
                  ),
                })}
                colour="sky"
                noteColour="purple"
              />
              <Staff
                displayedNotes={transposedScale.reducedNotes}
                correspondingNotes={transposedScale.notesInScale}
                musicalKey={targetKeySignature}
                text={t('transposition.common.staffLabel', {
                  key: getNote(
                    selectedTargetKey,
                    selectedNotation,
                    INSTRUMENTS_PITCHES
                  ),
                })}
                colour="red"
                noteColour="yellow"
              />
            </div>
          </ContentCard>
        </output>
        <CircleOfFifth
          modeIndex={selectedMode}
          selectedStartNote={selectedNote}
          targetNote={targetNote}
          setSelectedMode={handleChangeMode}
          selectedOriginKey={selectedOriginKey}
          selectedTargetKey={selectedTargetKey}
          showAdditionalModes={showAdditionalModes}
        />
      </ContentCard>
    </ContentPage>
  );
}

export default CrossInstrumentsScaleTransposition;
