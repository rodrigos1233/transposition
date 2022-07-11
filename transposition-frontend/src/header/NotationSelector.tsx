import React from 'react';
import { Note, NOTES } from '../utils/notes';
import Button from '../components/button';
import './header.css';

function NotationSelector({
    selectedNotation,
    setSelectedNotation,
}: {
    selectedNotation: keyof Note;
    setSelectedNotation: any;
}) {
    const availableNotations = Object.keys(NOTES[0]);

    return (
        <div className="notation-selector">
            <p>Notation:</p>
            {availableNotations.map((notation, k) => (
                <Button
                    key={k}
                    onClick={() => setSelectedNotation(notation)}
                    disabled={notation === selectedNotation}
                    className="ml-3"
                >
                    {notation}
                </Button>
            ))}
        </div>
    );
}

export default NotationSelector;
