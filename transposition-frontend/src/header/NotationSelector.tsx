import React from 'react';
import { Note, NOTES } from '../utils/notes';
import Button from '../components/button';

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
            {availableNotations.map((notation, k) => (
                <Button
                    key={k}
                    onClick={() => setSelectedNotation(notation)}
                    disabled={notation === selectedNotation}
                >
                    {notation}
                </Button>
            ))}
        </div>
    );
}

export default NotationSelector;
