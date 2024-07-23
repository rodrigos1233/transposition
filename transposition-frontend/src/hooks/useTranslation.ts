import { ReactNode, useEffect, useState } from 'react';

export enum Language {
    English = 'en',
    French = 'fr',
    Spanish = 'es',
    German = 'de',
}

export type Translations = {
    [K in Language]?: ReactNode[];
};

const useTranslation = (
    selectedLanguage: Language,
    translations: Translations,
    customDependencies: any[]
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
    }, [selectedLanguage, ...customDependencies]);

    return translatedStrings;
};

export default useTranslation;
