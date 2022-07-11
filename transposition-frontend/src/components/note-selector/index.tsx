import React from 'react';
import { NOTES } from '../../utils/notes';
import Button from '../button';
import './../../styles/output.css';

function NoteSelector({ setSelected, selected, selectedNotation }) {
    return (
        <div className="grid grid-cols-4">
            {NOTES.map((note, k) => (
                <Button
                    key={k}
                    onClick={() => setSelected(k)}
                    disabled={k === selected}
                    className={note.english.includes('/') ? 'bg-black' : ''}
                >
                    {note[`${selectedNotation}`]}
                </Button>
            ))}
        </div>
    );
}

export default NoteSelector;
