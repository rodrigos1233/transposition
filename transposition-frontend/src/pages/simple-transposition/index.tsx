import React, { useEffect, useState } from 'react';
import {
    getNote,
    Note,
} from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { transposer } from '../../utils/transposer';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';

function SimpleTransposition({
    selectedNotation,
    selectedLanguage,
}: {
    selectedNotation: keyof Note;
    selectedLanguage: Language;
}) {
    const [selectedOriginKey, setSelectedOriginKey] = useState(0);
    const [selectedNote, setSelectedNote] = useState(0);
    const [selectedTargetKey, setSelectedTargetKey] = useState(0);

    const translations: Translations = {
        [Language.English]: [
            "Transpose a single note from a transposing instrument's key to another:",
            'origin key:',
            'note:',
            'target key:',
        ],
        [Language.French]: [
            "Transposez une note d'une tonalité à une autre:",
            "tonalité d'origine:",
            'note:',
            "tonalité d'arrivée:",
        ],
        [Language.Spanish]: [
            "Transpone una nota de una tonalidad a otra:",
            "tonalidad de origen:",
            'nota:',
            "tonalidad de destino:",
        ],
        [Language.German]: [
            "Transponiere eine Note einer Tonalität auf eine andere:",
            "Tonalität der Ursprung:",
            'Note:',
            "Tonalität der Ziel:",
        ],
    };

    const translatedText = useTranslation(selectedLanguage, translations, []);

    const targetNote = transposer(
        selectedNote,
        selectedOriginKey,
        selectedTargetKey
    );

    const englishMessage = (
        <>
            {`A ${getNote(selectedNote, selectedNotation)} in ${getNote(
                selectedOriginKey,
                selectedNotation
            )} becomes a`}{' '}
            <span className={'font-bold text-lg'}>
                {getNote(targetNote, selectedNotation)}
            </span>{' '}
            {`in ${getNote(selectedTargetKey, selectedNotation)}`}
        </>
    );

    const frenchMessage = (
        <>
            {`Un ${getNote(selectedNote, selectedNotation)} en ${getNote(
                selectedOriginKey,
                selectedNotation
            )} devient un`}{' '}
            <span className={'font-bold text-lg'}>
                {getNote(targetNote, selectedNotation)}
            </span>{' '}
            {`en ${getNote(selectedTargetKey, selectedNotation)}`}
        </>
    );

    const spanishMessage = (
        <>
            {`Una ${getNote(selectedNote, selectedNotation)} en ${getNote(
                selectedOriginKey,
                selectedNotation
            )} se convierte en`}{' '}
            <span className={'font-bold text-lg'}>
                {getNote(targetNote, selectedNotation)}
            </span>{' '}
            {`en ${getNote(selectedTargetKey, selectedNotation)}`}
        </>
    );

    const germanMessage = (
        <>
            {`Eine ${getNote(selectedNote, selectedNotation)} in ${getNote(
                selectedOriginKey,
                selectedNotation
            )} wird in`}{' '}
            <span className={'font-bold text-lg'}>
                {getNote(targetNote, selectedNotation)}
            </span>{' '}
            {`in ${getNote(selectedTargetKey, selectedNotation)}`}
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

    return (
        <div className="content simple-transposition w-full">
            <h2>{translatedText[0]}</h2>
            <div className="simple-transposition__origin-key-select w-full">
                {translatedText[1]}
                <NoteSelector
                    selected={selectedOriginKey}
                    setSelected={setSelectedOriginKey}
                    selectedNotation={selectedNotation}
                />
            </div>
            <div className="simple-transposition__note-select w-full">
                {translatedText[2]}
                <NoteSelector
                    selected={selectedNote}
                    setSelected={setSelectedNote}
                    selectedNotation={selectedNotation}
                />
            </div>
            <div className="simple-transposition__target-key-select w-full">
                {translatedText[3]}
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

export default SimpleTransposition;
