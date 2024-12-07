import React, { useContext, useEffect, useState } from 'react';
import { getNote, INSTRUMENTS_PITCHES, Note, SCALES } from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import {
    enharmonicGroupTransposer,
    scaleCrossInstrumentsTransposer,
    scaleTransposer,
} from '../../utils/transposer';
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
import { getIntervalName } from '../../utils/intervals';
import IntervalSelector from '../../components/interval-selector';
import LanguageContext from '../../contexts/LanguageContext';

const MAX_ORIGIN_KEY = 16;
const MAX_NOTE = 16;
const MAX_INTERVAL = 12;
const MAX_MODE = 6;

function IntervalsScaleTransposition({
    selectedNotation,
}: {
    selectedNotation: keyof Note;
}) {
    const { linkParams } = useParams();
    const navigate = useNavigate();

    const languageContext = useContext(LanguageContext);
    const selectedLanguage = languageContext.selectedLanguage;

    const [originKeyString, intervalString, modeString, directionString] =
        linkParams?.split('-') || [];

    function validateParam(value: string, max: number) {
        const numValue = Number(value);
        return !isNaN(numValue) && numValue <= max ? numValue : 0;
    }

    const originKey = validateParam(originKeyString, MAX_ORIGIN_KEY);
    const mode = validateParam(modeString, MAX_MODE);
    const interval = validateParam(intervalString, MAX_INTERVAL);
    const direction: 'up' | 'down' = directionString === 'down' ? 'down' : 'up';

    const [selectedOriginKey, setSelectedOriginKey] = useState<number>(
        Number(originKey) || 0
    );
    const [selectedInterval, setSelectedInterval] = useState<number>(
        Number(interval) || 0
    );
    const [selectedMode, setSelectedMode] = useState<number>(Number(mode) || 0);
    const [selectedDirection, setSelectedDirection] = useState<'up' | 'down'>(
        direction
    );
    const [showAdditionalModes, setShowAdditionalModes] = useState(
        selectedMode > 1
    );

    let targetKey = selectedOriginKey;

    if (selectedDirection === 'down') {
        targetKey =
            enharmonicGroupTransposer(selectedOriginKey) - selectedInterval;
    }

    if (selectedDirection === 'up') {
        targetKey =
            enharmonicGroupTransposer(selectedOriginKey) + selectedInterval;
    }

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

    const translations: Translations = {
        [Language.English]: [
            'Transpose a full scale in any mode from one origin key by a selected interval:',
            'Origin key:',
            "Interval's direction and interval",
            'Target key:',
        ],
        [Language.French]: [
            "Transposez une gamme complète, dans n'importe quel mode, d'une tonalité d'un instrument à une autre:",
            "Tonalité d'origine:",
            'Direction et intervalle:',
            'Tonalité cible:',
        ],
        [Language.Spanish]: [
            'Transpone una escala completa en cualquier modo de la tonalidad de un instrumento a otra:',
            'Tonalidad de origen:',
            'Dirección y intervalo:',
            'Tonalidad objetivo:',
        ],
        [Language.German]: [
            'Transponiere eine vollständige Tonleiter in einem beliebigen Modus von der Tonart eines Instruments auf eine andere:',
            'Ursprungstonalität:',
            'Richtung und Intervall:',
            'Zieltonalität:',
        ],
    };

    const translatedText = useTranslation(selectedLanguage, translations, []);

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

    const englishMessage = [0, 12].includes(selectedInterval) ? (
        <>
            {`The scale of `}
            <span className="border-b-4 border-purple-300">
                {getNote(originKey, selectedNotation, SCALES)} {modeText}
            </span>
            {` consists of the following notes:`}
            <span className="font-bold text-lg">{notesSuite}</span>.
            {selectedInterval === 0 &&
                ` No key change is needed because the interval of semitones is 0.`}
            {originKeySignature.alteration !==
                targetKeySignature.alteration && (
                <>
                    {` However, a potentially simpler enharmonic equivalent is the scale of `}
                    <span className="border-b-4 border-yellow-300">
                        {getNote(targetNote, selectedNotation, SCALES)}{' '}
                        {modeText}
                    </span>
                    {`, consisting of the following notes: `}
                    <span className="font-bold text-lg">
                        {transposedScaleNotesSuite}
                    </span>
                    {'.'}
                </>
            )}
        </>
    ) : (
        <>
            {`The scale of `}
            <span className="border-b-4 border-purple-400">
                {getNote(originKey, selectedNotation, SCALES)} {modeText}
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
            {`when transposed ${selectedDirection.toLowerCase()} by one ${getIntervalName(
                selectedInterval,
                selectedLanguage
            )}.`}
        </>
    );

    const frenchMessage = [0, 12].includes(selectedInterval) ? (
        <>
            {`L'échelle de `}
            <span className="border-b-4 border-purple-300">
                {getNote(originKey, selectedNotation, SCALES)} {modeText}
            </span>
            {` se compose des notes suivantes : `}
            <span className="font-bold text-lg">{notesSuite}</span>.
            {selectedInterval === 0 &&
                ` Aucun changement de tonalité n'est nécessaire car l'intervalle de demi-tons est de 0.`}
            {originKeySignature.alteration !==
                targetKeySignature.alteration && (
                <>
                    {` Cependant, un équivalent enharmonique potentiellement plus simple est l'échelle de `}
                    <span className="border-b-4 border-yellow-300">
                        {getNote(targetNote, selectedNotation, SCALES)}{' '}
                        {modeText}
                    </span>
                    {`, qui se compose des notes suivantes : `}
                    <span className="font-bold text-lg">
                        {transposedScaleNotesSuite}
                    </span>
                    {'.'}
                </>
            )}
        </>
    ) : (
        <>
            {`La gamme de `}
            <span className="border-b-4 border-purple-400">
                {getNote(originKey, selectedNotation, SCALES)} {modeText}
            </span>
            ,{` se compose des notes suivantes : `}{' '}
            <span className="font-bold text-lg">{notesSuite}</span>.{' '}
            {`Elle devient la gamme de `}
            <span className="border-b-4 border-yellow-300">
                {getNote(targetNote, selectedNotation, SCALES)} {modeText}
            </span>
            ,{` avec les notes suivantes : `}{' '}
            <span className="font-bold text-lg">
                {transposedScaleNotesSuite}
            </span>{' '}
            {`lorsqu'elle est transposée en ${
                selectedDirection === 'up' ? 'haut' : 'bas'
            } d'une ${getIntervalName(selectedInterval, selectedLanguage)}.`}
        </>
    );

    const spanishMessage = [0, 12].includes(selectedInterval) ? (
        <>
            {`La escala de `}
            <span className="border-b-4 border-purple-300">
                {getNote(originKey, selectedNotation, SCALES)} {modeText}
            </span>
            {` se compone de las siguientes notas: `}{' '}
            <span className="font-bold text-lg">{notesSuite}</span>.
            {selectedInterval === 0 &&
                ` No hay necesidad de cambiar de tonalidad porque el intervalo de semitono es de 0.`}
            {originKeySignature.alteration !==
                targetKeySignature.alteration && (
                <>
                    {` Sin embargo, una enharmónica equivalente potencialmente más simple es la escala de `}
                    <span className="border-b-4 border-yellow-300">
                        {getNote(targetNote, selectedNotation, SCALES)}{' '}
                        {modeText}
                    </span>
                    {`, que se compone de las siguientes notas: `}
                    <span className="font-bold text-lg">
                        {transposedScaleNotesSuite}
                    </span>
                    {'.'}
                </>
            )}
        </>
    ) : (
        <>
            {`La escala de `}
            <span className="border-b-4 border-purple-400">
                {getNote(originKey, selectedNotation, SCALES)} {modeText}
            </span>
            ,{` se compone de las siguientes notas: `}{' '}
            <span className="font-bold text-lg">{notesSuite}</span>.{' '}
            {`Se convierte en la escala de `}
            <span className="border-b-4 border-yellow-300">
                {getNote(targetNote, selectedNotation, SCALES)} {modeText}
            </span>
            ,{` con las siguientes notas: `}{' '}
            <span className="font-bold text-lg">
                {transposedScaleNotesSuite}
            </span>{' '}
            {`cuando se transpone ${
                selectedDirection === 'up' ? 'hacia arriba' : 'hacia abajo'
            } por una ${getIntervalName(selectedInterval, selectedLanguage)}.`}
        </>
    );

    const germanMessage = [0, 12].includes(selectedInterval) ? (
        <>
            {`Die Tonleiter von `}
            <span className="border-b-4 border-purple-300">
                {getNote(originKey, selectedNotation, SCALES)} {modeText}
            </span>
            {` besteht aus den folgenden Noten: `}
            <span className="font-bold text-lg">{notesSuite}</span>.
            {selectedInterval === 0 &&
                ` Es ist keine Tonartänderung erforderlich, da das Intervall in Halbtönen 0 beträgt.`}
            {originKeySignature.alteration !==
                targetKeySignature.alteration && (
                <>
                    {` Ein potenziell einfacheres enharmonisches Äquivalent ist jedoch die Tonleiter von `}
                    <span className="border-b-4 border-yellow-300">
                        {getNote(targetNote, selectedNotation, SCALES)}{' '}
                        {modeText}
                    </span>
                    {`, die aus den folgenden Noten besteht: `}
                    <span className="font-bold text-lg">
                        {transposedScaleNotesSuite}
                    </span>
                    {'.'}
                </>
            )}
        </>
    ) : (
        <>
            {`Die Tonleiter von `}
            <span className="border-b-4 border-purple-400">
                {getNote(originKey, selectedNotation, SCALES)} {modeText}
            </span>
            ,{` besteht aus den folgenden Noten: `}{' '}
            <span className="font-bold text-lg">{notesSuite}</span>.{' '}
            {`Dies wird zur Tonleiter von `}
            <span className="border-b-4 border-yellow-300">
                {getNote(targetNote, selectedNotation, SCALES)} {modeText}
            </span>
            ,{` mit den folgenden Noten: `}{' '}
            <span className="font-bold text-lg">
                {transposedScaleNotesSuite}
            </span>{' '}
            {`wenn es ${
                selectedDirection === 'up' ? 'nach oben' : 'nach unten'
            } ${getIntervalName(
                selectedInterval,
                selectedLanguage
            )} transponiert wird.`}
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
            selectedOriginKey,
            selectedDirection,
            selectedInterval,
        ]
    );

    const message = translatedResults[0];

    console.log({ message, englishMessage });

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

    const pageTitleText = useTranslation(
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
        }
        if (selectedDirection === 'down') {
            if (scale.reducedNotes[i] < transposedScale.reducedNotes[i]) {
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

    const displayedOriginNotes = displayedNotes.map((note, i) => note.origin);
    const displayedTargetNotes = displayedNotes.map((note, i) => note.target);

    return (
        <div className="content simple-transposition w-full">
            <ModeSelector
                selectedMode={selectedMode}
                handleChangeMode={handleChangeMode}
                showAdditionalModes={showAdditionalModes}
                setShowAdditionalModes={setShowAdditionalModes}
            />
            <h2 className="mb-3">{translatedText[0]}</h2>
            <div className="simple-transposition__origin-key-select w-full mb-3">
                {translatedText[1]}
                <NoteSelector
                    selected={selectedOriginKey}
                    setSelected={handleChangeOriginKey}
                    selectedNotation={selectedNotation}
                    colour="sky"
                    usedScale={SCALES}
                    blackNotesAreHalf={true}
                />
            </div>
            <div className="simple-transposition__note-select w-full mb-3">
                {translatedText[2]}
                <IntervalSelector
                    selectedInterval={selectedInterval}
                    handleChangeInterval={handleChangeInterval}
                    selectedDirection={selectedDirection}
                    setSelectedDirection={handleChangeDirection}
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
                    displayedNotes={displayedOriginNotes}
                    correspondingNotes={scale.notesInScale}
                    musicalKey={originKeySignature}
                    selectedNotation={selectedNotation}
                    colour="sky"
                    noteColour="purple"
                />
                <Staff
                    displayedNotes={displayedTargetNotes}
                    correspondingNotes={transposedScale.notesInScale}
                    musicalKey={targetKeySignature}
                    selectedNotation={selectedNotation}
                    colour="red"
                    noteColour="yellow"
                />
            </div>
            {/*<CircleOfFifth*/}
            {/*    modeIndex={selectedMode}*/}
            {/*    selectedNotation={selectedNotation}*/}
            {/*    selectedLanguage={selectedLanguage}*/}
            {/*    selectedStartNote={selectedNote}*/}
            {/*    targetNote={targetNote}*/}
            {/*    setSelectedMode={handleChangeMode}*/}
            {/*    selectedOriginKey={selectedOriginKey}*/}
            {/*    selectedTargetKey={selectedTargetKey}*/}
            {/*    showAdditionalModes={showAdditionalModes}*/}
            {/*/>*/}
        </div>
    );
}

export default IntervalsScaleTransposition;
