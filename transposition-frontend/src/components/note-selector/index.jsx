import React from 'react';
import {NOTES} from "../../utils/notes";
import Button from "../button";

function NoteSelector({setSelected, selected}) {
    return (
        <div className="note-selector">
            {NOTES.map((note, k) => (
                <Button key={k} onClick={() => setSelected(k)} disabled={k === selected}>{note}</Button>
            )) }
        </div>
    );
}

export default NoteSelector;
