import React, { useEffect, useState } from 'react';
import {
    getNote,
    MAJOR_SCALES,
    MINOR_SCALES,
    Note,
    NOTES,
} from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { transposer } from '../../utils/transposer';
import { scaleBuilder } from '../../utils/scaleBuilder';
import Button from '../../components/button';

function ScaleTransposition({
    selectedNotation,
}: {
    selectedNotation: keyof Note;
}) {
    const [selectedOriginKey, setSelectedOriginKey] = useState(0);
    const [selectedNote, setSelectedNote] = useState(0);
    const [selectedTargetKey, setSelectedTargetKey] = useState(0);
    const [message, setMessage] = useState(<></>);
    const [mode, setMode] = useState<'major' | 'minor'>('major');

    useEffect(() => {
        const targetNote = transposer(
            selectedNote,
            selectedOriginKey,
            selectedTargetKey
        );
        const scale = scaleBuilder(selectedNote, mode);

        const notesSuite = scale.notesInScale.map(
            (noteInScale) => `${noteInScale.note[`${selectedNotation}`]}, `
        );

        const transposedScale = scaleBuilder(targetNote, mode);

        const transposedScaleNotesSuite = transposedScale.notesInScale.map(
            (noteInScale) => `${noteInScale.note[`${selectedNotation}`]}, `
        );
        setMessage(
            <>
                {`The scale of ${getNote(
                    selectedNote,
                    selectedNotation
                )} ${mode}, which for an instrument in ${getNote(
                    selectedOriginKey,
                    selectedNotation
                )} consists of the following note suite:`}{' '}
                <span className={'font-bold text-lg'}>{notesSuite}</span>{' '}
                {`becomes a scale of ${getNote(
                    targetNote,
                    selectedNotation,
                    mode === 'minor' ? MINOR_SCALES : MAJOR_SCALES
                )} ${mode}, with the following note suite: `}{' '}
                <span className={'font-bold text-lg'}>
                    {transposedScaleNotesSuite}
                </span>{' '}
                {`when transposed for an instrument in ${getNote(
                    selectedTargetKey,
                    selectedNotation
                )}`}
            </>
        );

        console.log({ scale });
    }, [
        selectedOriginKey,
        selectedNote,
        selectedTargetKey,
        selectedNotation,
        mode,
    ]);

    return (
        <div className="content simple-transposition w-full">
            <div className="mode-selector h-14">
                <Button
                    onClick={() => setMode('major')}
                    disabled={mode === 'major'}
                    className={'bg-neutral-100 ml-3'}
                >
                    Major
                </Button>
                <Button
                    onClick={() => setMode('minor')}
                    disabled={mode === 'minor'}
                    className={'bg-neutral-100 ml-3'}
                >
                    Minor
                </Button>
            </div>
            <h2>
                Transpose a full major or minor scale from a transposing
                instrument's key to another:
            </h2>
            <div className="simple-transposition__origin-key-select w-full">
                origin key:
                <NoteSelector
                    selected={selectedOriginKey}
                    setSelected={setSelectedOriginKey}
                    selectedNotation={selectedNotation}
                />
            </div>
            <div className="simple-transposition__note-select w-full">
                scale:
                <NoteSelector
                    selected={selectedNote}
                    setSelected={setSelectedNote}
                    selectedNotation={selectedNotation}
                    usedScale={mode === 'major' ? MAJOR_SCALES : MINOR_SCALES}
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

export default ScaleTransposition;
