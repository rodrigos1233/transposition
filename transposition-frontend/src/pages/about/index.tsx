import React from 'react';
import useTranslation, { Language, Translations } from '../../hooks/useTranslation';
import {getNote, Note} from "../../utils/notes";

function AboutPage({ selectedLanguage, selectedNotation }: { selectedLanguage: Language, selectedNotation: keyof Note }) {
    const translations: Translations = {
        [Language.English]: [
            'About Musical Transposition',
            'Musical transposition is the process of moving a collection of notes (a melody or a harmony) up or down in pitch by a constant interval. This means that every note in the piece of music is raised or lowered by the same distance, resulting in a new key. Transposition is commonly used in music to accommodate different vocal ranges, instrument tuning, or to make a piece easier to read and play.',
            'This website is a tool to help making quick transposition. It provides a simple interface to transpose a single note from one key to another, as well as a more advanced interface to transpose a full scale from one key to another, allowing for example to quickly play a piece in the same key when playing with 2 different instruments that have different tunings.',
        ],
        [Language.French]: [
            'À propos de la transposition musicale',
            "La transposition musicale est le processus de déplacement d'une collection de notes (une mélodie ou une harmonie) vers le haut ou vers le bas dans la hauteur par un intervalle constant. Cela signifie que chaque note de la pièce de musique est élevée ou abaissée de la même distance, résultant en une nouvelle tonalité. La transposition est couramment utilisée en musique pour s'adapter à différentes tessitures vocales, à l'accordage des instruments ou pour rendre une pièce plus facile à lire et à jouer.",
            'Ce site web est un outil pour aider à faire des transpositions rapides. Il fournit une interface simple pour transposer une note d\'une tonalité à une autre, ainsi que une interface plus avancée pour transposer une gamme complète d\'une tonalité à une autre, permettant ainsi de jouer rapidement une pièce dans la même tonalité lorsque vous jouez avec 2 instruments qui ont des accords différents.'
        ],
        [Language.Spanish]: [
            'Acerca de la Transposición Musical',
            'La transposición musical es el proceso de mover una colección de notas (una melodía o una armonía) hacia arriba o hacia abajo en el tono por un intervalo constante. Esto significa que cada nota en la pieza de música se eleva o baja por la misma distancia, resultando en una nueva tonalidad. La transposición se utiliza comúnmente en la música para acomodar diferentes rangos vocales, afinar instrumentos, o hacer que una pieza sea más fácil de leer y tocar.',
            'Este sitio web es una herramienta para ayudar a hacer las transposiciones rápidas. Proporciona una interfaz sencilla para transponer una nota de una tonalidad a otra, así como una interfaz más avanzada para transponer una escala completa de una tonalidad a otra, lo que permite, por ejemplo, reproducir rápidamente una pieza en la misma tonalidad cuando se toca con 2 instrumentos que tienen acordes diferentes.'
        ],
        [Language.German]: [
            'Über die Musikalische Transposition',
            'Die musikalische Transposition ist der Prozess, eine Sammlung von Noten (eine Melodie oder eine Harmonie) um einen konstanten Intervall nach oben oder unten zu verschieben. Dies bedeutet, dass jeder Ton im Musikstück um die gleiche Distanz erhöht oder verringert wird, was zu einer neuen Tonart führt. Transposition wird in der Musik häufig verwendet, um unterschiedliche Stimmumfänge, die Stimmung von Instrumenten oder um ein Stück leichter lesbar und spielbar zu machen.',
            'Diese Website ist ein Werkzeug, um schnelle Transpositionen zu ermöglichen. Es bietet eine einfache Oberfläche zum Transponieren einer einzelnen Note aus einer Transponierungs-Instrument-Tonalität in eine andere, sowie eine erweiterte Oberfläche zum Transponieren einer vollständigen Tonleiter-Tonalität in eine andere, um beispielsweise schnell eine Musikstück in der gleichen Tonalität zu spielen, wenn man mit 2 verschiedenen Instrumenten spielt, die unterschiedliche Stimmungen haben.'
        ],
    };

    const listOfInstrumentsTranslations: Translations = {
        [Language.English]: [
            'Here is a non exhaustive list of instruments sorted by their possible key:',
            <ul className="list-disc">
                <li className="my-2">{getNote(0, selectedNotation)}:
                    <ul>
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
                <li className="my-2">{getNote(1, selectedNotation)}:
                    <ul>
                        <li>Piccolo</li>
                    </ul>
                </li>
                <li className="my-2">{getNote(2, selectedNotation)}:
                    <ul>
                        <li>Hunting horn</li>
                    </ul>
                </li>
                <li className="my-2">{getNote(3, selectedNotation)}:
                    <ul>
                        <li>Sopranino/piccolo clarinet</li>
                        <li>Alto saxophone</li>
                        <li>Baryton saxophone</li>
                        <li>Contrabass saxhorn</li>
                    </ul>
                </li>
                <li className="my-2">{getNote(5, selectedNotation)}:
                    <ul>
                        <li>French horn</li>
                        <li>Alphorn</li>
                        <li>Basset horn</li>
                    </ul>
                </li>
                <li className="my-2">{getNote(6, selectedNotation)}:
                    <ul>
                        <li>Alphorn (mostly in Switzerland)</li>
                    </ul>
                </li>
                <li className="my-2">{getNote(7, selectedNotation)}:
                    <ul>
                        <li>Alto flute</li>
                    </ul>
                </li>
                <li className="my-2">{getNote(9, selectedNotation)}:
                    <ul>
                        <li>Clarinet</li>
                    </ul>
                </li>
                <li className="my-2">{getNote(10, selectedNotation)}:
                    <ul>
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
            </ul>
        ],
    [Language.French]: [
        'Voici une liste non exhaustive d\'instruments triés par leur tonalité possible:',
        <ul className="list-disc">
            <li className="my-2">{getNote(0, selectedNotation)}:
                <ul>
                    <li>Piano</li>
                    <li>Guitare</li>
                    <li>Violon</li>
                    <li>Violoncello</li>
                    <li>Oboe</li>
                    <li>Basson</li>
                    <li>Flûte</li>
                    <li>Accordéon</li>
                </ul>
            </li>
            <li className="my-2">{getNote(1, selectedNotation)}:
                <ul>
                    <li>Piccolo</li>
                </ul>
            </li>
            <li className="my-2">{getNote(2, selectedNotation)}:
                <ul>
                    <li>Corne de chasse</li>
                </ul>
            </li>
            <li className="my-2">{getNote(3, selectedNotation)}:
                <ul>
                    <li>Clarinette sopranino/piccolo</li>
                    <li>Saxophone alto</li>
                    <li>Saxophone baryton</li>
                    <li>Corne de basse accordéon</li>
                </ul>
            </li>
            <li className="my-2">{getNote(5, selectedNotation)}:
                <ul>
                    <li>Cor d'haromonie</li>
                    <li>Cor des Alpes</li>
                    <li>Cor de basset</li>
                </ul>
            </li>
            <li className="my-2">{getNote(6, selectedNotation)}:
                <ul>
                    <li>Cor des Alpes (principalement en Suisse)</li>
                </ul>
            </li>
            <li className="my-2">{getNote(7, selectedNotation)}:
                <ul>
                    <li>Flûte alto</li>
                </ul>
            </li>
            <li className="my-2">{getNote(9, selectedNotation)}:
                <ul>
                    <li>Clarinette</li>
                </ul>
            </li>
            <li className="my-2">{getNote(10, selectedNotation)}:
                <ul>
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
        </ul>
    ],
    [Language.German]: [
        'Hier ist eine nicht exhaustive Liste von Instrumenten, sortiert nach ihren möglichen Tonarten:',
        <ul className="list-disc">
            <li className="my-2">{getNote(0, selectedNotation)}:
                <ul>
                    <li>Klavier</li>
                    <li>Gitarre</li>
                    <li>Violine</li>
                    <li>Violoncello</li>
                    <li>Oboe</li>
                    <li>Bassoon</li>
                    <li>Flügelhorn</li>
                    <li>Akkordeon</li>
                </ul>
            </li>
            <li className="my-2">{getNote(1, selectedNotation)}:<ul><li>Piccolo</li></ul></li>
            <li className="my-2">{getNote(2, selectedNotation)}:<ul><li>Jagdhorn</li></ul></li>
            <li className="my-2">{getNote(3, selectedNotation)}:
                <ul>
                    <li>Sopranino/Piccolo-Klarinette</li>
                    <li>Altsaxophon</li>
                    <li>Barytonsaxophon</li>
                    <li>Kontrabasssaxhorn</li>
                </ul>
            </li>
            <li className="my-2">{getNote(5, selectedNotation)}:
                <ul>
                    <li>Horn</li>
                    <li>Alphorn</li>
                    <li>Bassethorn</li>
                </ul>
            </li>
            <li className="my-2">{getNote(6, selectedNotation)}:
                <ul>
                    <li>Alphorn (meistens in der Schweiz)</li>
                </ul>
            </li>
            <li className="my-2">{getNote(7, selectedNotation)}:
                <ul>
                    <li>Altflöte</li>
                </ul>
            </li>
            <li className="my-2">{getNote(9, selectedNotation)}:
                <ul>
                    <li>Klarinette</li>
                </ul>
            </li>
            <li className="my-2">{getNote(10, selectedNotation)}:
                <ul>
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
        </ul>
    ],
    [Language.Spanish]: [
        'Aquí hay una lista no exhaustiva de instrumentos ordenados por su tonalidad posible:',
        <ul className="list-disc">
            <li className="my-2">{getNote(0, selectedNotation)}:
                <ul>
                    <li>Piano</li>
                    <li>Guitarra</li>
                    <li>Violín</li>
                    <li>Violoncelo</li>
                    <li>Oca</li>
                    <li>Bassoón</li>
                    <li>Flauta</li>
                    <li>Acordeón</li>
                </ul>
            </li>
            <li className="my-2">{getNote(1, selectedNotation)}:
                <ul>
                    <li>Piccolo</li>
                </ul>
            </li>
            <li className="my-2">{getNote(2, selectedNotation)}:
                <ul>
                    <li>Corno de caza</li>
                </ul>
            </li>
            <li className="my-2">{getNote(3, selectedNotation)}:
                <ul>
                    <li>Clarinete sopranino/piccolo</li>
                    <li>Saxofón alto</li>
                    <li>Saxofón barítono</li>
                </ul>
            </li>
            <li className="my-2">{getNote(5, selectedNotation)}:
                <ul>
                    <li>Trompa</li>
                    <li>Trompa de los Alpes</li>
                </ul>
            </li>
            <li className="my-2">{getNote(6, selectedNotation)}:
                <ul>
                    <li>Trompa de los Alpes (principalmente en Suiza)</li>
                </ul>
            </li>
            <li className="my-2">{getNote(7, selectedNotation)}:
                <ul>
                    <li>Flauta alta</li>
                </ul>
            </li>
            <li className="my-2">{getNote(9, selectedNotation)}:
                <ul>
                    <li>Clarinete</li>
                </ul>
            </li>
            <li className="my-2">{getNote(10, selectedNotation)}:
                <ul>
                    <li>Clarinete</li>
                    <li>Clarinete bajo</li>
                    <li>Trompeta</li>
                    <li>Saxofón soprano</li>
                    <li>Saxofón tenor</li>
                    <li>Flugelhorn</li>
                    <li>Eufonía</li>
                </ul>
            </li>
        </ul>
    ],
    }

    const translatedText = useTranslation(selectedLanguage, translations, []);
    const translatedListOfInstruments = useTranslation(selectedLanguage, listOfInstrumentsTranslations, [selectedNotation]);

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