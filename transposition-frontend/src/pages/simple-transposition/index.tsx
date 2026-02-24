import { useContext, useEffect, useState } from 'react';
import {
  getNote,
  INSTRUMENTS_PITCHES,
  NOTES,
  Note,
} from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import {
  crossInstrumentsTransposer,
  transposer,
} from '../../utils/transposer';
import { getIntervalName, INTERVALS } from '../../utils/intervals';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';
import { useIsMobile } from '../../hooks/useIsMobile';
import LanguageContext from '../../contexts/LanguageContext';
import NotationContext from '../../contexts/NotationContext';
import { SingleValue } from 'react-select';
import SelectComponent, { OptionType } from '../../components/select';
import { LIST_OF_INSTRUMENTS } from '../../utils/instruments';
import ContentPage from '../../components/content-page';
import ContentCard from '../../components/content-card';
import StepperStep from '../../components/stepper/StepperStep';
import LiveSummaryBar from '../../components/live-summary-bar';
import TransposeMethodToggle from '../../components/transpose-method-toggle';
import IntervalSelector from '../../components/interval-selector';
import NoteTranspositionResults from './NoteTranspositionResults';
import type { TranspositionController } from './NoteTranspositionResults';

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

function NoteTranspositionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const { selectedNotation } = useContext(NotationContext);
  const { selectedLanguage } = useContext(LanguageContext);
  const isMobile = useIsMobile();

  // --- Read state from URL ---
  const fromKey = validateParam(searchParams.get('from_key'), 11);
  const note = validateParam(searchParams.get('note'), 11);
  const toKey = validateParam(searchParams.get('to_key'), 11);
  const method: 'key' | 'interval' =
    searchParams.get('method') === 'interval' ? 'interval' : 'key';
  const interval = validateParam(searchParams.get('interval'), 12);
  const direction: 'up' | 'down' =
    searchParams.get('direction') === 'down' ? 'down' : 'up';

  // --- Stepper UI state ---
  const isFullUrl =
    searchParams.has('note') &&
    (method === 'interval'
      ? searchParams.has('interval')
      : searchParams.has('from_key') && searchParams.has('to_key'));
  const [activeStep, setActiveStep] = useState<number | null>(
    isFullUrl ? null : 1
  );

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
      note: note,
      to_key: toKey,
      method: method,
      interval: interval,
      direction: direction,
      ...overrides,
    };

    params.set('note', String(merged.note));

    if (merged.method === 'interval') {
      params.set('method', 'interval');
      params.set('interval', String(merged.interval));
      params.set('direction', String(merged.direction));
    } else {
      params.set('from_key', String(merged.from_key));
      params.set('to_key', String(merged.to_key));
    }

    setSearchParams(params, { replace: true });
  }

  // --- Change handlers ---
  function handleChangeNote(newNote: number) {
    updateUrl({ note: newNote });
  }

  function handleChangeFromKey(newKey: number) {
    setSelectedOriginOption(null);
    updateUrl({ from_key: newKey });
  }

  function handleChangeToKey(newKey: number) {
    setSelectedTargetOption(null);
    updateUrl({ to_key: newKey });
  }

  function handleChangeMethod(newMethod: 'key' | 'interval') {
    updateUrl({ method: newMethod });
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
  // Key mode:      Step 1 (note) → Step 2 (origin instrument) → Step 3 (target instrument) → Results
  // Interval mode: Step 1 (note) → Step 2 (interval selection) → Results
  function handleContinueStep(stepNumber: number) {
    if (stepNumber === 1) {
      setActiveStep(2);
    } else if (stepNumber === 2) {
      if (method === 'interval') {
        setActiveStep(null);
      } else {
        setActiveStep(3);
      }
    } else if (stepNumber === 3) {
      setActiveStep(null);
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
  // Key mode
  const [, reversedEnharmonicOriginGroupNotes] = crossInstrumentsTransposer(
    note,
    fromKey,
    fromKey
  );

  const [keyTargetNote, reversedEnharmonicKeyTargetGroupNotes] =
    crossInstrumentsTransposer(note, fromKey, toKey);

  // Interval mode
  const [, reversedEnharmonicIntervalOriginGroupNotes] = transposer(
    note,
    0,
    'up'
  );

  const [intervalTargetNote, reversedEnharmonicIntervalTargetGroupNotes] =
    transposer(note, interval, direction);

  // Select the right values based on method
  const targetNote =
    method === 'key' ? keyTargetNote : intervalTargetNote;
  const originEnharmonicNotes =
    method === 'key'
      ? reversedEnharmonicOriginGroupNotes
      : reversedEnharmonicIntervalOriginGroupNotes;
  const targetEnharmonicNotes =
    method === 'key'
      ? reversedEnharmonicKeyTargetGroupNotes
      : reversedEnharmonicIntervalTargetGroupNotes;

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

  // --- Summary option lists ---
  const noteOptions: OptionType[] = NOTES.map((n, i) => ({
    label: n[selectedNotation],
    value: String(i),
  }));

  const directionOptions: OptionType[] = [
    { label: '+', value: 'up' },
    { label: '-', value: 'down' },
  ];

  const intervalOptions: OptionType[] = INTERVALS.map((_, i) => ({
    label: getIntervalName(i, selectedLanguage),
    value: String(i),
  }));

  const pitchOptions: OptionType[] = INSTRUMENTS_PITCHES.map((p, i) => ({
    label: p[selectedNotation],
    value: String(i),
  }));

  const noteSummary = (
    <span onClick={(e) => e.stopPropagation()}>
      <SelectComponent
        compact
        options={noteOptions}
        value={noteOptions[note]}
        onChange={(opt) => opt && handleChangeNote(Number(opt.value))}
      />
    </span>
  );

  const intervalSummary = (
    <span className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <SelectComponent
        compact
        options={directionOptions}
        value={directionOptions.find((o) => o.value === direction) ?? null}
        onChange={(opt) => opt && handleChangeDirection(opt.value as 'up' | 'down')}
      />
      <SelectComponent
        compact
        options={intervalOptions}
        value={intervalOptions[interval]}
        onChange={(opt) => opt && handleChangeInterval(Number(opt.value))}
      />
    </span>
  );

  const originInstrumentSummary = (
    <span onClick={(e) => e.stopPropagation()}>
      <SelectComponent
        compact
        options={pitchOptions}
        value={pitchOptions[fromKey]}
        onChange={(opt) => opt && handleChangeFromKey(Number(opt.value))}
      />
    </span>
  );

  const targetInstrumentSummary = (
    <span onClick={(e) => e.stopPropagation()}>
      <SelectComponent
        compact
        options={pitchOptions}
        value={pitchOptions[toKey]}
        onChange={(opt) => opt && handleChangeToKey(Number(opt.value))}
      />
    </span>
  );

  // --- Page title ---
  const pageTitle =
    method === 'key'
      ? `${getNote(note, selectedNotation)} ${getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES)} \u2192 ${getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES)} | Note Transposition`
      : `${getNote(note, selectedNotation)} ${direction === 'up' ? '+' : '-'}${getIntervalName(interval, selectedLanguage)} | Note Transposition`;

  useChangePageTitle(pageTitle);

  // Ensure URL has at least the defaults when there are no params
  useEffect(() => {
    if (!searchParams.has('note')) {
      const params = new URLSearchParams();
      params.set('from_key', '0');
      params.set('note', '0');
      params.set('to_key', '0');
      setSearchParams(params, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const controller: TranspositionController = {
    onChangeNote: handleChangeNote,
    onChangeFromKey: handleChangeFromKey,
    onChangeToKey: handleChangeToKey,
    onChangeMethod: handleChangeMethod,
    onChangeInterval: handleChangeInterval,
    onChangeDirection: handleChangeDirection,
  };

  const showInstrumentSteps = method === 'key';

  return (
    <ContentPage>
      <LiveSummaryBar
        fromKey={method === 'key' ? fromKey : null}
        note={note}
        toKey={method === 'key' ? toKey : null}
        method={method}
        originInstrumentName={originInstrumentName}
        targetInstrumentName={targetInstrumentName}
      />

      <ContentCard>
        {/* Step 1: What note to transpose + method toggle */}
        <StepperStep
          stepNumber={1}
          title={t('stepper.step2Title')}
          summary={noteSummary}
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
            <p className="text-sm text-neutral-500 mb-3">
              {t('stepper.noteSelectDescription')}
            </p>
            <div className="w-full mt-3">
              <NoteSelector
                selected={note}
                setSelected={handleChangeNote}
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
              <p className="text-sm text-neutral-500 mb-3">
                {t('stepper.intervalSelectDescription')}
              </p>
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
              <p className="text-sm text-neutral-500 mb-3">
                {t('stepper.originInstrumentDescription')}
              </p>
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
              <p className="text-sm text-neutral-500 mb-3">
                {t('stepper.targetInstrumentDescription')}
              </p>
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
        <NoteTranspositionResults
          method={method}
          note={note}
          fromKey={fromKey}
          toKey={toKey}
          interval={interval}
          direction={direction}
          targetNote={targetNote}
          reversedEnharmonicOriginGroupNotes={originEnharmonicNotes}
          reversedEnharmonicTargetGroupNotes={targetEnharmonicNotes}
          originInstrumentName={originInstrumentName}
          targetInstrumentName={targetInstrumentName}
          isMobile={isMobile}
          controller={controller}
        />
      )}
    </ContentPage>
  );
}

export default NoteTranspositionPage;
