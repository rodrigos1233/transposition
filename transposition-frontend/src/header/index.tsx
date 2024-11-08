import React, { useState, useEffect, useRef } from 'react';
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
import { handleNavigate } from '../utils/handleNavigate';
import ButtonsFlexContainer from '../components/button/ButtonsFlexContainer';

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

    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                headerRef.current &&
                !headerRef.current.contains(event.target as Node)
            ) {
                setOpenMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        <header
            ref={headerRef}
            className={`header shadow-lg z-10 relative ${
                isMobile ? 'header--mobile sticky top-0 bg-white pl-4 pr-4' : ''
            }`}
        >
            <div className="header__content p-2">
                <div>
                    <h1 className="font-bold m-2">
                        <Link to="/">ClaveShift</Link>
                    </h1>
                    {!isMobile && (
                        <nav className="h-14">
                            <ButtonsFlexContainer>
                                <Button
                                    disabled={location.startsWith('scale/')}
                                    href="/scale"
                                    onClick={(
                                        e: React.MouseEvent<HTMLAnchorElement>
                                    ) => {
                                        e.preventDefault();
                                        handleNavigate(navigate, '/scale');
                                    }}
                                    className="ml-3"
                                >
                                    {translatedStrings[0]}
                                </Button>

                                <Button
                                    disabled={location.startsWith('note/')}
                                    href="/note"
                                    onClick={(
                                        e: React.MouseEvent<HTMLAnchorElement>
                                    ) => {
                                        e.preventDefault();
                                        handleNavigate(navigate, '/note');
                                    }}
                                    className="ml-3"
                                >
                                    {translatedStrings[1]}
                                </Button>

                                <Button
                                    disabled={location === 'about'}
                                    href="/about"
                                    className="ml-3"
                                >
                                    {translatedStrings[2]}
                                </Button>
                            </ButtonsFlexContainer>
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
                    className={`collapsed-menu p-4 shadow-lg rounded-sm flex flex-col gap-2 bg-white ${
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
                <div className="p-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] fixed bottom-0 bg-white w-screen">
                    <nav className="h-10">
                        <ButtonsFlexContainer>
                            <Button
                                disabled={location.startsWith('scale/')}
                                href="/scale"
                                onClick={(
                                    e: React.MouseEvent<HTMLAnchorElement>
                                ) => {
                                    e.preventDefault(); // Prevent default link behavior
                                    handleNavigate(navigate, '/scale'); // Use custom navigate function
                                }}
                                className="ml-3 grow"
                            >
                                {translatedStrings[0]}
                            </Button>

                            <Button
                                disabled={location.startsWith('note/')}
                                href="/note"
                                onClick={(
                                    e: React.MouseEvent<HTMLAnchorElement>
                                ) => {
                                    e.preventDefault();
                                    handleNavigate(navigate, '/note'); // Use custom navigate function
                                }}
                                className="ml-3"
                            >
                                {translatedStrings[1]}
                            </Button>

                            <Button
                                disabled={location === 'about'}
                                href="/about"
                                className="ml-3"
                            >
                                {translatedStrings[2]}
                            </Button>
                        </ButtonsFlexContainer>
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
