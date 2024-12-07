import React, { useContext } from 'react';
import { Note, NOTES } from '../utils/notes';
import Button from '../components/button';
import './header.css';
import useTranslation, {
    Language,
    Translations,
} from '../hooks/useTranslation';
import ButtonsFlexContainer from '../components/button/ButtonsFlexContainer';
import LanguageContext from '../contexts/LanguageContext';
import NotationContext from '../contexts/NotationContext';

function NotationSelector() {
    const availableNotations = Object.keys(NOTES[0]);
    const { selectedNotation, setSelectedNotation } =
        useContext(NotationContext);

    const languageContext = useContext(LanguageContext);
    const selectedLanguage = languageContext.selectedLanguage;

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
        <ButtonsFlexContainer>
            <p>{translatedTitles[0]}</p>
            {availableNotations.map((notation, k) => (
                <Button
                    key={k}
                    onClick={() => setSelectedNotation(notation as keyof Note)}
                    disabled={notation === selectedNotation}
                    className="ml-3"
                >
                    {translatedStrings[k]}
                </Button>
            ))}
        </ButtonsFlexContainer>
    );
}

export default NotationSelector;
