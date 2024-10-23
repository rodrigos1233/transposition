import React from 'react';
import { Note, NOTES } from '../../utils/notes';
import Button from '../button';
import './../../styles/output.css';
import './note-selector.css';
import { useIsMobile } from '../../hooks/useIsMobile';

type NoteSelectorProps = {
    setSelected: (index: number) => void;
    selected: number;
    selectedNotation: keyof Note;
    usedScale?: Note[];
    blackNotesAreHalf?: boolean;
};

function NoteSelector({
    setSelected,
    selected,
    selectedNotation,
    usedScale,
    blackNotesAreHalf,
}: NoteSelectorProps) {
    const selectedNotes = usedScale ?? NOTES;
    const isMobile = useIsMobile();

    return (
        <div
            className={`note-selector ${
                isMobile ? 'note-selector--mobile' : ''
            } mt-2 mb-2`}
        >
            {selectedNotes.map((note, k) => {
                const isBlackNote =
                    note.english.includes('♭') || note.english.includes('♯');

                const nextIsBlackNote =
                    k + 1 < selectedNotes.length &&
                    (selectedNotes[k + 1].english.includes('♭') ||
                        selectedNotes[k + 1].english.includes('♯'));

                if (isBlackNote && nextIsBlackNote && blackNotesAreHalf) {
                    return (
                        <div
                            key={`wrapper-${k}`}
                            className="black-note-wrapper"
                        >
                            <Button
                                onClick={() => setSelected(k)}
                                disabled={k === selected}
                                className="bg-neutral-800 text-white"
                                style={{ flex: `0.5 2 0` }}
                            >
                                {note[selectedNotation]}
                            </Button>
                            <Button
                                onClick={() => setSelected(k + 1)}
                                disabled={k + 1 === selected}
                                className="bg-neutral-800 text-white"
                                style={{ flex: `0.5 2 0` }}
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
                        className={
                            isBlackNote
                                ? 'bg-neutral-800 text-white'
                                : 'bg-neutral-100'
                        }
                        style={blackNotesAreHalf ? { flex: `1 1 0` } : {}}
                    >
                        {note[selectedNotation]}
                    </Button>
                );
            })}
        </div>
    );
}

export default NoteSelector;
