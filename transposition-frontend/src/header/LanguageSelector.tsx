import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import './header.css';
import { Language } from '../hooks/useTranslationLegacy.ts';
import LanguageContext from '../contexts/LanguageContext';

function LanguageSelector() {
  const AvailableLanguages = Object.values(Language);
  const { t, i18n } = useTranslation();

  const languageContext = useContext(LanguageContext);
  const selectedLanguage = languageContext.selectedLanguage;
  const setSelectedLanguage = languageContext.setSelectedLanguage;

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
        {t('languageSelector.label')}
      </span>
      <div className="flex gap-1">
        {AvailableLanguages.map((language) => (
          <button
            key={language}
            onClick={() => handleLanguageChange(language)}
            disabled={language === selectedLanguage}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-all duration-150
              ${
                language === selectedLanguage
                  ? 'bg-emerald-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-emerald-100 hover:text-emerald-700'
              }`}
          >
            {language}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSelector;
