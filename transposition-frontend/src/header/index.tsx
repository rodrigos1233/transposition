import React, { useState, useEffect } from 'react';
import NotationSelector from './NotationSelector';
import { Note } from '../utils/notes';
import './header.css';
import Button from '../components/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

function Header({
    selectedNotation,
    setSelectedNotation,
}: {
    selectedNotation: keyof Note;
    setSelectedNotation: any;
}) {
    const location = window.location.pathname.substring(1);
    const navigate = useNavigate();

    const isMobile = useIsMobile();

    return (
        <header className={`header shadow-lg ${isMobile ? 'mobile' : ''}`}>
            <div className="header__content p-2">
                <div>
                    <h1>Music Transpositor</h1>
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
                </div>

                <NotationSelector
                    selectedNotation={selectedNotation}
                    setSelectedNotation={setSelectedNotation}
                />
            </div>
        </header>
    );
}

export default Header;
