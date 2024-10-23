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

    const listOfInstrumentsTranslations: Translations = {
        [Language.English]: [
            'Here is a non exhaustive list of instruments sorted by their possible key:',
            <ul className="list-disc">
                <li className="my-2">
                    <h4 className="text-xl">{getNote(0, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Piano</li>
                        <li>Guitar</li>
                        <li>Violin</li>
                        <li>Cello</li>
                        <li>Oboe</li>
                        <li>Bassoon</li>
                        <li>Flute</li>
                        <li>Accordion</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(1, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Piccolo</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(2, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Hunting horn</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(3, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Sopranino/piccolo clarinet</li>
                        <li>Alto saxophone</li>
                        <li>Baryton saxophone</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(5, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>French horn</li>
                        <li>Alphorn</li>
                        <li>Basset horn</li>
                        <li>English horn</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(6, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Alphorn</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(7, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Alto flute</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(9, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Clarinet</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">
                        {getNote(10, selectedNotation)}:
                    </h4>
                    <ul className="flex gap-2">
                        <li>Clarinet</li>
                        <li>Bass clarinet</li>
                        <li>Trumpet</li>
                        <li>Soprano saxophone</li>
                        <li>Tenor saxophone</li>
                        <li>Cornet</li>
                        <li>Flugelhorn</li>
                        <li>Euphonium</li>
                    </ul>
                </li>
            </ul>,
        ],
        [Language.French]: [
            "Voici une liste non exhaustive d'instruments triés par leur tonalité possible:",
            <ul className="list-disc">
                <li className="my-2">
                    <h4 className="text-xl">{getNote(0, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Piano</li>
                        <li>Guitare</li>
                        <li>Violon</li>
                        <li>Violoncelle</li>
                        <li>Hautbois</li>
                        <li>Basson</li>
                        <li>Flûte</li>
                        <li>Accordéon</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(1, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Piccolo</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(2, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Trompe de chasse</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(3, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Clarinette sopranino/piccolo</li>
                        <li>Saxophone alto</li>
                        <li>Saxophone baryton</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(5, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Cor d'harmonie</li>
                        <li>Cor des Alpes</li>
                        <li>Cor de basset</li>
                        <li>Cor anglais</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(6, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Cor des Alpes</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(7, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Flûte alto</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(9, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Clarinette</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">
                        {getNote(10, selectedNotation)}:
                    </h4>
                    <ul className="flex gap-2">
                        <li>Clarinette</li>
                        <li>Clarinette basse</li>
                        <li>Trompette</li>
                        <li>Saxophone soprano</li>
                        <li>Saxophone tenor</li>
                        <li>Cornet</li>
                        <li>Bugle</li>
                        <li>Euphonium</li>
                    </ul>
                </li>
            </ul>,
        ],
        [Language.German]: [
            'Hier ist eine nicht exhaustive Liste von Instrumenten, sortiert nach ihren möglichen Tonarten:',
            <ul className="list-disc">
                <li className="my-2">
                    <h4 className="text-xl">{getNote(0, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Klavier</li>
                        <li>Gitarre</li>
                        <li>Violine</li>
                        <li>Violoncello</li>
                        <li>Oboe</li>
                        <li>Fagott</li>
                        <li>Akkordeon</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(1, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Piccolo</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(2, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Jagdhorn</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(3, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Sopranino/Piccolo-Klarinette</li>
                        <li>Altsaxophon</li>
                        <li>Barytonsaxophon</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(5, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Horn</li>
                        <li>Alphorn</li>
                        <li>Bassethorn</li>
                        <li>Englischhorn</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(6, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Alphorn</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(7, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Altflöte</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(9, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Klarinette</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">
                        {getNote(10, selectedNotation)}:
                    </h4>
                    <ul className="flex gap-2">
                        <li>Klarinette</li>
                        <li>Bassklarinette</li>
                        <li>Trompete</li>
                        <li>Sopransaxophon</li>
                        <li>Tenorsaxophon</li>
                        <li>Cornett</li>
                        <li>Flöte</li>
                        <li>Euphonium</li>
                    </ul>
                </li>
            </ul>,
        ],
        [Language.Spanish]: [
            'Aquí hay una lista no exhaustiva de instrumentos ordenados por su tonalidad posible:',
            <ul className="list-disc">
                <li className="my-2">
                    <h4 className="text-xl">{getNote(0, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Piano</li>
                        <li>Guitarra</li>
                        <li>Violín</li>
                        <li>Violoncelo</li>
                        <li>Oboe</li>
                        <li>Fagot</li>
                        <li>Flauta</li>
                        <li>Acordeón</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(1, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Piccolo</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(2, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Corno de caza</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(3, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Clarinete sopranino/piccolo</li>
                        <li>Saxofón alto</li>
                        <li>Saxofón barítono</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(5, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Trompa</li>
                        <li>Trompa de los Alpes</li>
                        <li>Corno inglés</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(6, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Trompa de los Alpes</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(7, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Flauta alto</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">{getNote(9, selectedNotation)}:</h4>
                    <ul className="flex gap-2">
                        <li>Clarinete</li>
                    </ul>
                </li>
                <li className="my-2">
                    <h4 className="text-xl">
                        {getNote(10, selectedNotation)}:
                    </h4>
                    <ul className="flex gap-2">
                        <li>Clarinete</li>
                        <li>Clarinete bajo</li>
                        <li>Trompeta</li>
                        <li>Saxofón soprano</li>
                        <li>Saxofón tenor</li>
                        <li>Flugelhorn</li>
                        <li>Eufonio</li>
                    </ul>
                </li>
            </ul>,
        ],
    };

    const translatedText = useTranslation(selectedLanguage, translations, []);
    const translatedListOfInstruments = useTranslation(
        selectedLanguage,
        listOfInstrumentsTranslations,
        [selectedNotation]
    );

    return (
        <div className="content about-page w-full">
            <h1 className="my-2">{translatedText[0]}</h1>
            <p className="my-2">{translatedText[1]}</p>
            <p className="my-2">{translatedText[2]}</p>
            <p className="my-2">{translatedListOfInstruments[0]}</p>
            {translatedListOfInstruments[1]}
        </div>
    );
}

export default AboutPage;
