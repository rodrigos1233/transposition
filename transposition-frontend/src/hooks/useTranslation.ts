import { ReactNode, useEffect, useState } from 'react';

export enum Language {
    English = 'en',
    French = 'fr',
}

export type Translations = {
    [K in Language]: ReactNode[];
};

const useTranslation = (
    selectedLanguage: Language,
    translations: Translations
) => {
    const [translatedStrings, setTranslatedStrings] = useState<ReactNode[]>([]);

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
