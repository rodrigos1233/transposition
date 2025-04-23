import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/button';
import './header.css';
import { Language } from '../hooks/useTranslationLegacy.ts';
import Text from '../components/text';
import ButtonsFlexContainer from '../components/button/ButtonsFlexContainer';
import LanguageContext from '../contexts/LanguageContext';

function LanguageSelector() {
  const AvailableLanguages = Object.values(Language);
  const { t, i18n } = useTranslation();

  const languageContext = useContext(LanguageContext);
  const selectedLanguage = languageContext.selectedLanguage;
  const setSelectedLanguage = languageContext.setSelectedLanguage;

  // Update i18next language when context language changes
  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <ButtonsFlexContainer>
      <Text size={'small'}>{t('languageSelector.label')}</Text>
      {AvailableLanguages.map((language, k) => (
        <Button
          key={k}
          onClick={() => handleLanguageChange(language)}
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
