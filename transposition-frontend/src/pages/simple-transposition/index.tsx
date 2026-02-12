import { useContext, useEffect, useState } from 'react';
import {
  getNote,
  INSTRUMENTS_PITCHES,
  Note,
} from '../../utils/notes';
import NoteSelector from '../../components/note-selector';
import { crossInstrumentsTransposer } from '../../utils/transposer';
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
import NoteTranspositionResults from './NoteTranspositionResults';

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

  // --- Stepper UI state ---
  const isFullUrl =
    searchParams.has('from_key') &&
    searchParams.has('note') &&
    searchParams.has('to_key');
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
      ...overrides,
    };

    params.set('from_key', String(merged.from_key));
    params.set('note', String(merged.note));
    params.set('to_key', String(merged.to_key));

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

  // --- Stepper navigation ---
  // Step 1 (note) → Step 2 (origin instrument) → Step 3 (target instrument) → Results
  function handleContinueStep(stepNumber: number) {
    if (stepNumber === 1) {
      setActiveStep(2);
    } else if (stepNumber === 2) {
      setActiveStep(3);
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
  const showResults = step3Completed;

  // --- Transposition computation ---
  const [, reversedEnharmonicOriginGroupNotes] = crossInstrumentsTransposer(
    note,
    fromKey,
    fromKey
  );

  const [targetNote, reversedEnharmonicTargetGroupNotes] =
    crossInstrumentsTransposer(note, fromKey, toKey);

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

  const noteSummary = getNote(note, selectedNotation);

  const originInstrumentSummary = originInstrumentName
    ? `${originInstrumentName} \u2014 ${getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES)}`
    : getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES);

  const targetInstrumentSummary = targetInstrumentName
    ? `${targetInstrumentName} \u2014 ${getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES)}`
    : getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES);

  // --- Page title ---
  const pageTitle = `${getNote(note, selectedNotation)} ${getNote(fromKey, selectedNotation, INSTRUMENTS_PITCHES)} \u2192 ${getNote(toKey, selectedNotation, INSTRUMENTS_PITCHES)} | Note Transposition`;

  useChangePageTitle(pageTitle);

  // Ensure URL has at least the defaults when there are no params
  useEffect(() => {
    if (!searchParams.has('from_key') && !searchParams.has('note')) {
      const params = new URLSearchParams();
      params.set('from_key', '0');
      params.set('note', '0');
      params.set('to_key', '0');
      setSearchParams(params, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ContentPage>
      <LiveSummaryBar
        fromKey={fromKey}
        note={note}
        toKey={toKey}
        method="key"
        originInstrumentName={originInstrumentName}
        targetInstrumentName={targetInstrumentName}
      />

      <ContentCard>
        {/* Step 1: What note to transpose */}
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
            <div className="w-full mt-3">
              <NoteSelector
                selected={note}
                setSelected={handleChangeNote}
                colour="purple"
              />
            </div>
          </ContentCard>
        </StepperStep>

        {/* Step 2: Origin Instrument */}
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

        {/* Step 3: Target Instrument */}
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
      </ContentCard>

      {/* Results */}
      {showResults && (
        <NoteTranspositionResults
          note={note}
          fromKey={fromKey}
          toKey={toKey}
          targetNote={targetNote}
          reversedEnharmonicOriginGroupNotes={
            reversedEnharmonicOriginGroupNotes
          }
          reversedEnharmonicTargetGroupNotes={
            reversedEnharmonicTargetGroupNotes
          }
          originInstrumentName={originInstrumentName}
          targetInstrumentName={targetInstrumentName}
          isMobile={isMobile}
        />
      )}
    </ContentPage>
  );
}

export default NoteTranspositionPage;
