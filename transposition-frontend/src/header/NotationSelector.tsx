import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Note, NOTES } from '../utils/notes';
import Button from '../components/button';
import './header.css';
import ButtonsFlexContainer from '../components/button/ButtonsFlexContainer';
import NotationContext from '../contexts/NotationContext';

function NotationSelector() {
  const availableNotations = Object.keys(NOTES[0]);
  const { selectedNotation, setSelectedNotation } = useContext(NotationContext);
  const { t } = useTranslation();

  return (
    <ButtonsFlexContainer>
      <p>{t('notationSelector.label')}</p>
      {availableNotations.map((notation, k) => (
        <Button
          key={k}
          onClick={() => setSelectedNotation(notation as keyof Note)}
          disabled={notation === selectedNotation}
          className="ml-3"
        >
          {t(`notationSelector.${notation}`)}
        </Button>
      ))}
    </ButtonsFlexContainer>
  );
}

export default NotationSelector;
