import React, { useState } from 'react';

import Button from '../../components/button';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
import { getModeName, MODES } from '../../utils/modes';

import ButtonsGridContainer from '../button/ButtonsGridContainer';
import { getIntervalName, INTERVALS } from '../../utils/intervals';
import ButtonsFlexContainer from '../button/ButtonsFlexContainer';

type IntervalSelectorProps = {
    selectedLanguage: Language;
    selectedInterval: number;
    handleChangeInterval: (mode: number) => void;
    selectedDirection: 'up' | 'down';
    setSelectedDirection: (selectedDirection: 'up' | 'down') => void;
};

function IntervalSelector({
    selectedLanguage,
    selectedInterval,
    handleChangeInterval,
    selectedDirection,
    setSelectedDirection,
}: IntervalSelectorProps) {
    const semitonesTextTranslations: Translations = {
        [Language.English]: ['semitones'],
        [Language.French]: ['demi-tons'],
        [Language.Spanish]: ['semitonos'],
        [Language.German]: ['Halbtöne'],
    };

    const semitonesText = useTranslation(
        selectedLanguage,
        semitonesTextTranslations,
        []
    );
    const intervals = INTERVALS.map((mode, index) => (
        <Button
            key={index}
            onClick={() => handleChangeInterval(index)}
            disabled={index === selectedInterval}
            className={`bg-neutral-100`}
        >
            {`${getIntervalName(index, selectedLanguage)} (${
                selectedDirection === 'up' ? '+' : '-'
            }${index} ${semitonesText[0]})`}
        </Button>
    ));

    function handleUpDownClick(direction: 'up' | 'down') {
        setSelectedDirection(direction);
    }

    const toggleButtonTextTranslations: Translations = {
        [Language.English]: [`Down`, `Up`],
        [Language.French]: [`Bas`, `Haut`],
        [Language.Spanish]: [`Abajo`, `Arriba`],
        [Language.German]: [`Nach unten`, `Nach oben`],
    };

    const toggleButtonText = useTranslation(
        selectedLanguage,
        toggleButtonTextTranslations,
        []
    );

    return (
        <div
            className={`mb-3 flex flex-col gap-5 items-start justify-between mode-selector `}
        >
            <div className="flex h-12 gap-2">
                <Button
                    onClick={() => handleUpDownClick('up')}
                    disabled={selectedDirection === 'up'}
                    className={'shrink-0'}
                >
                    {toggleButtonText[1]}
                </Button>
                <Button
                    onClick={() => handleUpDownClick('down')}
                    disabled={selectedDirection === 'down'}
                    className={'shrink-0'}
                >
                    {toggleButtonText[0]}
                </Button>
            </div>
            <ButtonsGridContainer
                className={'grid-buttons-container--intervals'}
            >
                {intervals}
            </ButtonsGridContainer>
        </div>
    );
}

export default IntervalSelector;
