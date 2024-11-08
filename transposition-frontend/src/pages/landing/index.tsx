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
            'Welcome to ClaveShift.com!',
            'ClaveShift.com, formerly MusicTranspositor.com, is an online transposer tool that allows you to easily transpose a single note from one key to another.',
            <>
                For more detailed information about music transposition, please
                visit the{' '}
                <a className="underline text-lime-700" href={'/about'}>
                    About page
                </a>
                .
            </>,
            'Quick Start:',
            'You play an instrument in B♭ and want to find out the corresponding scales for an instrument in C. Here are some common keys:',

            `${getNote(0, selectedNotation, SCALES)} to ${getNote(
                1,
                selectedNotation
            )}`, // C to Bb
            `${getNote(1, selectedNotation, SCALES)} to ${getNote(
                2,
                selectedNotation
            )}`, // Bb to F
        ],
        [Language.French]: [
            'Bienvenue sur ClaveShift.com!',
            "ClaveShift.com, anciennement MusicTranspositor.com est un outil en ligne de transposition musicale qui vous permet de transposer facilement une note d'une tonalité à une autre.",
            <>
                Pour plus d'informations sur la transposition musicale, veuillez
                visiter la page{' '}
                <a className="underline text-lime-700" href={'/about'}>
                    À propos
                </a>
                .
            </>,
            'Prise en main rapide :',
            'Vous jouez d’un instrument en si bémol et souhaitez connaître les gammes correspondantes pour un instrument en do. Voici quelques tonalités courantes :',
            `${getNote(0, selectedNotation, SCALES)} à ${getNote(
                1,
                selectedNotation
            )}`, // C to Bb
            `${getNote(1, selectedNotation, SCALES)} à ${getNote(
                2,
                selectedNotation
            )}`, // Bb to F
        ],
        [Language.Spanish]: [
            'Bienvenido a ClaveShift.com!',
            'ClaveShift.com, antes llamado MusicTranspositor.com, es una herramienta en línea de transposición musical que te permite transponer fácilmente una nota de una tonalidad a otra.',
            <>
                Para más información sobre la transposición musical, por favor
                visite la página{' '}
                <a className="underline text-lime-700" href={'/about'}>
                    Acerca de
                </a>
                .
            </>,
            'Inicio rápido:',
            'Tocas un instrumento en si bemol y quieres averiguar las escalas correspondientes para un instrumento en do. Aquí tienes algunas tonalidades comunes:',
            `${getNote(0, selectedNotation, SCALES)} a ${getNote(
                1,
                selectedNotation
            )}`, // C to Bb
            `${getNote(1, selectedNotation, SCALES)} a ${getNote(
                2,
                selectedNotation
            )}`, // Bb to F
        ],
        [Language.German]: [
            'Willkommen bei ClaveShift.com!',
            'ClaveShift.com, früher MusicTranspositor.com, ist ein Online-Transpositionswerkzeug, mit dem Sie einfach eine Note von einer Tonart in eine andere transponieren können.',
            <>
                Für detailliertere Informationen zur Musiktransposition besuchen
                Sie bitte die{' '}
                <a className="underline text-lime-700" href={'/about'}>
                    Über-Seite
                </a>
                .
            </>,
            'Schnellstart:',
            'Du spielst ein Instrument in B♭ und möchtest die entsprechenden Tonarten für ein Instrument in C herausfinden. Hier sind einige gängige Tonarten:',
            `${getNote(0, selectedNotation, SCALES)} zu ${getNote(
                1,
                selectedNotation
            )}`, // C to Bb
            `${getNote(1, selectedNotation, SCALES)} zu ${getNote(
                2,
                selectedNotation
            )}`, // Bb to F
        ],
    };

    const commonScaleTranspositions = [
        // B♭ Instrument (e.g., Clarinet, Trumpet) to C Instrument (e.g., Piano, Flute)
        {
            from: 10, // B♭
            to: 0, // C
            scales: [
                { scale: 0, mode: 0 }, // C Major (B♭ instrument reads C as concert pitch B♭)
                { scale: 9, mode: 1 }, // A Minor (B♭ instrument reads A as concert pitch G)
            ],
        },
        // E♭ Instrument (e.g., Alto Saxophone) to C Instrument
        {
            from: 3, // E♭
            to: 0, // C
            scales: [
                { scale: 0, mode: 0 }, // C Major (E♭ instrument reads C as concert pitch E♭)
                { scale: 9, mode: 1 }, // A Minor (E♭ instrument reads A as concert pitch C)
            ],
        },
        // F Instrument (e.g., French Horn) to C Instrument
        {
            from: 5, // F
            to: 0, // C
            scales: [
                { scale: 0, mode: 0 }, // C Major (F instrument reads C as concert pitch F)
                { scale: 9, mode: 1 }, // A Minor (F instrument reads A as concert pitch D)
            ],
        },
        // C Instrument (e.g., Piano, Flute) to B♭ Instrument (e.g., Trumpet, Clarinet)
        {
            from: 0, // C
            to: 10, // B♭
            scales: [
                { scale: 10, mode: 0 }, // B♭ Major (C instrument reads B♭ as concert pitch C)
                { scale: 7, mode: 1 }, // G Minor (C instrument reads G as concert pitch A)
            ],
        },
        // C Instrument to E♭ Instrument
        {
            from: 0, // C
            to: 3, // E♭
            scales: [
                { scale: 3, mode: 0 }, // E♭ Major (C instrument reads E♭ as concert pitch C)
                { scale: 0, mode: 1 }, // C Minor (C instrument reads C as concert pitch E♭)
            ],
        },
        // C Instrument to F Instrument
        {
            from: 0, // C
            to: 5, // F
            scales: [
                { scale: 5, mode: 0 }, // F Major (C instrument reads F as concert pitch C)
                { scale: 2, mode: 1 }, // D Minor (C instrument reads D as concert pitch F)
            ],
        },
        // B♭ Instrument to E♭ Instrument
        {
            from: 10, // B♭
            to: 3, // E♭
            scales: [
                { scale: 3, mode: 0 }, // E♭ Major (B♭ instrument reads E♭ as concert pitch G♭)
                { scale: 0, mode: 1 }, // C Minor (B♭ instrument reads C as concert pitch E♭)
            ],
        },
        // B♭ Instrument to F Instrument
        {
            from: 10, // B♭
            to: 5, // F
            scales: [
                { scale: 5, mode: 0 }, // F Major (B♭ instrument reads F as concert pitch A♭)
                { scale: 2, mode: 1 }, // D Minor (B♭ instrument reads D as concert pitch F)
            ],
        },
        // E♭ Instrument to B♭ Instrument
        {
            from: 3, // E♭
            to: 10, // B♭
            scales: [
                { scale: 10, mode: 0 }, // B♭ Major (E♭ instrument reads B♭ as concert pitch D♭)
                { scale: 7, mode: 1 }, // G Minor (E♭ instrument reads G as concert pitch B♭)
            ],
        },
        // F Instrument to B♭ Instrument
        {
            from: 5, // F
            to: 10, // B♭
            scales: [
                { scale: 10, mode: 0 }, // B♭ Major (F instrument reads B♭ as concert pitch E♭)
                { scale: 7, mode: 1 }, // G Minor (F instrument reads G as concert pitch D)
            ],
        },
        // E♭ Instrument to F Instrument
        {
            from: 3, // E♭
            to: 5, // F
            scales: [
                { scale: 5, mode: 0 }, // F Major (E♭ instrument reads F as concert pitch A♭)
                { scale: 2, mode: 1 }, // D Minor (E♭ instrument reads D as concert pitch F)
            ],
        },
        // F Instrument to E♭ Instrument
        {
            from: 5, // F
            to: 3, // E♭
            scales: [
                { scale: 3, mode: 0 }, // E♭ Major (F instrument reads E♭ as concert pitch C)
                { scale: 0, mode: 1 }, // C Minor (F instrument reads C as concert pitch A♭)
            ],
        },
    ];

    const translatedText = useTranslation(selectedLanguage, translations, [
        selectedNotation,
    ]);

    return (
        <div className="content landing-page w-full">
            <h1 className="my-2">{translatedText[0]}</h1>
            <p>{translatedText[1]}</p>
            <p>{translatedText[2]}</p>
            {/*<h2 className="quick-start">{translatedText[3]}</h2>*/}
            {/*<p>{translatedText[4]}</p>*/}
            {/*<ul className="common-keys-list">*/}
            {/*    <li>{translatedText[5]}</li>*/}
            {/*    <li>{translatedText[6]}</li>*/}
            {/*</ul>*/}
        </div>
    );
}

export default LandingPage;
