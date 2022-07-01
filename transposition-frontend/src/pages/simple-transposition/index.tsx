import React, {useEffect, useState} from 'react';
import {NOTES} from "../../utils/notes";
import NoteSelector from "../../components/note-selector";
import {transposer} from "../../utils/transposer";

function SimpleTransposition() {
    const [selectedOriginKey, setSelectedOriginKey] = useState(0);
    const [selectedNote, setSelectedNote] = useState(0);
    const [selectedTargetKey, setSelectedTargetKey] = useState(0);
    const [message, setMessage] = useState('')

    useEffect(() => {
        const targetNote = transposer(selectedNote, selectedOriginKey, selectedTargetKey);
        setMessage(`A ${NOTES[selectedNote]} in ${NOTES[selectedOriginKey]} is a ${NOTES[targetNote]} in ${NOTES[selectedTargetKey]}`);
    }, [selectedOriginKey, selectedNote, selectedTargetKey])

    console.log(message);

    return (
        <div className="content simple-transposition">
            <div className="simple-transposition__origin-key-select">
                origin key:
                <NoteSelector selected={selectedOriginKey} setSelected={setSelectedOriginKey} />
            </div>
            <div className="simple-transposition__note-select">
                note:
                <NoteSelector selected={selectedNote} setSelected={setSelectedNote} />
            </div>
            <div className="simple-transposition__target-key-select">
                target key:
                <NoteSelector selected={selectedTargetKey} setSelected={setSelectedTargetKey} />
            </div>
            <p>{message}</p>


        </div>
    );
}

export default SimpleTransposition;
