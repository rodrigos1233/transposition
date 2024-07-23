import React, { useState } from 'react';
import { getNote, MAJOR_SCALES, MINOR_SCALES, Note } from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { transposer } from '../../utils/transposer';
import { scaleBuilder } from '../../utils/scaleBuilder';
import Button from '../../components/button';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';

function ScaleTransposition({
    selectedNotation,
    selectedLanguage,
}: {
    selectedNotation: keyof Note;
    selectedLanguage: Language;
}) {
    const [selectedOriginKey, setSelectedOriginKey] = useState(0);
    const [selectedNote, setSelectedNote] = useState(0);
    const [selectedTargetKey, setSelectedTargetKey] = useState(0);
    const [mode, setMode] = useState<'major' | 'minor'>('major');

    const targetNote = transposer(
        selectedNote,
        selectedOriginKey,
        selectedTargetKey
    );
    const scale = scaleBuilder(selectedNote, mode);

    const notesSuite = scale.notesInScale.map(
        (noteInScale) => `${noteInScale.note[selectedNotation]}, `
    );

    const transposedScale = scaleBuilder(targetNote, mode);

    const transposedScaleNotesSuite = transposedScale.notesInScale.map(
        (noteInScale) => `${noteInScale.note[selectedNotation]}, `
    );

    const translations: Translations = {
        [Language.English]: [
            'major',
            'minor',
            "Transpose a full major or minor scale from a transposing instrument's key to another:",
            'origin key:',
            'scale:',
            'target key:',
        ],
        [Language.French]: [
            'majeur',
            'mineur',
            "Transposez une gamme majeure ou mineure complète d'une tonalité d'instrument transpositeur à une autre:",
            "tonalité d'origine:",
            'gamme:',
            "tonalité d'arrivée:",
        ],
        [Language.Spanish]: [
            'mayor',
            'menor',
            "Transpone una escala completa de una tonalidad de instrumento transpositor a otra:",
            "tonalidad de origen:",
            'escala:',
            "tonalidad de destino:",
        ],
        [Language.German]: [
            'Dur',
            'Moll',
            "Transponiere eine vollständige Tonleiter eines Instrument auf eine andere:",
            "Tonalität der Ursprung:",
            'Tonleiter:',
            "Tonalität der Ziel:",
        ],
    };

    const translatedText = useTranslation(selectedLanguage, translations, []);

    const modeNames: Translations = {
        [Language.English]: ['major', 'minor'],
        [Language.French]: ['majeur', 'mineur'],
        [Language.Spanish]: ['mayor', 'menor'],
        [Language.German]: ['Dur', 'Moll'],
    };

    const modeNameIndex = mode === 'major' ? 0 : 1;

    let modeText;
    if (modeNames[selectedLanguage]) {
        // @ts-ignore
        modeText = modeNames[selectedLanguage][modeNameIndex];
    } else {
        modeText = mode; // Fallback to mode in case the selected language is not available
    }

    const englishMessage = (
        <>
            {`The scale of ${getNote(
                selectedNote,
                selectedNotation
            )} ${modeText}, which for an instrument in ${getNote(
                selectedOriginKey,
                selectedNotation
            )} consists of the following note suite:`}{' '}
            <span className="font-bold text-lg">{notesSuite}</span>{' '}
            {`becomes a scale of ${getNote(
                targetNote,
                selectedNotation,
                mode === 'minor' ? MINOR_SCALES : MAJOR_SCALES
            )} ${modeText}, with the following note suite: `}{' '}
            <span className="font-bold text-lg">
                {transposedScaleNotesSuite}
            </span>{' '}
            {`when transposed for an instrument in ${getNote(
                selectedTargetKey,
                selectedNotation
            )}`}
        </>
    );

    const frenchMessage = (
        <>
            {`La gamme de ${getNote(
                selectedNote,
                selectedNotation
            )} ${modeText}, qui consiste en la suite de notes suivante:`}{' '}
            <span className="font-bold text-lg">{notesSuite}</span>{' '}
            {`devient la gamme de ${getNote(
                targetNote,
                selectedNotation,
                mode === 'minor' ? MINOR_SCALES : MAJOR_SCALES
            )} ${modeText}, avec la suite de notes suivante: `}{' '}
            <span className="font-bold text-lg">
                {transposedScaleNotesSuite}
            </span>{' '}
            {`lorsqu'elle est transposée d'un instrument transpositeur en ${getNote(
                selectedOriginKey,
                selectedNotation
            )} à un instrument transpositeur en ${getNote(
                selectedTargetKey,
                selectedNotation
            )}.`}
        </>
    );

    const spanishMessage = (
        <>
            {`La escala de ${getNote(
                selectedNote,
                selectedNotation
            )} ${modeText}, que consiste en la siguiente escala de notas:`}{' '}
            <span className="font-bold text-lg">{notesSuite}</span>{' '}
            {`se convierte en la escala de ${getNote(
                targetNote,
                selectedNotation,
                mode === 'minor' ? MINOR_SCALES : MAJOR_SCALES
            )} ${modeText}, con la siguiente escala de notas: `}{' '}
            <span className="font-bold text-lg">
                {transposedScaleNotesSuite}
            </span>{' '}
            {`cuando se transpone para un instrument transpositor en ${getNote(
                selectedOriginKey,
                selectedNotation
            )} a un instrument transpositor en ${getNote(
                selectedTargetKey,
                selectedNotation
            )}.`}
        </>
    );

    const germanMessage = (
        <>
            {`Die Tonleiter von ${getNote(
                selectedNote,
                selectedNotation
            )}-${modeText}, die für ein Instrument in ${getNote(
                selectedOriginKey,
                selectedNotation
            )} besteht aus folgender Tonleiter:`}{' '}
            <span className="font-bold text-lg">{notesSuite}</span>{' '}
            {`wird in die Tonleiter von ${getNote(
                targetNote,
                selectedNotation,
                mode === 'minor' ? MINOR_SCALES : MAJOR_SCALES
            )}-${modeText} umgewandelt, mit folgender Tonleiter: `}{' '}
            <span className="font-bold text-lg">
                {transposedScaleNotesSuite}
            </span>{' '}
            {`wenn es für ein Instrument in ${getNote(
                selectedOriginKey,
                selectedNotation
            )} transponiert wird, um ein Instrument in ${getNote(
                selectedTargetKey,
                selectedNotation
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
            mode,
            selectedNote,
            selectedOriginKey,
            selectedTargetKey,
        ]
    );

    const message = translatedResults[0];

    return (
        <div className="content simple-transposition w-full">
            <div className="mode-selector h-14">
                <Button
                    onClick={() => setMode('major')}
                    disabled={mode === 'major'}
                    className={'bg-neutral-100 ml-3'}
                >
                    {translatedText[0]}
                </Button>
                <Button
                    onClick={() => setMode('minor')}
                    disabled={mode === 'minor'}
                    className={'bg-neutral-100 ml-3'}
                >
                    {translatedText[1]}
                </Button>
            </div>
            <h2>{translatedText[2]}</h2>
            <div className="simple-transposition__origin-key-select w-full">
                {translatedText[3]}
                <NoteSelector
                    selected={selectedOriginKey}
                    setSelected={setSelectedOriginKey}
                    selectedNotation={selectedNotation}
                />
            </div>
            <div className="simple-transposition__note-select w-full">
                {translatedText[4]}
                <NoteSelector
                    selected={selectedNote}
                    setSelected={setSelectedNote}
                    selectedNotation={selectedNotation}
                    usedScale={mode === 'major' ? MAJOR_SCALES : MINOR_SCALES}
                />
            </div>
            <div className="simple-transposition__target-key-select w-full">
                {translatedText[5]}
                <NoteSelector
                    selected={selectedTargetKey}
                    setSelected={setSelectedTargetKey}
                    selectedNotation={selectedNotation}
                />
            </div>
            <p>{message}</p>
        </div>
    );
}

export default ScaleTransposition;
