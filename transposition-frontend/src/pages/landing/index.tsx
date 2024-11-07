import React from 'react';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
import { getNote, Note, SCALES } from '../../utils/notes';
import Button from '../../components/button';
import { useNavigate } from 'react-router-dom';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';

function LandingPage({
    selectedLanguage,
    selectedNotation,
}: {
    selectedLanguage: Language;
    selectedNotation: keyof Note;
}) {
    const navigate = useNavigate();

    const titleTextTranslations: Translations = {
        [Language.English]: [`Transposition`],
        [Language.French]: [`Transposition`],
        [Language.Spanish]: [`Transposición`],
        [Language.German]: [`Transposition`],
    };

    const pageTitleText = useTranslation(
        selectedLanguage,
        titleTextTranslations,
        []
    );
    useChangePageTitle(pageTitleText[0] as unknown as string);

    const translations: Translations = {
        [Language.English]: [
            'Welcome to Claveshift.com!',
            'Claveshift.com is an online transposer tool that allows you to easily transpose a single note from one key to another.',
            <>
                For more detailed information about music transposition, please
                visit the <a href={'/about'}>About page</a>.
            </>,
            'Quick links:',
            `Transpose the key of ${getNote(
                0,
                selectedNotation,
                SCALES
            )} from an instrument in ${getNote(
                1,
                selectedNotation
            )} to an instrument in ${getNote(0, selectedNotation)}`,
        ],
        [Language.French]: [
            'Bienvenue sur Claveshift.com!',
            "Claveshift.com est un outil en ligne de transposition musicale qui vous permet de transposer facilement une note d'une tonalité à une autre.",
            <>
                Pour plus d'informations sur la transposition musicale, veuillez
                visiter la page <a href={'/about'}>À propos</a>.
            </>,
            'Liens rapides :',
            `Transposez la tonalité de ${getNote(
                0,
                selectedNotation,
                SCALES
            )} d'un instrument en ${getNote(0, selectedNotation)}`,
            `pour un instrument en ${getNote(1, selectedNotation)}`,
        ],
        [Language.Spanish]: [
            'Bienvenido a Claveshift.com!',
            'Claveshift.com es una herramienta en línea de transposición musical que te permite transponer fácilmente una nota de una tonalidad a otra.',
            <>
                Para más información sobre la transposición musical, por favor
                visite la página <a href={'/about'}>Acerca de.</a>
            </>,
            'Enlaces rápidos:',
            `Transpone la tonalidad de ${getNote(
                0,
                selectedNotation,
                SCALES
            )} de un instrumento en ${getNote(0, selectedNotation)}
            para un instrumento en ${getNote(1, selectedNotation)}`,
        ],
        [Language.German]: [
            'Willkommen bei Claveshift.com!',
            'Claveshift.com ist ein Online-Transpositionswerkzeug, mit dem Sie einfach eine Note von einer Tonart in eine andere transponieren können.',
            <>
                Für detailliertere Informationen zur Musiktransposition besuchen
                Sie bitte die <a href={'/about'}>Über-Seite.</a>
            </>,
            'Schnelle Links:',
            `Transponiere die Tonart von ${getNote(
                0,
                selectedNotation,
                SCALES
            )} von einem Instrument in ${getNote(
                0,
                selectedNotation
            )} zu einem Instrument in ${getNote(1, selectedNotation)}`,
        ],
    };

    const commonTranspositions = [
        { from: 0, to: 1 }, // C to Bb
        { from: 1, to: 2 }, // Bb to F
        // Add more transpositions as needed
    ];

    const translatedText = useTranslation(selectedLanguage, translations, [
        selectedNotation,
    ]);

    return (
        <div className="content about-page w-full">
            <h1 className="my-2">{translatedText[0]}</h1>
            <p>{translatedText[1]}</p>
            <p>{translatedText[2]}</p>
        </div>
    );
}

export default LandingPage;
