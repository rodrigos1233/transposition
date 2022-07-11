import React from 'react';
import NotationSelector from './NotationSelector';
import { Note } from '../utils/notes';
import './header.css';

function Header({
    selectedNotation,
    setSelectedNotation,
}: {
    selectedNotation: keyof Note;
    setSelectedNotation: any;
}) {
    return (
        <header className="header shadow-lg">
            <div className="header__content p-2">
                <h1>Music Transpositor</h1>
                <NotationSelector
                    selectedNotation={selectedNotation}
                    setSelectedNotation={setSelectedNotation}
                />
            </div>
        </header>
    );
}

export default Header;
