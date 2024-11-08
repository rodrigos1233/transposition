import React from 'react';
import Button from '../components/button';
import './header.css';
import useTranslation, {
    Language,
    Translations,
} from '../hooks/useTranslation';
import Text from '../components/text';
import ButtonsFlexContainer from '../components/button/ButtonsFlexContainer';

function LanguageSelector({
    selectedLanguage,
    setSelectedLanguage,
}: {
    selectedLanguage: Language;
    setSelectedLanguage: (language: Language) => void;
}) {
    const AvailableLanguages = Object.values(Language);

    const translations: Translations = {
        [Language.English]: ['Language:'],
        [Language.French]: ['Langue:'],
    };

    const translatedStrings = useTranslation(
        selectedLanguage,
        translations,
        []
    );

    return (
        <ButtonsFlexContainer>
            <Text size={'small'}>{translatedStrings[0]}</Text>
            {AvailableLanguages.map((language, k) => (
                <Button
                    key={k}
                    onClick={() => setSelectedLanguage(language)}
                    disabled={language === selectedLanguage}
                    className="ml-3"
                >
                    <Text size={'small'}>{language}</Text>
                </Button>
            ))}
        </ButtonsFlexContainer>
    );
}

export default LanguageSelector;
