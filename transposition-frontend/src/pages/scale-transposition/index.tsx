import React, { useEffect, useState } from 'react';
import { getNote, Note, SCALES } from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { scaleTransposer } from '../../utils/transposer';
import { Key, scaleBuilder } from '../../utils/scaleBuilder';
import Button from '../../components/button';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
import { getModeName, MODES } from '../../utils/modes';
import { useNavigate, useParams } from 'react-router-dom';
import Staff from '../../components/staff';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import ButtonsFlexContainer from '../../components/button/ButtonsFlexContainer';
import ModeSelector from '../../components/mode-selector';
import CircleOfFifth from '../../components/circle-of-fifth';

const MAX_ORIGIN_KEY = 11;
const MAX_NOTE = 16;
const MAX_TARGET_KEY = 11;
const MAX_MODE = 6;

function ScaleTransposition({
    selectedNotation,
    selectedLanguage,
}: {
    selectedNotation: keyof Note;
    selectedLanguage: Language;
}) {
    const { linkParams } = useParams();
    const navigate = useNavigate();

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

    const targetNote = scaleTransposer(
        selectedNote,
        selectedOriginKey,
        selectedTargetKey,
        selectedMode
    );
    const scale = scaleBuilder(selectedNote, selectedMode);

    useEffect(() => {
        if ([originKey, note, targetKey].some(isNaN)) {
            navigate('0-0-0-0', { replace: true }); // Redirect to default if invalid
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

    const translations: Translations = {
        [Language.English]: [
            "Transpose a full scale in any mode from one instrument's key to another:",
            'Origin key:',
            'Scale:',
            'Target key:',
        ],
        [Language.French]: [
            "Transposez une gamme complète, dans n'importe quel mode, d'une tonalité d'un instrument à une autre:",
            "Tonalité d'origine:",
            'Gamme:',
            'Tonalité cible:',
        ],
        [Language.Spanish]: [
            'Transpone una escala completa en cualquier modo de la tonalidad de un instrumento a otra:',
            'Tonalidad de origen:',
            'Escala:',
            'Tonalidad objetivo:',
        ],
        [Language.German]: [
            'Transponiere eine vollständige Tonleiter in einem beliebigen Modus von der Tonart eines Instruments auf eine andere:',
            'Ursprungstonalität:',
            'Tonleiter:',
            'Zieltonalität:',
        ],
    };

    const translatedText = useTranslation(selectedLanguage, translations, []);

    const modeText = getModeName(selectedMode, selectedLanguage);

    function handleChangeOriginKey(newOriginKey: number) {
        setSelectedOriginKey(newOriginKey);
        navigate(
            `/scale/${newOriginKey}-${selectedNote}-${selectedTargetKey}-${selectedMode}`,
            { replace: true }
        );
    }

    function handleChangeNote(newNote: number) {
        setSelectedNote(newNote);
        navigate(
            `/scale/${selectedOriginKey}-${newNote}-${selectedTargetKey}-${selectedMode}`,
            { replace: true }
        );
    }

    function handleChangeTargetKey(newTargetKey: number) {
        setSelectedTargetKey(newTargetKey);
        navigate(
            `/scale/${selectedOriginKey}-${selectedNote}-${newTargetKey}-${selectedMode}`,
            { replace: true }
        );
    }

    function handleChangeMode(newMode: number) {
        setSelectedMode(newMode);
        navigate(
            `/scale/${selectedOriginKey}-${selectedNote}-${selectedTargetKey}-${newMode}`,
            { replace: true }
        );
    }

    const englishMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`The scale of `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` for an instrument in `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                ,{` consists of the following notes:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {
                    'No transposition is needed because the origin and target keys are the same.'
                }
            </>
        ) : (
            <>
                {`The scale of `}
                <span className="border-b-4 border-purple-400">
                    {getNote(selectedNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` for an instrument in `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                ,{` consists of the following notes:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {`This becomes the scale of `}
                <span className="border-b-4 border-yellow-300">
                    {getNote(targetNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` with the following notes: `}{' '}
                <span className="font-bold text-lg">
                    {transposedScaleNotesSuite}
                </span>{' '}
                {`when transposed for an instrument in `}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
                </span>
                .
            </>
        );

    const frenchMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`La gamme de `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` pour un instrument en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` consiste en la suite de notes suivante :`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {
                    "Aucune transposition n'est nécessaire car les tonalités d'origine et de destination sont identiques."
                }
            </>
        ) : (
            <>
                {`La gamme de `}
                <span className="border-b-4 border-purple-400">
                    {getNote(selectedNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` qui pour un instrument en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` consiste en la suite de notes suivante :`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {`Elle devient la gamme de `}
                <span className="border-b-4 border-yellow-300">
                    {getNote(targetNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` avec la suite de notes suivante : `}{' '}
                <span className="font-bold text-lg">
                    {transposedScaleNotesSuite}
                </span>
                , {`lorsqu'elle est transposée pour un instrument en `}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
                </span>
                .
            </>
        );

    const spanishMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`La escala de `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` que para un instrumento en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` consiste en la siguiente secuencia de notas:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.
                {
                    ' No hay transposición porque las tonalidades seleccionadas son iguales.'
                }
            </>
        ) : (
            <>
                {`La escala de `}
                <span className="border-b-4 border-purple-400">
                    {getNote(selectedNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` que para un instrumento en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` consiste en la siguiente secuencia de notas:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {`Se convierte en la escala de `}
                <span className="border-b-4 border-yellow-300">
                    {getNote(targetNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` con la siguiente secuencia de notas: `}{' '}
                <span className="font-bold text-lg">
                    {transposedScaleNotesSuite}
                </span>
                , {`cuando se transpone por un instrumento en `}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
                </span>
                .
            </>
        );

    const germanMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`Die Tonleiter von `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` die für ein Instrument in `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` notiert ist, setzt sich wie folgt zusammen:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {
                    'Keine Transposition erforderlich, da die Ursprungs- und Zieltonalität identisch sind.'
                }
            </>
        ) : (
            <>
                {`Die Tonleiter von `}
                <span className="border-b-4 border-purple-400">
                    {getNote(selectedNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` die für ein Instrument in `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` besteht, setzt sich wie folgt zusammen:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {`Diese Tonleiter wird umgewandelt in die Tonleiter von `}
                <span className="border-b-4 border-yellow-300">
                    {getNote(targetNote, selectedNotation, SCALES)} {modeText}
                </span>
                ,{` mit folgender Tonfolge: `}{' '}
                <span className="font-bold text-lg">
                    {transposedScaleNotesSuite}
                </span>
                , {`wenn sie für ein Instrument in `}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
                </span>
                {` zu spielen.`}
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
        [
            selectedNotation,
            selectedMode,
            selectedNote,
            selectedOriginKey,
            selectedTargetKey,
        ]
    );

    const message = translatedResults[0];

    const musicalStaffTextTranslations: Translations = {
        [Language.English]: [
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
        [Language.French]: [
            <>
                Instrument en{' '}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                :
            </>,
            <>
                Instrument en{' '}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
                </span>
                :
            </>,
        ],
        [Language.Spanish]: [
            <>
                Instrumento en{' '}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                :
            </>,
            <>
                Instrumento en{' '}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
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

    const titleTextTranslations: Translations = {
        [Language.English]: [
            `${getNote(
                selectedNote,
                selectedNotation,
                SCALES
            )} ${modeText} from ${getNote(
                selectedOriginKey,
                selectedNotation
            )} to ${getNote(
                selectedTargetKey,
                selectedNotation
            )} | Scale Transposition`,
        ],
        [Language.French]: [
            `${getNote(
                selectedNote,
                selectedNotation,
                SCALES
            )} ${modeText} de ${getNote(
                selectedOriginKey,
                selectedNotation
            )} à ${getNote(
                selectedTargetKey,
                selectedNotation
            )} | Transposition de gamme`,
        ],
        [Language.Spanish]: [
            `${getNote(
                selectedNote,
                selectedNotation,
                SCALES
            )} ${modeText} de ${getNote(
                selectedOriginKey,
                selectedNotation
            )} a ${getNote(
                selectedTargetKey,
                selectedNotation
            )} | Transposición de escala`,
        ],
        [Language.German]: [
            `${getNote(
                selectedNote,
                selectedNotation,
                SCALES
            )} ${modeText} von ${getNote(
                selectedOriginKey,
                selectedNotation
            )} nach ${getNote(
                selectedTargetKey,
                selectedNotation
            )} | Tonleiter-Transposition`,
        ],
    };

    const pageTitleText = useTranslation(
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

    return (
        <div className="content simple-transposition w-full">
            <ModeSelector
                selectedLanguage={selectedLanguage}
                selectedMode={selectedMode}
                handleChangeMode={handleChangeMode}
            />
            <h2 className="mb-3">{translatedText[0]}</h2>
            <div className="simple-transposition__origin-key-select w-full mb-3">
                {translatedText[1]}
                <NoteSelector
                    selected={selectedOriginKey}
                    setSelected={handleChangeOriginKey}
                    selectedNotation={selectedNotation}
                    colour="sky"
                />
            </div>
            <div className="simple-transposition__note-select w-full mb-3">
                {translatedText[2]}
                <NoteSelector
                    selected={selectedNote}
                    setSelected={handleChangeNote}
                    selectedNotation={selectedNotation}
                    usedScale={SCALES}
                    blackNotesAreHalf={true}
                    colour="purple"
                />
            </div>
            <div className="simple-transposition__target-key-select w-full mb-3">
                {translatedText[3]}
                <NoteSelector
                    selected={selectedTargetKey}
                    setSelected={handleChangeTargetKey}
                    selectedNotation={selectedNotation}
                    colour="red"
                />
            </div>
            <p className="mb-3">{message}</p>
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
                    selectedNotation={selectedNotation}
                    text={musicalStaffText[0]}
                    colour="sky"
                    noteColour="purple"
                />
                <Staff
                    displayedNotes={transposedScale.reducedNotes}
                    correspondingNotes={transposedScale.notesInScale}
                    musicalKey={targetKeySignature}
                    selectedNotation={selectedNotation}
                    text={musicalStaffText[1]}
                    colour="red"
                    noteColour="yellow"
                />
            </div>
            <CircleOfFifth
                modeIndex={selectedMode}
                selectedNotation={selectedNotation}
                selectedLanguage={selectedLanguage}
                selectedStartNote={selectedNote}
                targetNote={targetNote}
            />
        </div>
    );
}

export default ScaleTransposition;
