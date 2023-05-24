import React, { useState, useEffect } from 'react';
import NotationSelector from './NotationSelector';
import { Note } from '../utils/notes';
import './header.css';
import Button from '../components/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import Text from '../components/text';
import { HamburgerMenu } from './hamburgerMenu';

export function Header({
    selectedNotation,
    setSelectedNotation,
}: {
    selectedNotation: keyof Note;
    setSelectedNotation: any;
}) {
    const location = window.location.pathname.substring(1);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);

    const isMobile = useIsMobile();

    return (
        <header
            className={`header shadow-lg z-10 relative ${
                isMobile ? 'header--mobile sticky top-0 bg-white' : ''
            }`}
        >
            <div className="header__content p-2">
                <div>
                    <h1>Music Transpositor</h1>
                    {!isMobile && (
                        <nav className="h-14">
                            <Button
                                disabled={location === 'scale'}
                                onClick={() => {
                                    navigate('/scale');
                                }}
                                className="ml-3"
                            >
                                scale
                            </Button>
                            <Button
                                disabled={location === ''}
                                className="ml-3"
                                onClick={() => {
                                    navigate('/');
                                }}
                            >
                                note
                            </Button>
                        </nav>
                    )}
                </div>

                {!isMobile && (
                    <NotationSelector
                        selectedNotation={selectedNotation}
                        setSelectedNotation={setSelectedNotation}
                    />
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
                    />
                </div>
            )}
        </header>
    );
}

export function BottomNav() {
    const isMobile = useIsMobile();
    const location = window.location.pathname.substring(1);
    const navigate = useNavigate();

    return (
        <>
            {isMobile && (
                <div className="p-2 shadow-[0_8px_30px_rgb(0,0,0,0.4)] fixed bottom-0 bg-white w-screen">
                    <nav className="h-10">
                        <Button
                            disabled={location === 'scale'}
                            onClick={() => {
                                navigate('/scale');
                            }}
                            className="ml-3"
                        >
                            scale
                        </Button>
                        <Button
                            disabled={location === ''}
                            className="ml-3"
                            onClick={() => {
                                navigate('/');
                            }}
                        >
                            note
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
