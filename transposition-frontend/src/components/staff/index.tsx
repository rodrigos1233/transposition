import React, { useContext } from 'react';
import { Note } from '../../utils/notes';
import './staff.css';
import TrebleClef from './../../assets/images/treble_clef.png';
import MusicalCharacter from './musicalCharacter';
import { Key, NoteInScale } from '../../utils/scaleBuilder';
import NotationContext from '../../contexts/NotationContext';

type StaffProps = {
  displayedNotes: number[];
  correspondingNotes?: NoteInScale[];
  musicalKey: Key;
  selectedNotation?: keyof Note;
  text?: React.ReactNode;
  colour?: 'sky' | 'lime' | 'yellow' | 'red' | 'purple';
  noteColour?: 'lime' | 'red' | 'sky' | 'yellow' | 'purple';
  accidentals?: ('sharp' | 'flat' | 'doubleSharp' | 'doubleFlat' | null)[];
};

function Staff({
  displayedNotes,
  musicalKey,
  correspondingNotes,
  text,
  colour,
  noteColour,
  accidentals,
}: StaffProps) {
  const doubleAlteredNotesCount = musicalKey.doubleAlteredNotes.length;
  useContext(NotationContext);

  function characterTypeDeterminer(
    k: number
  ): 'flat' | 'sharp' | 'doubleFlat' | 'doubleSharp' {
    if (k < doubleAlteredNotesCount) {
      if (musicalKey.alteration === 'flat') {
        return 'doubleFlat';
      }

      if (musicalKey.alteration === 'sharp') {
        return 'doubleSharp';
      }
    }

    return musicalKey.alteration ?? 'flat';
  }

  function signatureCharacterOffsetDeterminer(note: number) {
    if (musicalKey.alteration === 'sharp') {
      return note < 5 ? note + 7 : note;
    }

    if (musicalKey.alteration === 'flat') {
      return note < 3 ? note + 7 : note;
    }

    return note;
  }

  const colourClasses = {
    lime: 'border-l-lime-400 border-l-4',
    red: 'border-l-red-400 border-l-4',
    sky: 'border-l-sky-400 border-l-4',
    yellow: 'border-l-yellow-400 border-l-4',
    black: 'border-l-black-400 border-l-2',
    purple: 'border-l-purple-400 border-l-4',
  };

  let offset = 0;

  return (
    <div className="staff flex-grow">
      <div className="staff__text">
        <p className="staff__text__title">{text}</p>
      </div>
      <div
        className={`staff__lines ${
          colourClasses[colour ?? 'black']
        } border-l-2`}
      >
        {new Array(5).fill(0).map((_, i) => (
          <div key={i} className="staff__line" />
        ))}
      </div>
      <div className="staff__content">
        <div className="staff__content__clef">
          <img
            src={TrebleClef}
            alt="treble clef"
            className="staff__content__clef__png"
          />
        </div>
        <div className="staff__content__signature">
          {!!musicalKey.alteration &&
            musicalKey.alteredNotes
              .slice(
                0,
                musicalKey.alteredNotes.length - doubleAlteredNotesCount
              )
              .map((note, k) => (
                <MusicalCharacter
                  position={signatureCharacterOffsetDeterminer(note)}
                  characterType={characterTypeDeterminer(k)}
                  key={note}
                />
              ))}
        </div>
        <div className="staff__content__notes">
          {displayedNotes.map((note, k) => {
            if (k > 0 && displayedNotes[k - 1] > note) {
              offset += 7;
            }
            const adjustedNote = note + offset;
            return (
              <MusicalCharacter
                position={adjustedNote}
                characterType="note"
                noteInScale={correspondingNotes?.[k] ?? undefined}
                accidental={accidentals?.[k]}
                key={`${adjustedNote}-${k}`}
                colour={
                  [0, displayedNotes.length - 1].includes(k)
                    ? noteColour
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Staff;
