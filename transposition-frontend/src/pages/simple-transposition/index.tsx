import React, { useContext, useState } from 'react';
import {
    getNote,
    INSTRUMENTS_PITCHES,
    Note,
    REDUCED_NOTES,
    SCALES,
} from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { crossInstrumentsTransposer } from '../../utils/transposer';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
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
import VexflowStave from "../../components/vexflow/vexflowRender";
import VexFlowExample from '../../components/vexflow/vexflowRender';

const MAX_NOTE = 11;

function SimpleTransposition() {
    const { selectedNotation } = useContext(NotationContext);
    const { linkParams } = useParams();
    const navigate = useNavigate();

    const languageContext = useContext(LanguageContext);
    const selectedLanguage = languageContext.selectedLanguage;

    const [originKeyString, noteString, targetKeyString, modeString] =
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
            const instruments = listOfInstruments?.[index] as
                | string[]
                | undefined;
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
            const parts = note[notation]
                .split(' / ')
                .map((part) => part.trim());

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

    const translations: Translations = {
        [Language.English]: [
            'Transpose a single note from a tonality to another:',
            'Origin key:',
            'Note:',
            'Target key:',
        ],
        [Language.French]: [
            "Transposez une note d'une tonalité à une autre:",
            "Tonalité d'origine:",
            'Note:',
            "Tonalité d'arrivée:",
        ],
        [Language.Spanish]: [
            'Transpone una nota de una tonalidad a otra:',
            'Tonalidad de origen:',
            'Nota:',
            'Tonalidad de destino:',
        ],
        [Language.German]: [
            'Transponiere eine Note von einer Tonalität in eine andere:',
            'Ursprungstonalität:',
            'Note:',
            'Zieltonalität:',
        ],
    };

    const translatedText = useTranslation(selectedLanguage, translations, []);

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

    const englishMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`A `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` for an instrument in `}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                {` stays the same because the origin and target keys are the same.`}
            </>
        ) : (
            <>
                {`A `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` in for an instrument in `}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                {` becomes a `}
                <span className="border-b-4 border-yellow-300 font-bold text-lg">
                    {getNote(targetNote, selectedNotation)}
                </span>
                {` for an instrument in `}
                <span className="border-b-4 border-red-300">
                    {getNote(
                        selectedTargetKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                .
            </>
        );

    const frenchMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`Un `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` pour un instrument en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                {` reste le même car les tonalités d'origine et de destination sont identiques.`}
            </>
        ) : (
            <>
                {`Un `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` pour un instrument en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                {` devient un `}
                <span className="border-b-4 border-yellow-300 font-bold text-lg">
                    {getNote(targetNote, selectedNotation)}
                </span>
                {` pour un instrument en `}
                <span className="border-b-4 border-red-300">
                    {getNote(
                        selectedTargetKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                .
            </>
        );

    const spanishMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`Una `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` para un instrumento en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                {` sigue siendo la misma porque las tonalidades de origen y destino son iguales.`}
            </>
        ) : (
            <>
                {`Una `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` para un instrumento en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                {` se convierte en `}
                <span className="border-b-4 border-yellow-300 font-bold text-lg">
                    {getNote(targetNote, selectedNotation)}
                </span>
                {` para un instrumento en `}
                <span className="border-b-4 border-red-300">
                    {getNote(
                        selectedTargetKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                .
            </>
        );

    const germanMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`Eine ${getNote(
                    selectedNote,
                    selectedNotation
                )} für ein Instrument in ${getNote(
                    selectedOriginKey,
                    selectedNotation,
                    INSTRUMENTS_PITCHES
                )} bleibt unverändert, da die Ursprungs- und Zieltonalität identisch sind.`}
            </>
        ) : (
            <>
                {`Eine ${getNote(
                    selectedNote,
                    selectedNotation
                )} für ein Instrument in ${getNote(
                    selectedOriginKey,
                    selectedNotation,
                    INSTRUMENTS_PITCHES
                )} wird in`}{' '}
                <span className={'font-bold text-lg'}>
                    {getNote(targetNote, selectedNotation)}
                </span>{' '}
                {`für ein Instrumentin ${getNote(
                    selectedTargetKey,
                    selectedNotation,
                    INSTRUMENTS_PITCHES
                )} transponiert`}
            </>
        );

    const resultTranslations: Translations = {
        [Language.English]: [englishMessage],
        [Language.French]: [frenchMessage],
        [Language.Spanish]: [spanishMessage],
        [Language.German]: [germanMessage],
    };

    const translatedResults = useTranslation(
        selectedLanguage,
        resultTranslations,
        [selectedNotation, selectedNote, selectedOriginKey, selectedTargetKey]
    );

    const message = translatedResults[0];

    const titleTextTranslations: Translations = {
        [Language.English]: [
            `${getNote(selectedNote, selectedNotation)} from ${getNote(
                selectedOriginKey,
                selectedNotation,
                INSTRUMENTS_PITCHES
            )} to ${getNote(
                selectedTargetKey,
                selectedNotation,
                INSTRUMENTS_PITCHES
            )} | Note Transposition`,
        ],
        [Language.French]: [
            `${getNote(selectedNote, selectedNotation)} de ${getNote(
                selectedOriginKey,
                selectedNotation,
                INSTRUMENTS_PITCHES
            )} à ${getNote(
                selectedTargetKey,
                selectedNotation,
                INSTRUMENTS_PITCHES
            )} | Transposition de note`,
        ],
        [Language.Spanish]: [
            `${getNote(selectedNote, selectedNotation)} de ${getNote(
                selectedOriginKey,
                selectedNotation,
                INSTRUMENTS_PITCHES
            )} a ${getNote(
                selectedTargetKey,
                selectedNotation,
                INSTRUMENTS_PITCHES
            )} | Transposición de nota`,
        ],
        [Language.German]: [
            `${getNote(selectedNote, selectedNotation)} von ${getNote(
                selectedOriginKey,
                selectedNotation,
                INSTRUMENTS_PITCHES
            )} nach ${getNote(
                selectedTargetKey,
                selectedNotation,
                INSTRUMENTS_PITCHES
            )} | Tontransposition`,
        ],
    };

    const pageTitleText = useTranslation(
        selectedLanguage,
        titleTextTranslations,
        [selectedTargetKey, selectedNotation, selectedNote, selectedOriginKey]
    );
    useChangePageTitle(pageTitleText[0] as unknown as string);

    const isMobile = useIsMobile();

    function defineCorrespondingNotes(reversedEnharmonicGroupNotes: number[]) {
        let correspondingNotes: Note[] = [];

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

    const musicalStaffTextTranslations: Translations = {
        [Language.English]: [
            <>
                Instrument in{' '}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                :
            </>,
            <>
                Instrument in{' '}
                <span className="border-b-4 border-red-300">
                    {getNote(
                        selectedTargetKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                :
            </>,
        ],
        [Language.French]: [
            <>
                Instrument en{' '}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                :
            </>,
            <>
                Instrument en{' '}
                <span className="border-b-4 border-red-300">
                    {getNote(
                        selectedTargetKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                :
            </>,
        ],
        [Language.Spanish]: [
            <>
                Instrumento en{' '}
                <span className="border-b-4 border-sky-300">
                    {getNote(
                        selectedOriginKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                :
            </>,
            <>
                Instrumento en{' '}
                <span className="border-b-4 border-red-300">
                    {getNote(
                        selectedTargetKey,
                        selectedNotation,
                        INSTRUMENTS_PITCHES
                    )}
                </span>
                :
            </>,
        ],
        [Language.German]: [
            <>
                Instrument in{' '}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                :
            </>,
            <>
                Instrument in{' '}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
                </span>
                :
            </>,
        ],
    };

    const musicalStaffText = useTranslation(
        selectedLanguage,
        musicalStaffTextTranslations,
        [selectedNotation, selectedOriginKey, selectedTargetKey]
    );

    return (
        <div className="content simple-transposition w-full">
            <h2 className="mb-3">{translatedText[0]}</h2>
            <div className="simple-transposition__origin-key-select w-full mb-3">
                <div className="flex items-center gap-2">
                    {translatedText[1]}
                    <SelectComponent
                        onChange={createHandleChange(
                            setSelectedOriginKey,
                            setSelectedOriginOption
                        )}
                        options={selectOptions}
                        value={selectedOriginOption}
                        placeHolder="Select or search for an instrument"
                    />
                </div>

                <NoteSelector
                    selected={selectedOriginKey}
                    setSelected={handleChangeOriginKey}
                    colour="sky"
                    usedScale={INSTRUMENTS_PITCHES}
                />
            </div>
            <div className="simple-transposition__note-select w-full mb-3">
                {translatedText[2]}
                <NoteSelector
                    selected={selectedNote}
                    setSelected={handleChangeNote}
                    colour="purple"
                />
            </div>
            <div className="simple-transposition__target-key-select w-full mb-3">
                <div className="flex items-center gap-2">
                    {translatedText[3]}
                    <SelectComponent
                        onChange={createHandleChange(
                            setSelectedTargetKey,
                            setSelectedTargetOption
                        )}
                        options={selectOptions}
                        value={selectedTargetOption}
                        placeHolder="Select or search for an instrument"
                    />
                </div>
                <NoteSelector
                    selected={selectedTargetKey}
                    setSelected={handleChangeTargetKey}
                    colour="red"
                    usedScale={INSTRUMENTS_PITCHES}
                />
            </div>
            <p className="mb-3">{message}</p>
            <div
                className={`note-transposition__staff-container flex ${
                    isMobile
                        ? 'flex-col gap-24 mt-16 mb-16'
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
                        noteColour="yellow"
                    />
                )}
            </div>
            <VexflowStave alteration={"flat"} alteredNotes={[0,0,0,0,0, 4, 5, 2]} />
        </div>
    );
}

export default SimpleTransposition;
