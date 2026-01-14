import { Fragment, useContext, useEffect, useState } from 'react';
import type { JSX } from 'react';

import './circleOfFifth.css';
import Staff from '../staff';
import {
  getKeySignaturesForPositionInCircleOfFifth,
  positionInCircleOfFifthDeterminer,
  startNotesFromCirclePosition,
} from '../../utils/scaleBuilder';
import { getNote, SCALES } from '../../utils/notes';
import { getModeName, MODES } from '../../utils/modes';
import Text from '../../components/text';
import Button from '../button';
import LanguageContext from '../../contexts/LanguageContext';
import NotationContext from '../../contexts/NotationContext';

type CircleOfFifthProps = {
  modeIndex: number;
  selectedStartNote?: number;
  targetNote?: number;
  setSelectedMode: (mode: number) => void;
  showAdditionalModes: boolean;
  selectedOriginKey: number;
  selectedTargetKey: number;
};

function CircleOfFifth({
  modeIndex,
  selectedStartNote,
  targetNote,
  setSelectedMode,
  showAdditionalModes,
  selectedOriginKey,
  selectedTargetKey,
}: CircleOfFifthProps): JSX.Element {
  const { selectedNotation } = useContext(NotationContext);
  const circlePositions = new Array(12).fill(0).map((_, i) => {
    const keySignatures = getKeySignaturesForPositionInCircleOfFifth(
      i,
      modeIndex
    );
    const angle = i * 30;
    return { angle, keySignatures };
  });

  const languageContext = useContext(LanguageContext);
  const selectedLanguage = languageContext.selectedLanguage;

  const [positions, setPositions] = useState({
    start: 0,
    target: 0,
  });

  const modeText = getModeName(modeIndex, selectedLanguage);

  useEffect(() => {
    const calculateSmallestIntervalPosition = (
      current: number,
      newPos: number
    ) => {
      const difference = newPos - current;
      return difference > 6 ? difference - 12 : difference;
    };

    setPositions((prevPositions) => {
      const newStartNotePosition = calculateSmallestIntervalPosition(
        prevPositions.start,
        positionInCircleOfFifthDeterminer(selectedStartNote ?? 0, modeIndex)
      );

      const newTargetNotePosition = calculateSmallestIntervalPosition(
        prevPositions.target,
        positionInCircleOfFifthDeterminer(targetNote ?? 0, modeIndex)
      );

      return {
        start: prevPositions.start + newStartNotePosition,
        target: prevPositions.target + newTargetNotePosition,
      };
    });
  }, [
    selectedStartNote,
    targetNote,
    modeIndex,
    selectedOriginKey,
    selectedTargetKey,
  ]);

  function handleModeClick() {
    const modeLimit = showAdditionalModes ? 6 : 1;

    if (modeIndex + 1 > modeLimit) {
      setSelectedMode(0);
      return;
    }

    setSelectedMode(modeIndex + 1);
    return;
  }

  return (
    <div className="circle-of-fifth pb-10">
      <div className="circle-center__controls">
        <Button onClick={handleModeClick}>{modeText}</Button>
      </div>
      <div className="circle-of-fifth__circle">
        {circlePositions.map(({ angle }, i) => (
          <Fragment key={`outer-${i}`}>
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
                {circlePositions[i].keySignatures.map((scale, k) => (
                  <Staff key={k} displayedNotes={[]} musicalKey={scale} />
                ))}
              </div>
            </div>
          </Fragment>
        ))}
        {circlePositions.map(({ angle }, i) => {
          const possibleStartNotes = startNotesFromCirclePosition(i, 0);

          const notesText = possibleStartNotes.map((startNote, i) => {
            const startNoteName = getNote(startNote, selectedNotation, SCALES);

            return (
              <Fragment key={i}>
                <span
                  className={
                    startNote === selectedStartNote
                      ? 'border-b-4 border-purple-400'
                      : startNote === targetNote
                        ? 'border-b-4 border-amber-400'
                        : ''
                  }
                >
                  {startNoteName}
                </span>
                {i < possibleStartNotes.length - 1 && ' / '}
              </Fragment>
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
            <div
              key={`inner-${i}`}
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
                  <Text size={'small'} style={{ whiteSpace: 'nowrap' }}>
                    {text}
                  </Text>
                </p>
              </div>
            </div>
          );
        })}
        <div className="circle-center">
          <div className="circle-center__hands">
            <div
              className="circle-center__hand circle-center__hand--target"
              style={{
                transform: `rotate(${(positions.target ?? 0) * 30}deg)`,
              }}
            />
            <div
              className="circle-center__hand circle-center__hand--origin"
              style={{
                transform: `rotate(${(positions.start ?? 0) * 30}deg)`,
              }}
            />
          </div>
          <div className="circle-center__content"></div>
        </div>
      </div>
    </div>
  );
}

export default CircleOfFifth;
