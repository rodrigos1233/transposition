import { ReactNode, useEffect } from 'react';
import { useTranslation as useI18NextTranslation } from 'react-i18next';
import { Language, Translations } from './useTranslationLegacy';

export const useTranslationAdapter = (
  selectedLanguage: Language,
  translations: Translations,
  customDependencies: any[] = []
): ReactNode[][] => {
  const { i18n } = useI18NextTranslation();

  // Update i18next resources whenever translations change
  useEffect(() => {
    Object.entries(translations).forEach(([lang, values]) => {
      if (values) {
        i18n.addResourceBundle(
          lang,
          'translation',
          { content: values },
          true,
          true
        );
      }
    });
  }, [translations, ...customDependencies]);

  // Change language when selectedLanguage changes
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  // Get the translations for the current language, falling back to English
  const currentTranslations = translations[selectedLanguage] || translations[Language.English] || [];
  
  // Ensure array structure is maintained
  return currentTranslations.map(value => 
    Array.isArray(value) ? value : [value]
  );
};

export { Language, type Translations } from './useTranslationLegacy';
export default useTranslationAdapter;
