import { useContext } from 'react';
import { Note, NOTES } from '../../utils/notes';
import Button from '../button';
import './../../styles/output.css';
import './note-selector.css';

import ButtonsGridContainer from '../button/ButtonsGridContainer';
import NotationContext from '../../contexts/NotationContext';

type NoteSelectorProps = {
  setSelected: (index: number) => void;
  selected: number;
  usedScale?: Note[];
  blackNotesAreHalf?: boolean;
  colour?: 'sky' | 'emerald' | 'amber' | 'red' | 'purple';
};

function NoteSelector({
  setSelected,
  selected,
  usedScale,
  blackNotesAreHalf,
  colour,
}: NoteSelectorProps) {
  const selectedNotes = usedScale ?? NOTES;
  const { selectedNotation } = useContext(NotationContext);

  // Get background class for a note button based on whether it's black and/or selected
  const getButtonClasses = (isBlackNote: boolean, isSelected: boolean) => {
    if (isSelected) {
      // When selected, use a light background so the colored border is visible
      return isBlackNote ? 'text-neutral-800' : 'bg-neutral-100';
    }
    // When not selected, black notes get dark background
    return isBlackNote ? 'bg-neutral-800 text-white' : 'bg-neutral-100';
  };

  return (
    <ButtonsGridContainer className={`mt-2 mb-2`}>
      {selectedNotes.map((note, k) => {
        const isBlackNote =
          note.english.includes('♭') || note.english.includes('♯');

        const nextIsBlackNote =
          k + 1 < selectedNotes.length &&
          (selectedNotes[k + 1].english.includes('♭') ||
            selectedNotes[k + 1].english.includes('♯'));

        if (isBlackNote && nextIsBlackNote && blackNotesAreHalf) {
          return (
            <div key={`wrapper-${k}`} className="black-note-wrapper">
              <Button
                onClick={() => setSelected(k)}
                disabled={k === selected}
                className={getButtonClasses(true, k === selected)}
                style={{ flex: `0.5 2 0` }}
                colour={colour ?? 'emerald'}
              >
                {note[selectedNotation]}
              </Button>
              <Button
                onClick={() => setSelected(k + 1)}
                disabled={k + 1 === selected}
                className={getButtonClasses(true, k + 1 === selected)}
                style={{ flex: `0.5 2 0` }}
                colour={colour ?? 'emerald'}
              >
                {selectedNotes[k + 1][selectedNotation]}
              </Button>
            </div>
          );
        }

        // Skip rendering of the second black note in a pair
        if (
          k > 0 &&
          selectedNotes[k].english.includes('♭') &&
          blackNotesAreHalf
        ) {
          return null;
        }

        return (
          <Button
            key={k}
            onClick={() => setSelected(k)}
            disabled={k === selected}
            className={getButtonClasses(isBlackNote, k === selected)}
            style={blackNotesAreHalf ? { flex: `1 1 0` } : {}}
            colour={colour ?? 'emerald'}
          >
            {note[selectedNotation]}
          </Button>
        );
      })}
    </ButtonsGridContainer>
  );
}

export default NoteSelector;
