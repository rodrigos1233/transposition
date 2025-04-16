
import { Note } from '../../utils/notes';
import './staff.css';

import NoteSimple from './../../assets/images/note_simple.png';
import Flat from './../../assets/images/flat.png';
import Sharp from './../../assets/images/sharp.png';
import DoubleFlat from './../../assets/images/double_flat.png';
import DoubleSharp from './../../assets/images/double_sharp.png';
import { NoteInScale } from '../../utils/scaleBuilder';

type MusicalCharacterProps = {
    position: number;
    characterType: 'note' | 'flat' | 'sharp' | 'doubleFlat' | 'doubleSharp';
    accidental?: 'flat' | 'sharp' | 'doubleFlat' | 'doubleSharp' | null;
    noteInScale?: NoteInScale;
    selectedNotation?: keyof Note;
    colour?: 'lime' | 'red' | 'sky' | 'yellow' | 'purple' | 'black';
};

function MusicalCharacter({
    position,
    characterType,
    noteInScale,
    selectedNotation,
    colour,
    accidental,
}: MusicalCharacterProps) {
    const MusicalCharacters = {
        note: NoteSimple,
        flat: Flat,
        sharp: Sharp,
        doubleFlat: DoubleFlat,
        doubleSharp: DoubleSharp,
    };

    const MusicalCharactersHeights = {
        note: 43.25,
        flat: 25,
        sharp: 25,
        doubleFlat: 25,
        doubleSharp: 12,
    };

    const MusicalCharactersWidths = {
        note: 15,
        flat: 9.03,
        sharp: 9.16,
        doubleFlat: 15.46,
        doubleSharp: 12,
    };

    const MusicalCharactersVerticalOffsets = {
        note: 44,
        flat: 44,
        sharp: 38,
        doubleFlat: 44,
        doubleSharp: 44.4,
    };

    function additionalLinesNeeded(position: number): [number, boolean] {
        if (position < 1) {
            const count = Math.floor(Math.abs(position) / 2) + 1;
            const isOnLine = Math.abs(position) % 2 === 0;
            return [count, isOnLine];
        }

        if (position > 11) {
            const count = Math.ceil((position - 11) / 2);
            const isOnLine = Math.abs(position) % 2 === 0;
            return [count, isOnLine];
        }

        return [0, false];
    }

    const [linesNeeded, isOnLine] = additionalLinesNeeded(position);

    const pixelPosition = (position - 2) * (50 / 8) - 50;

    function additionalLinesPosition() {
        if (position < 1) {
            if (isOnLine) {
                return -linesNeeded * 12.5 + 11.75;
            }

            return -linesNeeded * 12.5 + 5.5;
        }

        if (isOnLine) {
            return -1; // Adjust this offset for on-line positioning above
        }

        return -1 + 6.25;
    }

    const colourClasses = {
        lime: `border-lime-300 border-b-2`,
        red: `border-red-300 border-b-2`,
        sky: `border-sky-300 border-b-2`,
        yellow: `border-yellow-300 border-b-2`,
        purple: `border-purple-400 border-b-2`,
        black: '',
    };

    return (
        <div className="musical-character-container">
            <div
                className="musical-character"
                style={{
                    bottom: pixelPosition,
                    width: `${MusicalCharactersWidths[characterType]}px`,
                }}
            >
                <div
                    className="position-indicator"
                    style={{
                        backgroundColor: '#ff0000',
                        height: '0.1px',
                        width: '10px',
                        display: 'none',
                    }}
                ></div>

                {linesNeeded > 0 && (
                    <div
                        className="additional-lines-container"
                        style={{
                            position: 'absolute',
                            right: '-5px',
                            top: `${additionalLinesPosition()}px`,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '10.5px',
                        }}
                    >
                        {new Array(linesNeeded).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className="additional-line"
                                style={{
                                    height: `0px`,
                                    borderTop: `1px solid #000`,
                                    borderBottom: `1px solid #000`,
                                    width: `25px`,
                                    bottom: `${MusicalCharactersVerticalOffsets[characterType]}px`,
                                    backgroundColor: 'rgb(0,0,0)',
                                }}
                            />
                        ))}
                    </div>
                )}
                {characterType !== 'note' && (
                    <img
                        src={MusicalCharacters[characterType]}
                        style={{
                            height: `${MusicalCharactersHeights[characterType]}px`,
                            width: `${MusicalCharactersWidths[characterType]}px`,
                            bottom: `${MusicalCharactersVerticalOffsets[characterType]}px`,
                        }}
                        alt="treble clef"
                    />
                )}

                {characterType === 'note' && (
                    <>
                        <div className="note">
                            <div className={`note__dot`} />
                            <div
                                className={`note__line ${
                                    position > 5 ? 'note__line--reversed' : ''
                                }`}
                            />
                            {accidental && (
                                <div className={`note__accidental`}>
                                    <img
                                        src={MusicalCharacters[accidental]}
                                        style={{
                                            height: `${MusicalCharactersHeights[accidental]}px`,
                                            width: `${MusicalCharactersWidths[accidental]}px`,
                                            bottom: `${MusicalCharactersVerticalOffsets[accidental]}px`,
                                        }}
                                        alt={accidental}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div
                className="musical-character__text"
                style={{
                    top: `${
                        position < -1
                            ? `calc(71px + ${(Math.abs(position) - 1) * 6}px)`
                            : `70px`
                    }`,
                }}
            >
                {noteInScale && selectedNotation && (
                    <p className={colourClasses[colour ?? 'black']}>
                        {noteInScale.note[selectedNotation]}
                    </p>
                )}
            </div>
        </div>
    );
}

export default MusicalCharacter;
