import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

import './circleOfFifth.css';
import CompactKeySignature, { getDefaultActiveIndex } from './CompactKeySignature';
import {
  getKeySignaturesForPositionInCircleOfFifth,
  positionInCircleOfFifthDeterminer,
  startNotesFromCirclePosition,
} from '../../utils/scaleBuilder';
import { enharmonicGroupTransposer } from '../../utils/transposer';
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
  onChangeScale?: (scaleIndex: number) => void;
  onChangeToKey?: (toKey: number) => void;
};

function CircleOfFifth({
  modeIndex,
  selectedStartNote,
  targetNote,
  setSelectedMode,
  showAdditionalModes,
  selectedOriginKey,
  selectedTargetKey,
  onChangeScale,
  onChangeToKey,
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

  // Track which enharmonic is active per circle position
  const [activeEnharmonics, setActiveEnharmonics] = useState<
    Record<number, number>
  >({});

  // Reset enharmonic selections when mode changes
  useEffect(() => {
    setActiveEnharmonics({});
  }, [modeIndex]);

  function getActiveIndex(positionIndex: number): number {
    if (positionIndex in activeEnharmonics) {
      return activeEnharmonics[positionIndex];
    }
    return getDefaultActiveIndex(
      circlePositions[positionIndex].keySignatures
    );
  }

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

  // --- Segment click handler ---
  function handleSegmentClick(circlePosition: number) {
    if (!onChangeScale) return;
    const possibleNotes = startNotesFromCirclePosition(circlePosition, modeIndex);
    if (possibleNotes.length === 0) return;
    // Use the active enharmonic index for this position
    const activeIdx = getActiveIndex(circlePosition);
    const scaleIndex = possibleNotes[Math.min(activeIdx, possibleNotes.length - 1)];
    onChangeScale(scaleIndex);
  }

  // --- Hand drag logic ---
  const circleRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<'origin' | 'target' | null>(null);
  const lastDragPositionRef = useRef<number>(-1);

  const angleToCirclePosition = useCallback((angle: number): number => {
    // Normalize to 0-360
    const normalized = ((angle % 360) + 360) % 360;
    // Each position = 30 degrees, offset by 15 so 0deg = position 0
    return Math.round(normalized / 30) % 12;
  }, []);

  const handlePointerDown = useCallback(
    (hand: 'origin' | 'target', e: React.PointerEvent) => {
      if (hand === 'origin' && !onChangeScale) return;
      if (hand === 'target' && !onChangeToKey) return;
      draggingRef.current = hand;
      lastDragPositionRef.current = -1;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    },
    [onChangeScale, onChangeToKey]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current || !circleRef.current) return;

      const rect = circleRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = Math.atan2(dx, -dy) * (180 / Math.PI); // 0 = up, clockwise
      const circlePos = angleToCirclePosition(angle);

      if (circlePos === lastDragPositionRef.current) return;
      lastDragPositionRef.current = circlePos;

      if (draggingRef.current === 'origin') {
        handleSegmentClick(circlePos);
      } else if (draggingRef.current === 'target' && onChangeToKey && selectedStartNote !== undefined) {
        // Compute new toKey from desired target circle position
        const possibleTargetNotes = startNotesFromCirclePosition(circlePos, modeIndex);
        if (possibleTargetNotes.length === 0) return;
        const activeIdx = getActiveIndex(circlePos);
        const desiredTargetScaleIndex = possibleTargetNotes[Math.min(activeIdx, possibleTargetNotes.length - 1)];
        const desiredTargetChromatic = enharmonicGroupTransposer(desiredTargetScaleIndex);
        const originChromatic = enharmonicGroupTransposer(selectedStartNote);
        const newToKey = ((originChromatic + selectedOriginKey - desiredTargetChromatic) % 12 + 12) % 12;
        onChangeToKey(newToKey);
      }
    },
    [angleToCirclePosition, onChangeToKey, onChangeScale, selectedStartNote, selectedOriginKey, modeIndex, activeEnharmonics] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (draggingRef.current) {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        draggingRef.current = null;
      }
    },
    []
  );

  // Compute active segment positions for highlighting
  const activeOrigin = ((Math.round(positions.start) % 12) + 12) % 12;
  const activeTarget = ((Math.round(positions.target) % 12) + 12) % 12;
  const handsOverlap = activeOrigin === activeTarget;

  return (
    <div className="circle-of-fifth pb-10">
      <div className="circle-center__controls">
        <Button onClick={handleModeClick}>{modeText}</Button>
      </div>
      <div className="circle-of-fifth__circle" ref={circleRef}>
        {/* Segment divider lines */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={`divider-${i}`}
            className="circle-divider"
            style={{ transform: `rotate(${i * 30 - 15}deg)` }}
          />
        ))}
        {circlePositions.map(({ angle }, i) => {
          return (
            <Fragment key={`outer-${i}`}>
              <div
                className="circle-outer"
                style={{
                  transform: `rotate(${angle}deg)`,
                  background: i === activeOrigin && i === activeTarget
                    ? `conic-gradient(from -15deg, rgba(100, 160, 255, 0.18) 30deg, transparent 0%)`
                    : i === activeOrigin
                    ? `conic-gradient(from -15deg, rgba(80, 150, 240, 0.15) 30deg, transparent 0%)`
                    : i === activeTarget
                    ? `conic-gradient(from -15deg, rgba(220, 100, 140, 0.12) 30deg, transparent 0%)`
                    : i % 2 === 0
                      ? `conic-gradient(from -15deg, rgba(0, 0, 0, 0.03) 30deg, transparent 0%)`
                      : undefined,
                  cursor: onChangeScale ? 'pointer' : undefined,
                }}
                onClick={() => handleSegmentClick(i)}
              ></div>
              <div
                className="circle-outer__content-container"
                style={{ transform: `rotate(${angle}deg)` }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="circle-outer__content"
                  style={{ transform: `rotate(-${angle}deg)` }}
                >
                  <CompactKeySignature
                    keys={circlePositions[i].keySignatures}
                    activeIndex={getActiveIndex(i)}
                    onToggle={() => {
                      const keys = circlePositions[i].keySignatures;
                      setActiveEnharmonics((prev) => ({
                        ...prev,
                        [i]: ((getActiveIndex(i) + 1) % keys.length),
                      }));
                    }}
                  />
                </div>
              </div>
            </Fragment>
          );
        })}
        {circlePositions.map(({ angle }, i) => {
          const possibleStartNotes = startNotesFromCirclePosition(i, 0);
          // Inner ring position i is rotated by modePosition, so it aligns
          // with a different outer ring position when mode != major
          const modeOffset = MODES[modeIndex].modePosition;
          const outerIdx = ((i + modeOffset) % 12 + 12) % 12;
          const hasMultipleKeys =
            circlePositions[outerIdx].keySignatures.length > 1;
          const activeIdx = getActiveIndex(outerIdx);

          const notesText = possibleStartNotes.map((startNote, noteIdx) => {
            const startNoteName = getNote(startNote, selectedNotation, SCALES);
            const isActiveEnharmonic = !hasMultipleKeys || noteIdx === activeIdx;

            return (
              <Fragment key={noteIdx}>
                <span
                  className={
                    startNote === selectedStartNote
                      ? 'border-b-4 border-purple-400'
                      : startNote === targetNote
                        ? 'border-b-4 border-amber-400'
                        : ''
                  }
                  style={{ opacity: isActiveEnharmonic ? 1 : 0.4 }}
                >
                  {startNoteName}
                </span>
                {noteIdx < possibleStartNotes.length - 1 && ' / '}
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
                cursor: onChangeToKey ? (draggingRef.current === 'target' ? 'grabbing' : 'grab') : undefined,
                touchAction: 'none',
              }}
              onPointerDown={(e) => handlePointerDown('target', e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
            <div
              className="circle-center__hand circle-center__hand--origin"
              style={{
                transform: `rotate(${(positions.start ?? 0) * 30}deg)`,
                cursor: onChangeScale && !handsOverlap ? (draggingRef.current === 'origin' ? 'grabbing' : 'grab') : undefined,
                touchAction: 'none',
                pointerEvents: handsOverlap ? 'none' : undefined,
              }}
              onPointerDown={(e) => handlePointerDown('origin', e)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          </div>
          <div className="circle-center__content"></div>
        </div>
      </div>
    </div>
  );
}

export default CircleOfFifth;
