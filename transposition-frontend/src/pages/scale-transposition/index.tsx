import React, { useEffect, useState } from 'react';
import { getNote, Note, SCALES } from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { scaleTransposer } from '../../utils/transposer';
import { scaleBuilder } from '../../utils/scaleBuilder';
import Button from '../../components/button';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
import { getModeName, MODES } from '../../utils/modes';
import { useNavigate, useParams } from 'react-router-dom';
import Staff from '../../components/staff';

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

    const transposedScaleNotesSuite = transposedScale.notesInScale
        .map((noteInScale) => noteInScale.note[selectedNotation])
        .join(', ');

    const translations: Translations = {
        [Language.English]: [
            "Transpose a full scale in any mode from one instrument's key to another:",
            'Origin key:',
            'Scale:',
            'target key:',
        ],
        [Language.French]: [
            "Transposez une gamme complète, dans n'importe quel mode, d'une tonalité d'un instrument à une autre:",
            "Tonalité d'origine:",
            'Gamme:',
            'tonalité cible:',
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
                {`The scale of ${getNote(
                    selectedNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, for an instrument in ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )}, consists of the following notes:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {
                    'No transposition is needed because the origin and target keys are the same.'
                }
            </>
        ) : (
            <>
                {`The scale of ${getNote(
                    selectedNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, for an instrument in ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )}, consists of the following notes:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {`This becomes the scale of ${getNote(
                    targetNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, with the following notes: `}{' '}
                <span className="font-bold text-lg">
                    {transposedScaleNotesSuite}
                </span>{' '}
                {`when transposed for an instrument in ${getNote(
                    selectedTargetKey,
                    selectedNotation
                )}.`}
            </>
        );

    const frenchMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`La gamme de ${getNote(
                    selectedNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, pour un instrument en ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} consiste en la suite de notes suivante :`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {
                    "Aucune transposition n'est nécessaire car les tonalités d'origine et de destination sont identiques."
                }
            </>
        ) : (
            <>
                {`La gamme de ${getNote(
                    selectedNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, qui pour un instrument en ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} consiste en la suite de notes suivante :`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {`Elle devient la gamme de ${getNote(
                    targetNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, avec la suite de notes suivante : `}{' '}
                <span className="font-bold text-lg">
                    {transposedScaleNotesSuite}
                </span>
                ,{' '}
                {`lorsqu'elle est transposée pour un instrument en ${getNote(
                    selectedTargetKey,
                    selectedNotation
                )}.`}
            </>
        );

    const spanishMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`La escala de ${getNote(
                    selectedNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, que para un instrumento en ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} consiste en la siguiente secuencia de notas:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.
                {
                    ' No hay transposición porque las tonalidades seleccionadas son iguales.'
                }
            </>
        ) : (
            <>
                {`La escala de ${getNote(
                    selectedNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, que para un instrumento en ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} consiste en la siguiente secuencia de notas:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {`Se convierte en la escala de ${getNote(
                    targetNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, con la siguiente secuencia de notas: `}{' '}
                <span className="font-bold text-lg">
                    {transposedScaleNotesSuite}
                </span>
                ,{' '}
                {`cuando se transpone por un instrumento en ${getNote(
                    selectedTargetKey,
                    selectedNotation
                )}.`}
            </>
        );

    const germanMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`Die Tonleiter von ${getNote(
                    selectedNote,
                    selectedNotation,
                    SCALES
                )} ${modeText}, die für ein Instrument in ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} notiert ist, setzt sich wie folgt zusammen:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {
                    'Keine Transposition erforderlich, da die Ursprungs- und Zieltonalität identisch sind.'
                }
            </>
        ) : (
            <>
                {`Die Tonleiter von ${getNote(
                    selectedNote,
                    selectedNotation,
                    SCALES
                )}-${modeText}, die für ein Instrument in ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} besteht, setzt sich wie folgt zusammen:`}{' '}
                <span className="font-bold text-lg">{notesSuite}</span>.{' '}
                {`Diese Tonleiter wird umgewandelt in die Tonleiter von ${getNote(
                    targetNote,
                    selectedNotation,
                    SCALES
                )}-${modeText}, mit folgender Tonfolge: `}{' '}
                <span className="font-bold text-lg">
                    {transposedScaleNotesSuite}
                </span>
                ,{' '}
                {`wenn sie für ein Instrument in ${getNote(
                    selectedTargetKey,
                    selectedNotation
                )} zu spielen.`}
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

    const modes = MODES.map((mode, index) => (
        <Button
            key={index}
            onClick={() => handleChangeMode(index)}
            disabled={index === selectedMode}
            className={'bg-neutral-100 ml-3'}
        >
            {getModeName(index, selectedLanguage)}
        </Button>
    ));

    return (
        <div className="content simple-transposition w-full">
            <div className="mode-selector mb-3">{modes}</div>
            <h2 className="mb-3">{translatedText[0]}</h2>
            <div className="simple-transposition__origin-key-select w-full mb-3">
                {translatedText[1]}
                <NoteSelector
                    selected={selectedOriginKey}
                    setSelected={handleChangeOriginKey}
                    selectedNotation={selectedNotation}
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
                />
            </div>
            <div className="simple-transposition__target-key-select w-full mb-3">
                {translatedText[3]}
                <NoteSelector
                    selected={selectedTargetKey}
                    setSelected={handleChangeTargetKey}
                    selectedNotation={selectedNotation}
                />
            </div>
            <p className="mb-3">{message}</p>
            <Staff displayedNotes={[0]} />
        </div>
    );
}

export default ScaleTransposition;
