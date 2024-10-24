import React from 'react';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
import { getNote, Note } from '../../utils/notes';

function AboutPage({
    selectedLanguage,
    selectedNotation,
}: {
    selectedLanguage: Language;
    selectedNotation: keyof Note;
}) {
    const translations: Translations = {
        [Language.English]: [
            'About Musical Transposition',
            'Musical transposition is the process of shifting a collection of notes (such as a melody, harmony, or scale) up or down in pitch by a constant interval. This means that every note in the music is adjusted by the same proportional change in pitch, resulting in a new key. Transposition is commonly used to accommodate different vocal ranges, instrument tunings, or to make a piece easier to read and perform.',
            'This website is a tool designed for quick and easy transposition. It offers a simple interface to transpose a single note from one key to another, as well as a more advanced interface to transpose an entire scale. This feature allows musicians to easily play a piece in the same key when using two instruments with different tunings, for example.',
        ],
        [Language.French]: [
            'À propos de la transposition musicale',
            "La transposition musicale est le processus de déplacement d'une collection de notes (une mélodie, une harmonie ou une gamme) vers le haut ou vers le bas par un intervalle constant. Cela signifie que chaque note de la pièce est élevée ou abaissée de la même distance, ce qui donne une nouvelle tonalité. La transposition est couramment utilisée en musique pour s'adapter à différentes tessitures vocales, à l'accordage des instruments ou pour rendre une pièce plus facile à lire et à jouer.",
            "Ce site web est un outil conçu pour faciliter des transpositions rapides. Il propose une interface simple pour transposer une note d'une tonalité à une autre, ainsi qu'une interface plus avancée permettant de transposer une gamme complète. Cela permet, par exemple, de jouer rapidement une pièce dans la même tonalité lorsque vous jouez avec deux instruments ayant deux tonalités différentes.",
        ],
        [Language.Spanish]: [
            'Acerca de la Transposición Musical',
            'La transposición musical es el proceso de desplazar una colección de notas (como una melodía, armonía o escala) hacia arriba o hacia abajo en el tono por un intervalo constante. Esto significa que cada nota en la pieza de música se eleva o baja por la misma proporción de cambio en la altura, resultando en una nueva tonalidad. La transposición se utiliza comúnmente en la música para adaptarse a diferentes rangos vocales, afinaciones de instrumentos o para hacer que una pieza sea más fácil de leer y tocar.',
            'Este sitio web es una herramienta diseñada para facilitar transposiciones rápidas. Proporciona una interfaz sencilla para transponer una sola nota de una tonalidad a otra, así como una interfaz más avanzada para transponer una escala completa de una tonalidad a otra. Esto permite, por ejemplo, tocar rápidamente una pieza en la misma tonalidad cuando se tocan dos instrumentos con afinaciones diferentes.',
        ],
        [Language.German]: [
            'Über die Musikalische Transposition',
            'Die musikalische Transposition ist der Prozess, eine Sammlung von Noten (wie eine Melodie, Harmonie oder Tonleiter) um einen konstanten Intervall nach oben oder unten zu verschieben. Dies bedeutet, dass jede Note im Musikstück proportional um die gleiche Tonhöhe verändert wird, was zu einer neuen Tonart führt. Transposition wird häufig verwendet, um unterschiedliche Stimmumfänge, die Stimmung von Instrumenten oder ein Stück leichter lesbar und spielbar zu machen.',
            'Diese Website ist ein Werkzeug, um schnelle Transpositionen zu ermöglichen. Es bietet eine einfache Oberfläche zum Transponieren einer einzelnen Note von einer Tonart in eine andere sowie eine erweiterte Oberfläche zum Transponieren einer gesamten Tonleiter von einer Tonart in eine andere. Dies ermöglicht es, beispielsweise ein Stück schnell in der gleichen Tonart zu spielen, wenn man mit zwei verschiedenen Instrumenten spielt, die unterschiedliche Stimmungen haben.',
        ],
    };

    const listOfInstrumentsTranslation: Translations = {
        [Language.English]: [
            [
                'Piano',
                'Guitar',
                'Violin',
                'Cello',
                'Oboe',
                'Bassoon',
                'Flute',
                'Accordion',
            ],
            ['Piccolo'],
            ['Hunting horn'],
            [
                'Sopranino/piccolo clarinet',
                'Alto saxophone',
                'Baryton saxophone',
            ],
            [],
            ['French horn', 'Alphorn', 'Basset horn', 'English horn'],
            ['Alphorn'],
            ['Alto flute'],
            [],
            ['Clarinet'],
            [
                'Clarinet',
                'Bass clarinet',
                'Trumpet',
                'Soprano saxophone',
                'Tenor saxophone',
                'Cornet',
                'Flugelhorn',
                'Euphonium',
            ],
        ],
        [Language.French]: [
            [
                'Piano',
                'Guitare',
                'Violon',
                'Violoncelle',
                'Hautbois',
                'Basson',
                'Flûte',
                'Accordéon',
            ],
            ['Piccolo'],
            ['Trompe de chasse'],
            [
                'Clarinette sopranino/piccolo',
                'Saxophone alto',
                'Saxophone baryton',
            ],
            [],
            ["Cor d'harmonie", 'Cor des Alpes', 'Cor de basset', 'Cor anglais'],
            ['Cor des Alpes'],
            ['Flûte alto'],
            [],
            ['Clarinette'],
            [
                'Clarinette',
                'Clarinette basse',
                'Trompette',
                'Saxophone soprano',
                'Saxophone tenor',
                'Cornet',
                'Bugle',
                'Euphonium',
            ],
        ],
        [Language.Spanish]: [
            [
                'Piano',
                'Guitarra',
                'Violín',
                'Violoncelo',
                'Oboe',
                'Fagot',
                'Flauta',
                'Acordeón',
            ],
            ['Piccolo'],
            ['Corno de caza'],
            ['Clarinete sopranino/piccolo', 'Saxofón alto', 'Saxofón barítono'],
            [],
            ['Trompa', 'Trompa de los Alpes', 'Corno inglés'],
            ['Trompa de los Alpes'],
            ['Flauta alto'],
            [],
            ['Clarinete'],
            [
                'Clarinete',
                'Clarinete bajo',
                'Trompeta',
                'Saxofón soprano',
                'Saxofón tenor',
                'Flugelhorn',
                'Eufonio',
            ],
        ],
        [Language.German]: [
            [
                'Klavier',
                'Gitarre',
                'Violine',
                'Violoncello',
                'Oboe',
                'Fagott',
                'Akkordeon',
            ],
            ['Piccolo'],
            ['Jagdhorn'],
            ['Sopranino/Piccolo-Klarinette', 'Altsaxophon', 'Barytonsaxophon'],
            [],
            ['Horn', 'Alphorn', 'Bassethorn', 'Englischhorn'],
            ['Alphorn'],
            ['Altflöte'],
            [],
            ['Klarinette'],
            [
                'Klarinette',
                'Bassklarinette',
                'Trompete',
                'Sopransaxophon',
                'Tenorsaxophon',
                'Cornett',
                'Flöte',
                'Euphonium',
            ],
        ],
    };

    const listOfInstrumentsTranslationTitle: Translations = {
        [Language.English]: [
            'Here is a non exhaustive list of instruments sorted by their possible key:',
        ],
        [Language.French]: [
            "Voici une liste non exhaustive d'instruments triés par leur tonalité possible:",
        ],
        [Language.German]: [
            'Hier ist eine nicht exhaustive Liste von Instrumenten, sortiert nach ihren möglichen Tonarten:',
        ],
        [Language.Spanish]: [
            'Aquí hay una lista no exhaustiva de instrumentos ordenados por su tonalidad posible:',
        ],
    };

    const translatedText = useTranslation(selectedLanguage, translations, []);
    const translatedListOfInstruments = useTranslation(
        selectedLanguage,
        listOfInstrumentsTranslation,
        [selectedNotation]
    );
    const translatedListOfInstrumentsTitle = useTranslation(
        selectedLanguage,
        listOfInstrumentsTranslationTitle,
        [selectedNotation]
    );

    function getInstrumentList(keyIndex: number) {
        const instrumentsArray = translatedListOfInstruments[keyIndex];

        if (!instrumentsArray) {
            return null;
        }

        return (
            <li className="my-2">
                <h4 className="text-xl">
                    {getNote(keyIndex, selectedNotation)}:
                </h4>
                <ul className="flex gap-2 flex-wrap">
                    {instrumentsArray.map((instrument, k) => (
                        <li key={k}>
                            {instrument}
                            {`${k === instrumentsArray.length - 1 ? '' : ', '}`}
                        </li>
                    ))}
                </ul>
            </li>
        );
    }

    return (
        <div className="content about-page w-full">
            <h1 className="my-2">{translatedText[0]}</h1>
            <p className="my-2">{translatedText[1]}</p>
            <p className="my-2">{translatedText[2]}</p>
            <p className="my-2">{translatedListOfInstrumentsTitle[0]}</p>
            {getInstrumentList(0)}
            {getInstrumentList(1)}
            {getInstrumentList(2)}
            {getInstrumentList(3)}
            {getInstrumentList(5)}
            {getInstrumentList(6)}
            {getInstrumentList(7)}
            {getInstrumentList(9)}
            {getInstrumentList(10)}
        </div>
    );
}

export default AboutPage;
