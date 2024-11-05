import useTranslation, {
    Language,
    Translations,
} from '../hooks/useTranslation';

export const listOfInstrumentsTranslation: Translations = {
    [Language.English]: [
        // C
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
        // C#
        ['Piccolo'],
        // D
        ['Hunting horn'],
        // D#
        ['Sopranino/piccolo clarinet', 'Alto saxophone', 'Baryton saxophone'],
        // E
        [],
        // F
        ['French horn', 'Alphorn', 'Basset horn', 'English horn'],
        // F#
        ['Alphorn'],
        // G
        ['Alto flute'],
        // G#
        [],
        // A
        ['Clarinet'],
        // Bb
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
        // B
        [],
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
        ['Clarinette sopranino/piccolo', 'Saxophone alto', 'Saxophone baryton'],
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
