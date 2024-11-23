import React, { useEffect, useState } from 'react';

import './circleOfFifth.css';
import Staff from '../staff';
import {
    getKeySignaturesForPositionInCircleOfFifth,
    startNotesFromCirclePosition,
} from '../../utils/scaleBuilder';
import { getNote, Note, SCALES } from '../../utils/notes';
import { getModeName, MODES } from '../../utils/modes';
import Text from '../../components/text';
import { Language } from '../../hooks/useTranslation';
import {
    enharmonicGroupTransposer,
    enharmonicGroupTransposerReverse,
} from '../../utils/transposer';

type CircleOfFifthProps = {
    modeIndex: number;
    selectedNotation: keyof Note;
    selectedLanguage: Language;
    selectedStartNote?: number;
    targetNote?: number;
};

function CircleOfFifth({
    modeIndex,
    selectedNotation,
    selectedLanguage,
    selectedStartNote,
    targetNote,
}: CircleOfFifthProps): JSX.Element {
    const circlePositions = new Array(12).fill(0).map((_, i) => {
        const keySignatures = getKeySignaturesForPositionInCircleOfFifth(
            i,
            modeIndex
        );
        const angle = i * 30;
        return { angle, keySignatures };
    });

    const modeText = getModeName(modeIndex, selectedLanguage);

    let selectedStartNoteIndex = undefined;

    if (selectedStartNote) {
        selectedStartNoteIndex = enharmonicGroupTransposer(selectedStartNote);
    }

    return (
        <div className="circle-of-fifth">
            {circlePositions.map(({ angle }, i) => (
                <>
                    <div
                        className="circle-outer"
                        style={{
                            transform: `rotate(${angle}deg)`,
                            filter: `${i % 2 === 0 ? 'brightness(1.07)' : ''}`,
                        }}
                    ></div>
                    <div
                        className="circle-outer__content-container"
                        style={{ transform: `rotate(${angle}deg)` }}
                    >
                        <div
                            className="circle-outer__content"
                            style={{ transform: `rotate(-${angle}deg)` }}
                        >
                            {circlePositions[i].keySignatures.map(
                                (scale, k) => (
                                    <Staff
                                        key={k}
                                        displayedNotes={[]}
                                        musicalKey={scale}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </>
            ))}
            {circlePositions.map(({ angle }, i) => {
                const possibleStartNotes = startNotesFromCirclePosition(i, 0);

                const notesText = possibleStartNotes.map((startNote, i) => {
                    const startNoteName = getNote(
                        startNote,
                        selectedNotation,
                        SCALES
                    );
                    console.log({
                        isStart: startNote === selectedStartNote,
                        isTarget: startNote === targetNote,
                        startNote,
                        targetNote,
                        selectedStartNote,
                    });
                    return (
                        <React.Fragment key={i}>
                            <span
                                className={
                                    startNote === selectedStartNote
                                        ? 'border-b-4 border-purple-400'
                                        : startNote === targetNote
                                        ? 'border-b-4 border-yellow-400'
                                        : ''
                                }
                            >
                                {startNoteName}
                            </span>
                            {i < possibleStartNotes.length - 1 && ' / '}
                        </React.Fragment>
                    );
                });

                const text = <>{notesText}</>;

                const modeRotation = MODES[modeIndex].modePosition * 30;

                let totalAngle = angle + modeRotation;

                if (totalAngle > 360) {
                    totalAngle -= 360;
                }

                if (totalAngle < 0) {
                    totalAngle += 360;
                }

                return (
                    <>
                        <div
                            className="circle-inner__content-container"
                            style={{
                                transform: `rotate(${angle + modeRotation}deg)`,
                                transition: 'all ease 0.5s',
                            }}
                        >
                            <div
                                className="circle-inner__content"
                                style={{
                                    transform: `rotate(-${totalAngle}deg)`,
                                    transition: 'all ease 0.5s',
                                }}
                            >
                                <p className="text-nowrap">
                                    <Text
                                        size={'small'}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {text}
                                    </Text>
                                </p>
                            </div>
                        </div>
                    </>
                );
            })}
            <div className="circle-center">
                <div className="circle-center__content">
                    <p>
                        <Text noWrap size={'small'}>
                            {modeText}
                        </Text>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CircleOfFifth;
