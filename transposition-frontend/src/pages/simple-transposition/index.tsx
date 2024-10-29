import React, { useEffect, useState } from 'react';
import { getNote, Note } from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { transposer } from '../../utils/transposer';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
import { useNavigate, useParams } from 'react-router-dom';

const MAX_NOTE = 11;

function SimpleTransposition({
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

    const targetNote = transposer(
        selectedNote,
        selectedOriginKey,
        selectedTargetKey
    );

    const englishMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`A ${getNote(selectedNote, selectedNotation)} in ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} stays the same because the origin and target keys are the same.`}
            </>
        ) : (
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

    const frenchMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`Un ${getNote(selectedNote, selectedNotation)} en ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} reste le même car les tonalités d'origine et de destination sont identiques.`}
            </>
        ) : (
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

    const spanishMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`Una ${getNote(selectedNote, selectedNotation)} en ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} sigue siendo la misma porque las tonalidades de origen y destino son iguales.`}
            </>
        ) : (
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

    const germanMessage =
        selectedOriginKey === selectedTargetKey ? (
            <>
                {`Eine ${getNote(selectedNote, selectedNotation)} in ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} bleibt unverändert, da die Ursprungs- und Zieltonalität identisch sind.`}
            </>
        ) : (
            <>
                {`Eine ${getNote(selectedNote, selectedNotation)} in ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} wird in`}{' '}
                <span className={'font-bold text-lg'}>
                    {getNote(targetNote, selectedNotation)}
                </span>{' '}
                {`in ${getNote(
                    selectedTargetKey,
                    selectedNotation
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

    return (
        <div className="content simple-transposition w-full">
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
        </div>
    );
}

export default SimpleTransposition;
