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
import NavTabDropdown from '../components/nav-tab-dropdown';

export function Header({
    selectedNotation,
    setSelectedNotation,
    selectedLanguage,
    setSelectedLanguage,
}: {
    selectedNotation: keyof Note;
    setSelectedNotation: (notation: keyof Note) => void;
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
        [Language.English]: [
            'Scale',
            'Note',
            'About',
            'Home',
            'Cross instruments',
            'Intervals',
        ],
        [Language.French]: [
            'Gamme',
            'Note',
            'À propos',
            'Accueil',
            'Instruments',
            'Intervalles',
        ],
        [Language.Spanish]: [
            'Escala',
            'Nota',
            'Info',
            'Inicio',
            'Instrumentos',
            'Intervalos',
        ],
        [Language.German]: [
            'Tonleiter',
            'Ton',
            'Info',
            'Start',
            'Instrumente',
            'Intervalle',
        ],
    };

    const translatedStrings = useTranslation(
        selectedLanguage,
        translations,
        []
    );

    const scaleLinkElements = [
        {
            content: translatedStrings[4],
            href: '/scale-cross-instruments',
            isCurrentPage: location.startsWith('scale-cross-instruments'),
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handleNavigate(navigate, '/scale-cross-instruments');
            },
        },
        {
            content: translatedStrings[5],
            href: '/scale-intervals',
            isCurrentPage: location.startsWith('scale-intervals'),
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handleNavigate(navigate, '/scale-intervals');
            },
        },
    ];

    const noteLinkElements = [
        {
            content: translatedStrings[1],
            href: '/note',
            isCurrentPage: location.startsWith('note'),
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handleNavigate(navigate, '/note');
            },
        },
    ];

    const aboutLinkElement = [
        {
            content: translatedStrings[2],
            href: '/about',
            isCurrentPage: location === 'about',
        },
    ];

    return (
        <header
            ref={headerRef}
            className={`header shadow-lg z-10 relative ${
                isMobile ? 'header--mobile sticky top-0 bg-white pl-4 pr-4' : ''
            }`}
        >
            <div className="header__content">
                <div className="flex flex-col justify-between">
                    <h1 className="font-bold m-2">
                        <Link to="/">ClaveShift</Link>
                    </h1>
                    {!isMobile && (
                        <nav className="h-14 flex">
                            <NavTabDropdown
                                elements={scaleLinkElements}
                                isCurrentPage={scaleLinkElements.some(
                                    (link) => link.isCurrentPage
                                )}
                            >
                                {translatedStrings[0]}
                            </NavTabDropdown>

                            <NavTabDropdown
                                elements={noteLinkElements}
                                isCurrentPage={noteLinkElements.some(
                                    (link) => link.isCurrentPage
                                )}
                            >
                                {translatedStrings[1]}
                            </NavTabDropdown>

                            <NavTabDropdown
                                elements={aboutLinkElement}
                                isCurrentPage={aboutLinkElement.some(
                                    (link) => link.isCurrentPage
                                )}
                            >
                                {translatedStrings[2]}
                            </NavTabDropdown>
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
        [Language.English]: [
            'Scale',
            'Note',
            'About',
            'Home',
            'Cross instruments',
            'Intervals',
            'Home',
        ],
        [Language.French]: [
            'Gamme',
            'Note',
            'À propos',
            'Accueil',
            'Instruments',
            'Intervalles',
            'Accueil',
        ],
        [Language.Spanish]: [
            'Escala',
            'Nota',
            'Info',
            'Inicio',
            'Instrumentos',
            'Intervalos',
            'Inicio',
        ],
        [Language.German]: [
            'Tonleiter',
            'Ton',
            'Info',
            'Start',
            'Instrumente',
            'Intervalle',
            'Start',
        ],
    };

    const translatedStrings = useTranslation(
        selectedLanguage,
        translations,
        []
    );

    const startLinkElement = [
        {
            content: translatedStrings[6],
            href: '/',
            isCurrentPage: location === '',
        },
    ];

    const scaleLinkElements = [
        {
            content: translatedStrings[4],
            href: '/scale-cross-instruments',
            isCurrentPage: location.startsWith('scale-cross-instruments'),
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handleNavigate(navigate, '/scale-cross-instruments');
            },
        },
        {
            content: translatedStrings[5],
            href: '/scale-intervals',
            isCurrentPage: location.startsWith('scale-intervals'),
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handleNavigate(navigate, '/scale-intervals');
            },
        },
    ];

    const noteLinkElements = [
        {
            content: translatedStrings[1],
            href: '/note',
            isCurrentPage: location.startsWith('note'),
            onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handleNavigate(navigate, '/note');
            },
        },
    ];

    const aboutLinkElement = [
        {
            content: translatedStrings[2],
            href: '/about',
            isCurrentPage: location === 'about',
        },
    ];

    return (
        <>
            {isMobile && (
                <div className="shadow-[0_8px_30px_rgb(0,0,0,0.4)] fixed bottom-0 bg-white w-screen">
                    <nav className="h-10 flex gap-0.5 bg-neutral-600">
                        <NavTabDropdown
                            elements={startLinkElement}
                            isCurrentPage={startLinkElement.some(
                                (link) => link.isCurrentPage
                            )}
                            isMobile
                        >
                            {translatedStrings[0]}
                        </NavTabDropdown>
                        <NavTabDropdown
                            elements={scaleLinkElements}
                            isCurrentPage={scaleLinkElements.some(
                                (link) => link.isCurrentPage
                            )}
                            isMobile
                        >
                            {translatedStrings[0]}
                        </NavTabDropdown>

                        <NavTabDropdown
                            elements={noteLinkElements}
                            isCurrentPage={noteLinkElements.some(
                                (link) => link.isCurrentPage
                            )}
                            isMobile
                        >
                            {translatedStrings[1]}
                        </NavTabDropdown>

                        <NavTabDropdown
                            elements={aboutLinkElement}
                            isCurrentPage={aboutLinkElement.some(
                                (link) => link.isCurrentPage
                            )}
                            isMobile
                        >
                            {translatedStrings[2]}
                        </NavTabDropdown>
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
        <footer className={`p-2 ${isMobile ? 'mb-20' : ''}`}>
            <p>
                <Text size={'small'}>
                    &copy; {startYear} - {currentYear} Rodrigo Salazar. All
                    rights reserved.
                </Text>
            </p>
        </footer>
    );
}
