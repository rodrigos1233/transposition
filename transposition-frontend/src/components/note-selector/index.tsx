import React from 'react';
import { Note, NOTES } from '../../utils/notes';
import Button from '../button';
import './../../styles/output.css';
import './note-selector.css';
import { useIsMobile } from '../../hooks/useIsMobile';

function NoteSelector({
    setSelected,
    selected,
    selectedNotation,
    usedScale,
}: {
    setSelected: any;
    selected: number;
    selectedNotation: keyof Note;
    usedScale?: Note[];
}) {
    const selectedNotes = usedScale ? usedScale : NOTES;
    const isMobile = useIsMobile();

    return (
        <div
            className={`note-selector ${
                isMobile ? 'note-selector--mobile' : ''
            }`}
        >
            {selectedNotes.map((note, k) => (
                <Button
                    key={k}
                    onClick={() => setSelected(k)}
                    disabled={k === selected}
                    className={
                        note.english.includes('♭') || note.english.includes('♯')
                            ? 'bg-neutral-800 text-white'
                            : 'bg-neutral-100'
                    }
                >
                    {note[`${selectedNotation}`]}
                </Button>
            ))}
        </div>
    );
}

export default NoteSelector;
