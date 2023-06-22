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
    };

    const translatedStrings = useTranslation(
        selectedLanguage,
        translations,
        []
    );

    return (
        <div className="notation-selector">
            <p>Notation:</p>
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
