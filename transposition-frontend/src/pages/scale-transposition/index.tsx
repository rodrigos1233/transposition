import { useContext, useEffect, useState } from 'react';
import {
  getNote,
  INSTRUMENTS_PITCHES,
  Note,
  SCALES,
} from '../../utils/notes';
import {
  enharmonicGroupTransposer,
  scaleCrossInstrumentsTransposer,
  scaleTransposer,
} from '../../utils/transposer';
import { scaleBuilder } from '../../utils/scaleBuilder';
import { getModeName } from '../../utils/modes';
import { getIntervalName } from '../../utils/intervals';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';

import NoteSelector from '../../components/note-selector';
import ModeSelector from '../../components/mode-selector';
import IntervalSelector from '../../components/interval-selector';
import SelectComponent, { OptionType } from '../../components/select';
import StepperStep from '../../components/stepper/StepperStep';
import LiveSummaryBar from '../../components/live-summary-bar';
import TransposeMethodToggle from '../../components/transpose-method-toggle';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';

import LanguageContext from '../../contexts/LanguageContext';
import NotationContext from '../../contexts/NotationContext';
import { SingleValue } from 'react-select';
import { LIST_OF_INSTRUMENTS } from '../../utils/instruments';

import ScaleTranspositionResults from './ScaleTranspositionResults';

function validateParam(
  value: string | null,
  max: number,
  fallback = 0
): number {
  if (value === null) return fallback;
  const numValue = Number(value);
  return !isNaN(numValue) && numValue >= 0 && numValue <= max
    ? numValue
    : fallback;
}

function ScaleTranspositionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const { selectedNotation } = useContext(NotationContext);
  const { selectedLanguage } = useContext(LanguageContext);
  const isMobile = useIsMobile();

  // --- Read state from URL ---
  const fromKey = validateParam(searchParams.get('from_key'), 11);
  const scale = validateParam(searchParams.get('scale'), 16);
  const mode = validateParam(searchParams.get('mode'), 6);
  const toKey = validateParam(searchParams.get('to_key'), 11);
  const method: 'key' | 'interval' =
    searchParams.get('method') === 'interval' ? 'interval' : 'key';
  const interval = validateParam(searchParams.get('interval'), 12);
  const direction: 'up' | 'down' =
    searchParams.get('direction') === 'down' ? 'down' : 'up';

  // --- Stepper UI state ---
  const isFullUrl =
    searchParams.has('from_key') &&
    searchParams.has('scale') &&
    (method === 'interval'
      ? searchParams.has('interval')
      : searchParams.has('to_key'));
  const [activeStep, setActiveStep] = useState<number | null>(
    isFullUrl ? null : 1
  );
  const [showAdditionalModes, setShowAdditionalModes] = useState(mode > 1);

  // --- Instrument dropdown state ---
  const [selectedOriginOption, setSelectedOriginOption] =
    useState<SingleValue<OptionType>>(null);
  const [selectedTargetOption, setSelectedTargetOption] =
    useState<SingleValue<OptionType>>(null);

  // --- URL update helper ---
  function updateUrl(overrides: Record<string, string | number>) {
    const params = new URLSearchParams();
    const merged = {
      from_key: fromKey,
      scale: scale,
      mode: mode,
      to_key: toKey,
      method: method,
      interval: interval,
      direction: direction,
      ...overrides,
    };

    params.set('from_key', String(merged.from_key));
    params.set('scale', String(merged.scale));
    params.set('mode', String(merged.mode));

    if (merged.method === 'interval') {
      params.set('method', 'interval');
      params.set('interval', String(merged.interval));
      params.set('direction', String(merged.direction));
    } else {
      params.set('to_key', String(merged.to_key));
    }

    setSearchParams(params, { replace: true });
  }

  // --- Change handlers ---
  function handleChangeFromKey(newKey: number) {
    setSelectedOriginOption(null);
    updateUrl({ from_key: newKey });
  }

  function handleChangeScale(newScale: number) {
    updateUrl({ scale: newScale });
  }

  function handleChangeMode(newMode: number) {
    updateUrl({ mode: newMode });
  }

  function handleChangeToKey(newKey: number) {
    setSelectedTargetOption(null);
    updateUrl({ to_key: newKey });
  }

  function handleChangeMethod(newMethod: 'key' | 'interval') {
    updateUrl({ method: newMethod });
    // If switching to interval mode and on an instrument step, return to step 1
    if (newMethod === 'interval' && activeStep !== null && activeStep > 1) {
      setActiveStep(1);
    }
  }

  function handleChangeInterval(newInterval: number) {
    updateUrl({ interval: newInterval });
  }

  function handleChangeDirection(newDirection: 'up' | 'down') {
    updateUrl({ direction: newDirection });
  }

  // --- Stepper navigation ---
  // Key mode:      Step 1 (scale) → Step 2 (origin instrument) → Step 3 (target instrument) → Results
  // Interval mode: Step 1 (scale) → Step 2 (interval selection) → Results
  function handleContinueStep(stepNumber: number) {
    if (stepNumber === 1) {
      setActiveStep(2);
    } else if (stepNumber === 2) {
      if (method === 'interval') {
        setActiveStep(null); // Show results
      } else {
        setActiveStep(3);
      }
    } else if (stepNumber === 3) {
      setActiveStep(null); // Show results
    }
  }

  function handleEditStep(stepNumber: number) {
    setActiveStep(stepNumber);
  }

  // --- Completion state ---
  const step1Completed = activeStep === null || activeStep > 1;
  const step2Completed = activeStep === null || activeStep > 2;
  const step3Completed = activeStep === null || activeStep > 3;
  const showResults =
    method === 'interval' ? step2Completed : step3Completed;

  // --- Transposition computation ---
  const targetNote =
    method === 'key'
      ? scaleCrossInstrumentsTransposer(scale, fromKey, toKey, mode)
      : scaleTransposer(scale, interval, mode, direction);

  const originScale = scaleBuilder(scale, mode);
  const transposedScale = scaleBuilder(targetNote, mode);

  // For interval mode: compute a derived target key for display purposes
  const intervalTargetKey = (() => {
    if (method !== 'interval') return toKey;
    let tk = enharmonicGroupTransposer(scale);
    if (direction === 'down') {
      tk -= interval;
    } else {
      tk += interval;
    }
    return ((tk % 12) + 12) % 12;
  })();

  // For interval mode: handle octave wrapping of displayed notes on staff
  const displayedNotes =
    method === 'interval'
      ? originScale.reducedNotes.map((note, i) => {
          if (direction === 'up') {
            if (
              originScale.reducedNotes[i] >
              transposedScale.reducedNotes[i]
            ) {
              return {
                origin: note,
                target: transposedScale.reducedNotes[i] + 7,
              };
            }
            if (interval === 12) {
              return {
                origin: note,
                target: transposedScale.reducedNotes[i] + 7,
              };
            }
          }
          if (direction === 'down') {
            if (
              originScale.reducedNotes[i] <
              transposedScale.reducedNotes[i]
            ) {
              return {
                origin: note,
                target: transposedScale.reducedNotes[i] - 7,
              };
            }
            if (interval === 12) {
              return {
                origin: note,
                target: transposedScale.reducedNotes[i] - 7,
              };
            }
          }
          return {
            origin: note,
            target: transposedScale.reducedNotes[i],
          };
        })
      : null;

  const displayedOriginNotes = displayedNotes
    ? displayedNotes.map((n) => n.origin)
    : originScale.reducedNotes;
  const displayedTargetNotes = displayedNotes
    ? displayedNotes.map((n) => n.target)
    : transposedScale.reducedNotes;

  // --- Note strings ---
  const notesSuite = originScale.notesInScale
    .map((n) => n.note[selectedNotation])
    .join(', ');
  const transposedNotesSuite = transposedScale.notesInScale
    .map((n) => n.note[selectedNotation])
    .join(', ');
  const modeText = getModeName(mode, selectedLanguage);

  // --- Instrument dropdown options ---
  const listOfInstruments = LIST_OF_INSTRUMENTS[selectedLanguage];

  const selectOptions: OptionType[] = INSTRUMENTS_PITCHES.flatMap(
    (pitch, index) => {
      const instruments = listOfInstruments?.[index] as string[] | undefined;
      const pitchName = pitch[selectedNotation];
      return instruments
        ? instruments.map((instrument) => ({
            label: `${pitchName} | ${instrument}`,
            value: `${pitchName}_${instrument}`.replace(/\s/g, '_'),
          }))
        : [];
    }
  ).sort((a, b) => {
    const nameA = a.label.split('|')[1].trim();
    const nameB = b.label.split('|')[1].trim();
    return nameA.localeCompare(nameB);
  });

  function getInstrumentKey(value: string, notation: keyof Note): number {
    const trimmedValue = value.trim();
    return INSTRUMENTS_PITCHES.findIndex((note) => {
      const parts = note[notation].split(' / ').map((part) => part.trim());
      return parts.includes(trimmedValue);
    });
  }

  function handleOriginInstrumentChange(option: SingleValue<OptionType>) {
    if (option) {
      setSelectedOriginOption(option);
      const [pitch] = option.value.split('_');
      const instrumentKey = getInstrumentKey(pitch, selectedNotation);
      if (!isNaN(instrumentKey) && instrumentKey >= 0) {
        updateUrl({ from_key: instrumentKey });
      }
    }
  }

  function handleTargetInstrumentChange(option: SingleValue<OptionType>) {
    if (option) {
      setSelectedTargetOption(option);
      const [pitch] = option.value.split('_');
      const instrumentKey = getInstrumentKey(pitch, selectedNotation);
      if (!isNaN(instrumentKey) && instrumentKey >= 0) {
        updateUrl({ to_key: instrumentKey });
      }
    }
  }

  // --- Summaries ---
  const originInstrumentName = selectedOriginOption
    ? selectedOriginOption.label.split('|')[1]?.trim()
    : undefined;
  const targetInstrumentName = selectedTargetOption
    ? selectedTargetOption.label.split('|')[1]?.trim()
    : undefined;

  // Step 1 summary: scale + mode
  const scaleSummary = `${getNote(scale, selectedNotation, SCALES)} ${modeText}`;

  // Step 2 summary for interval mode
  const intervalSummary = `${direction === 'up' ? '+' : '-'}${getIntervalName(interval, selectedLanguage)}`;

  // Steps 2 & 3 summaries for key mode: instrument selections
  const originInstrumentSummary = originInstrumentName
    ? `${originInstrumentName} \u2014 ${getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES)}`
    : getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES);

  const targetInstrumentSummary = targetInstrumentName
    ? `${targetInstrumentName} \u2014 ${getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES)}`
    : getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES);

  // --- Page title ---
  const pageTitle =
    method === 'key'
      ? `${getNote(scale, selectedNotation, SCALES)} ${modeText} ${getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES)} \u2192 ${getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES)} | Scale Transposition`
      : `${getNote(scale, selectedNotation, SCALES)} ${modeText} ${direction === 'up' ? '+' : '-'}${getIntervalName(interval, selectedLanguage)} | Scale Transposition`;

  useChangePageTitle(pageTitle);

  // Ensure URL has at least the defaults when there are no params
  useEffect(() => {
    if (!searchParams.has('from_key') && !searchParams.has('scale')) {
      const params = new URLSearchParams();
      params.set('from_key', '0');
      params.set('scale', '0');
      params.set('mode', '0');
      params.set('to_key', '0');
      setSearchParams(params, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showInstrumentSteps = method === 'key';

  return (
    <ContentPage>
      <LiveSummaryBar
        fromKey={fromKey}
        scale={scale}
        mode={mode}
        toKey={method === 'key' ? toKey : null}
        method={method}
        originInstrumentName={originInstrumentName}
        targetInstrumentName={targetInstrumentName}
      />

      <ContentCard>
        {/* Step 1: What to Transpose (scale + mode + method toggle) */}
        <StepperStep
          stepNumber={1}
          title={t('stepper.step2Title')}
          summary={scaleSummary}
          isActive={activeStep === 1}
          isCompleted={step1Completed}
          isDisabled={false}
          onEdit={() => handleEditStep(1)}
          onContinue={() => handleContinueStep(1)}
        >
          <ContentCard level={2}>
            <TransposeMethodToggle
              method={method}
              onChange={handleChangeMethod}
            />
            <ModeSelector
              selectedMode={mode}
              handleChangeMode={handleChangeMode}
              showAdditionalModes={showAdditionalModes}
              setShowAdditionalModes={setShowAdditionalModes}
            />
            <div className="w-full mt-3">
              <NoteSelector
                selected={scale}
                setSelected={handleChangeScale}
                usedScale={SCALES}
                blackNotesAreHalf={true}
                colour="purple"
              />
            </div>
          </ContentCard>
        </StepperStep>

        {/* Step 2 (interval mode): Interval Selection */}
        {method === 'interval' && (
          <StepperStep
            stepNumber={2}
            title={t('stepper.intervalStepTitle')}
            summary={intervalSummary}
            isActive={activeStep === 2}
            isCompleted={step2Completed}
            isDisabled={!step1Completed}
            isLast={true}
            onEdit={() => handleEditStep(2)}
            onContinue={() => handleContinueStep(2)}
          >
            <ContentCard level={2}>
              <IntervalSelector
                selectedInterval={interval}
                handleChangeInterval={handleChangeInterval}
                selectedDirection={direction}
                setSelectedDirection={handleChangeDirection}
              />
            </ContentCard>
          </StepperStep>
        )}

        {/* Step 2 (key mode): Origin Instrument */}
        {showInstrumentSteps && (
          <StepperStep
            stepNumber={2}
            title={t('stepper.step1Title')}
            summary={originInstrumentSummary}
            isActive={activeStep === 2}
            isCompleted={step2Completed}
            isDisabled={!step1Completed}
            onEdit={() => handleEditStep(2)}
            onContinue={() => handleContinueStep(2)}
          >
            <ContentCard level={2}>
              <div className="w-full mb-1">
                <div className="flex items-center gap-2 mb-2">
                  <SelectComponent
                    onChange={handleOriginInstrumentChange}
                    options={selectOptions}
                    value={selectedOriginOption}
                    placeHolder={t(
                      'transposition.common.instrumentPlaceholder'
                    )}
                  />
                </div>
                <NoteSelector
                  selected={fromKey}
                  setSelected={handleChangeFromKey}
                  colour="sky"
                  usedScale={INSTRUMENTS_PITCHES}
                />
              </div>
            </ContentCard>
          </StepperStep>
        )}

        {/* Step 3 (key mode): Target Instrument */}
        {showInstrumentSteps && (
          <StepperStep
            stepNumber={3}
            title={t('stepper.step3Title')}
            summary={targetInstrumentSummary}
            isActive={activeStep === 3}
            isCompleted={step3Completed}
            isDisabled={!step2Completed}
            isLast={true}
            onEdit={() => handleEditStep(3)}
            onContinue={() => handleContinueStep(3)}
          >
            <ContentCard level={2}>
              <div className="w-full mb-1">
                <div className="flex items-center gap-2 mb-2">
                  <SelectComponent
                    onChange={handleTargetInstrumentChange}
                    options={selectOptions}
                    value={selectedTargetOption}
                    placeHolder={t(
                      'transposition.common.instrumentPlaceholder'
                    )}
                  />
                </div>
                <NoteSelector
                  selected={toKey}
                  setSelected={handleChangeToKey}
                  colour="red"
                  usedScale={INSTRUMENTS_PITCHES}
                />
              </div>
            </ContentCard>
          </StepperStep>
        )}
      </ContentCard>

      {/* Results */}
      {showResults && (
        <ScaleTranspositionResults
          method={method}
          fromKey={fromKey}
          toKey={method === 'key' ? toKey : intervalTargetKey}
          scale={scale}
          mode={mode}
          interval={interval}
          direction={direction}
          targetNote={targetNote}
          originScale={originScale}
          transposedScale={transposedScale}
          displayedOriginNotes={displayedOriginNotes}
          displayedTargetNotes={displayedTargetNotes}
          notesSuite={notesSuite}
          transposedNotesSuite={transposedNotesSuite}
          modeText={modeText}
          showAdditionalModes={showAdditionalModes}
          handleChangeMode={handleChangeMode}
          originInstrumentName={originInstrumentName}
          targetInstrumentName={targetInstrumentName}
          isMobile={isMobile}
        />
      )}
    </ContentPage>
  );
}

export default ScaleTranspositionPage;
