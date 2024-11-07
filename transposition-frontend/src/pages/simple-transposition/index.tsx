import React, { useState } from 'react';
import { getNote, Note, REDUCED_NOTES, SCALES } from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { transposer } from '../../utils/transposer';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
import { useNavigate, useParams } from 'react-router-dom';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import Staff from '../../components/staff';
import { useIsMobile } from '../../hooks/useIsMobile';
import { NoteInScale } from '../../utils/scaleBuilder';

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

    const [_, reversedEnharmonicOriginGroupNotes] = transposer(
        selectedNote,
        selectedOriginKey,
        selectedOriginKey
    );

    const [targetNote, reversedEnharmonicTargetGroupNotes] = transposer(
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
                {` in `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` stays the same because the origin and target keys are the same.`}
            </>
        ) : (
            <>
                {`A `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` in `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` becomes a `}
                <span className="border-b-4 border-yellow-300 font-bold text-lg">
                    {getNote(targetNote, selectedNotation)}
                </span>
                {` in `}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
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
                {` en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` reste le même car les tonalités d'origine et de destination sont identiques.`}
            </>
        ) : (
            <>
                {`Un `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` devient un `}
                <span className="border-b-4 border-yellow-300 font-bold text-lg">
                    {getNote(targetNote, selectedNotation)}
                </span>
                {` en `}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
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
                {` en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` sigue siendo la misma porque las tonalidades de origen y destino son iguales.`}
            </>
        ) : (
            <>
                {`Una `}
                <span className="border-b-4 border-purple-300">
                    {getNote(selectedNote, selectedNotation)}
                </span>
                {` en `}
                <span className="border-b-4 border-sky-300">
                    {getNote(selectedOriginKey, selectedNotation)}
                </span>
                {` se convierte en `}
                <span className="border-b-4 border-yellow-300 font-bold text-lg">
                    {getNote(targetNote, selectedNotation)}
                </span>
                {` en `}
                <span className="border-b-4 border-red-300">
                    {getNote(selectedTargetKey, selectedNotation)}
                </span>
                .
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

    const titleTextTranslations: Translations = {
        [Language.English]: [
            `${getNote(selectedNote, selectedNotation)} from ${getNote(
                selectedOriginKey,
                selectedNotation
            )} to ${getNote(
                selectedTargetKey,
                selectedNotation
            )} | Note Transposition`,
        ],
        [Language.French]: [
            `${getNote(selectedNote, selectedNotation)} de ${getNote(
                selectedOriginKey,
                selectedNotation
            )} à ${getNote(
                selectedTargetKey,
                selectedNotation
            )} | Transposition de note`,
        ],
        [Language.Spanish]: [
            `${getNote(selectedNote, selectedNotation)} de ${getNote(
                selectedOriginKey,
                selectedNotation
            )} a ${getNote(
                selectedTargetKey,
                selectedNotation
            )} | Transposición de nota`,
        ],
        [Language.German]: [
            `${getNote(selectedNote, selectedNotation)} von ${getNote(
                selectedOriginKey,
                selectedNotation
            )} nach ${getNote(
                selectedTargetKey,
                selectedNotation
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
        console.log({ reversedEnharmonicGroupNotes });
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

    console.log({
        correspondingOriginNotes,
        displayedOriginNotes,
        correspondingTargetNotes,
        displayedTargetNotes,
    });

    return (
        <div className="content simple-transposition w-full">
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
                    selectedNotation={selectedNotation}
                    text={`Original Note: ${getNote(
                        selectedOriginKey,
                        selectedNotation
                    )}`}
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
                        selectedNotation={selectedNotation}
                        text={`Transposed Note: ${getNote(
                            selectedTargetKey,
                            selectedNotation
                        )}`}
                        colour="red"
                        noteColour="yellow"
                    />
                )}
            </div>
        </div>
    );
}

export default SimpleTransposition;
