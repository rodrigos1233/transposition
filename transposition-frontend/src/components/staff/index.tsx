import React, { useContext } from 'react';
import { Note } from '../../utils/notes';
import './staff.css';
import { Key, NoteInScale } from '../../utils/scaleBuilder';
import NotationContext from '../../contexts/NotationContext';
import VexflowStaff from './vexflowStaff';

type StaffProps = {
  displayedNotes: number[];
  correspondingNotes?: NoteInScale[];
  musicalKey: Key;
  selectedNotation?: keyof Note;
  text?: React.ReactNode;
  colour?: 'sky' | 'emerald' | 'amber' | 'red' | 'purple';
  noteColour?: 'emerald' | 'red' | 'sky' | 'amber' | 'purple';
  accidentals?: ('sharp' | 'flat' | 'doubleSharp' | 'doubleFlat' | null)[];
  activeNoteIndex?: number | null;
};

function Staff({
  displayedNotes,
  musicalKey,
  correspondingNotes,
  text,
  colour,
  noteColour,
  accidentals,
  activeNoteIndex,
}: StaffProps) {
  useContext(NotationContext);

  const colourClasses = {
    emerald: 'border-l-emerald-500 border-l-4',
    red: 'border-l-red-400 border-l-4',
    sky: 'border-l-sky-400 border-l-4',
    amber: 'border-l-amber-400 border-l-4',
    black: 'border-l-neutral-400 border-l-2',
    purple: 'border-l-purple-400 border-l-4',
  };

  return (
    <div className="staff flex-grow">
      <div className="staff__text">
        <p className="staff__text__title">{text}</p>
      </div>
      <div
        className={`staff__vexflow-container ${colourClasses[colour ?? 'black']}`}
      >
        <VexflowStaff
          displayedNotes={displayedNotes}
          correspondingNotes={correspondingNotes}
          musicalKey={musicalKey}
          noteColour={noteColour}
          accidentals={accidentals}
          activeNoteIndex={activeNoteIndex}
        />
      </div>
    </div>
  );
}

export default Staff;
