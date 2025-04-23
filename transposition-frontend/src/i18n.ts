import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';
import esTranslation from './locales/es/translation.json';

// Same logic as in ContextsProvider
const detectUserBrowserLanguage = (): string => {
  const userLanguage = navigator.language.toLowerCase().split('-')[0];
  const localStorageLanguage = localStorage.getItem('selectedLanguage');

  if (localStorageLanguage) {
    return localStorageLanguage;
  }

  switch (userLanguage) {
    case 'fr':
      return 'fr';
    case 'es':
      return 'es';
    case 'de':
      return 'de';
    default:
      return 'en';
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      es: { translation: esTranslation }
    },
    lng: detectUserBrowserLanguage(), // Use the same language detection logic
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
