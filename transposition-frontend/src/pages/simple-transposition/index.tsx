import { useContext, useState } from 'react';
import {
  getNote,
  INSTRUMENTS_PITCHES,
  Note,
  REDUCED_NOTES,
  SCALES,
} from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { crossInstrumentsTransposer } from '../../utils/transposer';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import Staff from '../../components/staff';
import { useIsMobile } from '../../hooks/useIsMobile';
import { NoteInScale } from '../../utils/scaleBuilder';
import LanguageContext from '../../contexts/LanguageContext';
import NotationContext from '../../contexts/NotationContext';
import { SingleValue } from 'react-select';
import SelectComponent, { OptionType } from '../../components/select';
import { LIST_OF_INSTRUMENTS } from '../../utils/instruments';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';

const MAX_NOTE = 11;

function SimpleTransposition() {
  const { selectedNotation } = useContext(NotationContext);
  const { linkParams } = useParams();
  const navigate = useNavigate();

  const languageContext = useContext(LanguageContext);
  const selectedLanguage = languageContext.selectedLanguage;

  const [originKeyString, noteString, targetKeyString] =
    linkParams?.split('-') || [];

  function validateParam(value: string, max: number) {
    const numValue = Number(value);
    return !isNaN(numValue) && numValue <= max ? numValue : 0;
  }

  const originKey = validateParam(originKeyString, MAX_NOTE);
  const note = validateParam(noteString, MAX_NOTE);
  const targetKey = validateParam(targetKeyString, MAX_NOTE);

  const [selectedOriginKey, setSelectedOriginKey] = useState<number>(
    Number(originKey) || 0
  );
  const [selectedNote, setSelectedNote] = useState<number>(Number(note) || 0);
  const [selectedTargetKey, setSelectedTargetKey] = useState<number>(
    Number(targetKey) || 0
  );
  const [selectedOriginOption, setSelectedOriginOption] =
    useState<SingleValue<OptionType>>(null);
  const [selectedTargetOption, setSelectedTargetOption] =
    useState<SingleValue<OptionType>>(null);

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

  function handleChangeOriginKey(newOriginKey: number) {
    setSelectedOriginKey(newOriginKey);
    navigate(`/note/${newOriginKey}-${selectedNote}-${selectedTargetKey}`, {
      replace: true,
    });
  }

  function handleChangeNote(newNote: number) {
    setSelectedNote(newNote);
    navigate(`/note/${selectedOriginKey}-${newNote}-${selectedTargetKey}`, {
      replace: true,
    });
  }

  function handleChangeTargetKey(newTargetKey: number) {
    setSelectedTargetKey(newTargetKey);
    navigate(`/note/${selectedOriginKey}-${selectedNote}-${newTargetKey}`, {
      replace: true,
    });
  }

  const { t } = useTranslation();

  const [_, reversedEnharmonicOriginGroupNotes] = crossInstrumentsTransposer(
    selectedNote,
    selectedOriginKey,
    selectedOriginKey
  );

  const [targetNote, reversedEnharmonicTargetGroupNotes] =
    crossInstrumentsTransposer(
      selectedNote,
      selectedOriginKey,
      selectedTargetKey
    );

  const message =
    selectedOriginKey === selectedTargetKey ? (
      <>
        <Trans
          i18nKey="transposition.simpleTransposition.sameKeyMessage"
          values={{
            note: getNote(selectedNote, selectedNotation),
            originKey: getNote(
              selectedOriginKey,
              selectedNotation,
              INSTRUMENTS_PITCHES
            ),
          }}
          components={[
            <span className="border-b-4 border-purple-300" />,
            <span className="border-b-4 border-sky-300" />,
            <span className="border-b-4 border-purple-300" />,
          ]}
        />
      </>
    ) : (
      <>
        <Trans
          i18nKey="transposition.simpleTransposition.transpositionMessage"
          values={{
            note: getNote(selectedNote, selectedNotation),
            originKey: getNote(
              selectedOriginKey,
              selectedNotation,
              INSTRUMENTS_PITCHES
            ),
            transposedNote: getNote(targetNote, selectedNotation),
            targetKey: getNote(
              selectedTargetKey,
              selectedNotation,
              INSTRUMENTS_PITCHES
            ),
          }}
          components={[
            <span className="border-b-4 border-purple-300" />,
            <span className="border-b-4 border-sky-300" />,
            <span className="border-b-4 border-amber-300 font-bold text-lg" />,
            <span className="border-b-4 border-red-300" />,
          ]}
        />
      </>
    );

  const pageTitle = t('transposition.simpleTransposition.pageTitle', {
    note: getNote(selectedNote, selectedNotation),
    originKey: getNote(
      selectedOriginKey,
      selectedNotation,
      INSTRUMENTS_PITCHES
    ),
    targetKey: getNote(
      selectedTargetKey,
      selectedNotation,
      INSTRUMENTS_PITCHES
    ),
  });
  useChangePageTitle(pageTitle);

  const isMobile = useIsMobile();

  function defineCorrespondingNotes(reversedEnharmonicGroupNotes: number[]) {
    if (reversedEnharmonicGroupNotes.length > 1) {
      const firstNote = SCALES[reversedEnharmonicGroupNotes[0]];
      const secondNote = SCALES[reversedEnharmonicGroupNotes[1]];

      return [{ note: firstNote }, { note: secondNote }];
    }

    return [{ note: SCALES[reversedEnharmonicGroupNotes[0]] }];
  }

  const correspondingOriginNotes = defineCorrespondingNotes(
    reversedEnharmonicOriginGroupNotes
  );
  const correspondingTargetNotes = defineCorrespondingNotes(
    reversedEnharmonicTargetGroupNotes
  );

  function defineDisplayedNotes(reversedEnharmonicGroupNotes: number[]) {
    return reversedEnharmonicGroupNotes
      .map((noteIndex) => {
        const note = SCALES[noteIndex].english.charAt(0);
        return REDUCED_NOTES.findIndex(
          (reducedNote) => reducedNote.english === note
        );
      })
      .filter((index) => index !== null); // Remove any null values
  }

  const displayedOriginNotes = defineDisplayedNotes(
    reversedEnharmonicOriginGroupNotes
  );
  const displayedTargetNotes = defineDisplayedNotes(
    reversedEnharmonicTargetGroupNotes
  );

  const musicalStaffText = [
    <Trans
      i18nKey="transposition.common.staffLabel"
      values={{
        key: getNote(selectedOriginKey, selectedNotation, INSTRUMENTS_PITCHES),
      }}
      components={[<span className="border-b-4 border-sky-300" />]}
    />,
    <Trans
      i18nKey="transposition.common.staffLabel"
      values={{
        key: getNote(selectedTargetKey, selectedNotation, INSTRUMENTS_PITCHES),
      }}
      components={[<span className="border-b-4 border-red-300" />]}
    />,
  ];

  return (
    <ContentPage className={'simple-transposition'}>
      <ContentCard>
        <h2 className="mb-3">
          {t('transposition.simpleTransposition.toolDescription')}
        </h2>
      </ContentCard>
      <ContentCard>
        <ContentCard level={2}>
          <div className="simple-transposition__origin-key-select w-full mb-3">
            <div className="flex items-center gap-2">
              <label>{t('transposition.common.originKey')}</label>
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
            <label>{t('transposition.common.note')}</label>
            <NoteSelector
              selected={selectedNote}
              setSelected={handleChangeNote}
              colour="purple"
            />
          </div>
        </ContentCard>

        <ContentCard level={2}>
          <div className="simple-transposition__target-key-select w-full mb-3">
            <div className="flex items-center gap-2">
              <label>{t('transposition.common.targetKey')}</label>
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
          <p className="mb-3">{message}</p>
          <div
            className={`note-transposition__staff-container flex ${
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
                displayedOriginNotes.length > 1 ? ['sharp', 'flat'] : undefined
              }
              text={musicalStaffText[0]}
              colour="sky"
              noteColour="purple"
            />
            {selectedOriginKey !== selectedTargetKey && (
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
                text={musicalStaffText[1]}
                colour="red"
                noteColour="amber"
              />
            )}
          </div>
        </output>
      </ContentCard>

      {/*<VexflowStave alteration={"flat"} alteredNotes={[0,0,0,0,0, 4, 5, 2]} />*/}
    </ContentPage>
  );
}

export default SimpleTransposition;
