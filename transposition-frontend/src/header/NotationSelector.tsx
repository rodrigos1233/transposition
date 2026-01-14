import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Note, NOTES } from '../utils/notes';
import './header.css';
import NotationContext from '../contexts/NotationContext';

function NotationSelector() {
  const availableNotations = Object.keys(NOTES[0]);
  const { selectedNotation, setSelectedNotation } =
    useContext(NotationContext);
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
        {t('notationSelector.label')}
      </span>
      <div className="flex gap-1">
        {availableNotations.map((notation) => (
          <button
            key={notation}
            onClick={() => setSelectedNotation(notation as keyof Note)}
            disabled={notation === selectedNotation}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-all duration-150
              ${
                notation === selectedNotation
                  ? 'bg-emerald-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-emerald-100 hover:text-emerald-700'
              }`}
          >
            {t(`notationSelector.${notation}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default NotationSelector;
