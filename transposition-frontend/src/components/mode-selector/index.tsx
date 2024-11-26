import React, { useState } from 'react';

import Button from '../../components/button';
import useTranslation, {
    Language,
    Translations,
} from '../../hooks/useTranslation';
import { getModeName, MODES } from '../../utils/modes';
import './mode-selector.css';

import ButtonsGridContainer from '../button/ButtonsGridContainer';

type ModeSelectorProps = {
    selectedLanguage: Language;
    selectedMode: number;
    handleChangeMode: (mode: number) => void;
    showAdditionalModes: boolean;
    setShowAdditionalModes: (showAdditionalModes: boolean) => void;
};

function ModeSelector({
    selectedLanguage,
    selectedMode,
    handleChangeMode,
    showAdditionalModes,
    setShowAdditionalModes,
}: ModeSelectorProps) {
    const modes = MODES.map((mode, index) => (
        <Button
            key={index}
            onClick={() => handleChangeMode(index)}
            disabled={index === selectedMode}
            className={`bg-neutral-100 ${
                index < 2 || showAdditionalModes ? 'block' : 'hidden'
            }`}
        >
            {getModeName(index, selectedLanguage)}
        </Button>
    ));

    function handleSwitchClick() {
        const newShowAdditionalModes = !showAdditionalModes;

        // Switch back to basic mode if currently in advanced mode and hiding advanced modes
        if (!newShowAdditionalModes && selectedMode >= 2) {
            handleChangeMode(0);
        }

        setShowAdditionalModes(newShowAdditionalModes);
    }

    const toggleButtonTextTranslations: Translations = {
        [Language.English]: [
            `${!showAdditionalModes ? 'Show' : 'Hide'} advanced modes`,
        ],
        [Language.French]: [
            `${
                !showAdditionalModes ? 'Afficher' : 'Masquer'
            } les modes avancés`,
        ],
        [Language.Spanish]: [
            `${
                !showAdditionalModes ? 'Mostrar' : 'Ocultar'
            } los modos avanzados`,
        ],
        [Language.German]: [
            `Erweiterte Modi ${
                !showAdditionalModes ? 'Anzeigen' : 'Verstecken'
            }`,
        ],
    };

    const toggleButtonText = useTranslation(
        selectedLanguage,
        toggleButtonTextTranslations,
        [showAdditionalModes]
    );

    return (
        <div
            className={`mb-3 flex gap-5 items-start justify-between mode-selector ${
                showAdditionalModes
                    ? 'mode-selector--advanced'
                    : 'mode-selector--simple'
            }`}
        >
            <ButtonsGridContainer className={'grid-buttons-container--modes'}>
                {modes}
            </ButtonsGridContainer>
            <Button
                onClick={handleSwitchClick}
                disabled={false}
                className={'shrink-0'}
            >
                {toggleButtonText}
            </Button>
        </div>
    );
}

export default ModeSelector;
