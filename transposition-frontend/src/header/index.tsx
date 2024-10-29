import React, { useState, useEffect } from 'react';
import NotationSelector from './NotationSelector';
import { Note } from '../utils/notes';
import './header.css';
import Button from '../components/button';
import { Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import Text from '../components/text';
import { HamburgerMenu } from './hamburgerMenu';
import useTranslation, {
    Language,
    Translations,
} from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';
import {
    enharmonicGroupTransposer,
    enharmonicGroupTransposerReverse,
} from '../utils/transposer';

export function Header({
    selectedNotation,
    setSelectedNotation,
    selectedLanguage,
    setSelectedLanguage,
}: {
    selectedNotation: keyof Note;
    setSelectedNotation: () => void;
    selectedLanguage: Language;
    setSelectedLanguage: (language: Language) => void;
}) {
    const location = window.location.pathname.substring(1);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);

    const isMobile = useIsMobile();

    const translations: Translations = {
        [Language.English]: ['scale', 'note', 'about'],
        [Language.French]: ['gamme', 'note', 'à propos'],
        [Language.Spanish]: ['escala', 'nota', 'info'],
        [Language.German]: ['Tonleiter', 'Ton', 'Info'],
    };

    const translatedStrings = useTranslation(
        selectedLanguage,
        translations,
        []
    );

    function handleNavigate(path: string) {
        if (location.startsWith('note/') && path === '/scale') {
            const originParams = location.substring(5);
            const [originKeyString, noteString, targetKeyString, modeString] =
                originParams?.split('-') || [];
            const note = Number(noteString);
            const chosenNote = enharmonicGroupTransposerReverse(note, 0);
            navigate(
                `scale/${originKeyString}-${chosenNote}-${targetKeyString}-0`
            );
            return;
        }

        if (location.startsWith('scale/') && path === '/note') {
            const originParams = location.substring(6);
            const [originKeyString, noteString, targetKeyString] =
                originParams?.split('-') || [];
            const note = Number(noteString);
            const chosenNote = enharmonicGroupTransposer(note);
            navigate(
                `note/${originKeyString}-${chosenNote}-${targetKeyString}`
            );

            return;
        }

        navigate(path);
    }

    return (
        <header
            className={`header shadow-lg z-10 relative ${
                isMobile ? 'header--mobile sticky top-0 bg-white' : ''
            }`}
        >
            <div className="header__content p-2">
                <div>
                    <h1 className="font-bold m-2">
                        <Link to="/">Music Transpositor</Link>
                    </h1>
                    {!isMobile && (
                        <nav className="h-14">
                            <Button
                                disabled={location.startsWith('scale/')}
                                onClick={() => {
                                    handleNavigate('/scale');
                                }}
                                className="ml-3"
                            >
                                {translatedStrings[0]}
                            </Button>
                            <Button
                                disabled={location.startsWith('note/')}
                                className="ml-3"
                                onClick={() => {
                                    handleNavigate('/note');
                                }}
                            >
                                {translatedStrings[1]}
                            </Button>
                            <Button
                                disabled={location === 'about'}
                                className="ml-3"
                                onClick={() => {
                                    navigate('/about');
                                }}
                            >
                                {translatedStrings[2]}
                            </Button>
                        </nav>
                    )}
                </div>

                {!isMobile && (
                    <>
                        <NotationSelector
                            selectedNotation={selectedNotation}
                            setSelectedNotation={setSelectedNotation}
                            selectedLanguage={selectedLanguage}
                        />
                        <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={setSelectedLanguage}
                        />
                    </>
                )}
                {isMobile && (
                    <HamburgerMenu
                        isOpen={openMenu}
                        toggleOpen={() => setOpenMenu(!openMenu)}
                    />
                )}
            </div>
            {isMobile && (
                <div
                    className={`collapsed-menu p-2 shadow-lg rounded-sm bg-white ${
                        openMenu
                            ? 'collapsed-menu--open'
                            : 'collapsed-menu--closed'
                    }`}
                >
                    <NotationSelector
                        selectedNotation={selectedNotation}
                        setSelectedNotation={setSelectedNotation}
                        selectedLanguage={selectedLanguage}
                    />
                    <LanguageSelector
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                    />
                </div>
            )}
        </header>
    );
}

export function BottomNav({
    selectedLanguage,
}: {
    selectedLanguage: Language;
}) {
    const isMobile = useIsMobile();
    const location = window.location.pathname.substring(1);
    const navigate = useNavigate();

    const translations: Translations = {
        [Language.English]: ['scale', 'note', 'about'],
        [Language.French]: ['gamme', 'note', 'à propos'],
        [Language.Spanish]: ['escala', 'nota', 'info'],
        [Language.German]: ['Tonleiter', 'Ton', 'Info'],
    };

    const translatedStrings = useTranslation(
        selectedLanguage,
        translations,
        []
    );

    return (
        <>
            {isMobile && (
                <div className="p-2 shadow-[0_8px_30px_rgb(0,0,0,0.4)] fixed bottom-0 bg-white w-screen">
                    <nav className="h-10">
                        <Button
                            disabled={location.startsWith('scale/')}
                            onClick={() => {
                                handleNavigate('/scale');
                            }}
                            className="ml-3"
                        >
                            {translatedStrings[0]}
                        </Button>
                        <Button
                            disabled={location.startsWith('note/')}
                            className="ml-3"
                            onClick={() => {
                                handleNavigate('/note');
                            }}
                        >
                            {translatedStrings[1]}
                        </Button>
                        <Button
                            disabled={location === 'about'}
                            className="ml-3"
                            onClick={() => {
                                navigate('/about');
                            }}
                        >
                            {translatedStrings[2]}
                        </Button>
                    </nav>
                </div>
            )}
        </>
    );
}

export function Footer() {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const isMobile = useIsMobile();

    return (
        <footer className={`p-2 ${isMobile ? 'mb-14' : ''}`}>
            <p>
                <Text size={'small'}>
                    &copy; {startYear} - {currentYear} Rodrigo Salazar. All
                    rights reserved.
                </Text>
            </p>
        </footer>
    );
}
