import React from 'react';
import { Note, NOTES } from '../utils/notes';
import Button from '../components/button';
import './header.css';
import useTranslation, {
    Language,
    Translations,
} from '../hooks/useTranslation';

function NotationSelector({
    selectedNotation,
    setSelectedNotation,
    selectedLanguage,
}: {
    selectedNotation: keyof Note;
    setSelectedNotation: any;
    selectedLanguage: Language;
}) {
    const availableNotations = Object.keys(NOTES[0]);

    const titleTranslations: Translations = {
        [Language.English]: ['Notation:'],
        [Language.French]: ['Notation:'],
        [Language.Spanish]: ['Notación:'],
        [Language.German]: ['Notation:'],
    };

    const translations: Translations = {
        [Language.English]: availableNotations,
        [Language.French]: availableNotations.map((notation) => {
            if (notation === 'romance') {
                return 'latine';
            }

            if (notation === 'german') {
                return 'allemande';
            }

            if (notation === 'english') {
                return 'anglaise';
            }

            return notation;
        }),
        [Language.Spanish]: availableNotations.map((notation) => {
            if (notation === 'romance') {
                return 'latina';
            }

            if (notation === 'german') {
                return 'alemana';
            }

            if (notation === 'english') {
                return 'inglesa';
            }

            return notation;
        }),
        [Language.German]: availableNotations.map((notation) => {
            if (notation === 'romance') {
                return 'lateinisch';
            }

            if (notation === 'german') {
                return 'deutsch';
            }

            if (notation === 'english') {
                return 'englisch';
            }

            return notation;
        }),
    };

    const translatedStrings = useTranslation(
        selectedLanguage,
        translations,
        []
    );

    const translatedTitles = useTranslation(
        selectedLanguage,
        titleTranslations,
        []
    );

    return (
        <div className="notation-selector">
            <p>{translatedTitles[0]}</p>
            {availableNotations.map((notation, k) => (
                <Button
                    key={k}
                    onClick={() => setSelectedNotation(notation)}
                    disabled={notation === selectedNotation}
                    className="ml-3"
                >
                    {translatedStrings[k]}
                </Button>
            ))}
        </div>
    );
}

export default NotationSelector;
