import React from 'react';
import { Note, NOTES } from '../../utils/notes';
import Button from '../button';
import './../../styles/output.css';
import './note-selector.css';

function NoteSelector({
    setSelected,
    selected,
    selectedNotation,
}: {
    setSelected: any;
    selected: number;
    selectedNotation: keyof Note;
}) {
    return (
        <div className="note-selector">
            {NOTES.map((note, k) => (
                <Button
                    key={k}
                    onClick={() => setSelected(k)}
                    disabled={k === selected}
                    className={
                        note.english.includes('/')
                            ? 'bg-black text-white disabled:text-black hover:text-black'
                            : ''
                    }
                >
                    {note[`${selectedNotation}`]}
                </Button>
            ))}
        </div>
    );
}

export default NoteSelector;
