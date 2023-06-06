import { useEffect, useState } from 'react';

enum Language {
    English = 'en',
    French = 'fr',
}

type Translations = {
    [K in Language]: string[];
};

const useTranslation = (
    selectedLanguage: Language,
    translations: Translations
) => {
    const [translatedStrings, setTranslatedStrings] = useState<string[]>([]);

    useEffect(() => {
        const translate = () => {
            const fallbackLanguage = Language.English;
            const fallbackStrings = translations[fallbackLanguage] || [];
            const selectedStrings =
                translations[selectedLanguage] || fallbackStrings;

            setTranslatedStrings(selectedStrings);
        };

        translate();
    }, [selectedLanguage, translations]);

    return translatedStrings;
};

export default useTranslation;
