import React, { useEffect, useState } from 'react';
import { getNote, Note, NOTES } from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { transposer } from '../../utils/transposer';

function SimpleTransposition({
    selectedNotation,
}: {
    selectedNotation: keyof Note;
}) {
    const [selectedOriginKey, setSelectedOriginKey] = useState(0);
    const [selectedNote, setSelectedNote] = useState(0);
    const [selectedTargetKey, setSelectedTargetKey] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const targetNote = transposer(
            selectedNote,
            selectedOriginKey,
            selectedTargetKey
        );
        setMessage(
            `A ${getNote(selectedNote, selectedNotation)} in ${getNote(
                selectedOriginKey,
                selectedNotation
            )} is a ${getNote(targetNote, selectedNotation)} in ${getNote(
                selectedTargetKey,
                selectedNotation
            )}`
        );
    }, [selectedOriginKey, selectedNote, selectedTargetKey, selectedNotation]);

    console.log(message);

    return (
        <div className="content simple-transposition w-full">
            <div className="simple-transposition__origin-key-select w-full">
                origin key:
                <NoteSelector
                    selected={selectedOriginKey}
                    setSelected={setSelectedOriginKey}
                    selectedNotation={selectedNotation}
                />
            </div>
            <div className="simple-transposition__note-select w-full">
                note:
                <NoteSelector
                    selected={selectedNote}
                    setSelected={setSelectedNote}
                    selectedNotation={selectedNotation}
                />
            </div>
            <div className="simple-transposition__target-key-select w-full">
                target key:
                <NoteSelector
                    selected={selectedTargetKey}
                    setSelected={setSelectedTargetKey}
                    selectedNotation={selectedNotation}
                />
            </div>
            <p>{message}</p>
        </div>
    );
}

export default SimpleTransposition;
