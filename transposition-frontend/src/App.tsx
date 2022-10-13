import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/output.css';
import SimpleTransposition from './pages/simple-transposition';
import Header from './header';
import { Note, NOTES } from './utils/notes';

function getDefaultNotation(): Extract<keyof Note, string> {
    const notationInLocalStorage: Extract<keyof Note, string> =
        localStorage.getItem('selected-notation');
    const defaultNotation = 'romance';

    if (!!notationInLocalStorage) {
        if (Object.keys(NOTES[0]).includes(notationInLocalStorage)) {
            return notationInLocalStorage;
        }

        return defaultNotation;
    }

    return defaultNotation;
}

function App() {
    const [selectedNotation, setSelectedNotation]: [
        Extract<keyof Note, string>,
        any
    ] = useState(getDefaultNotation);

    useEffect(() => {
        localStorage.setItem(selectedNotation, 'selected-notation');
    }, [selectedNotation]);

    return (
        <div className="App container mx-auto">
            <Header
                selectedNotation={selectedNotation}
                setSelectedNotation={setSelectedNotation}
            />
            <div className="contents flex p-2">
                <SimpleTransposition selectedNotation={selectedNotation} />
            </div>
        </div>
    );
}

export default App;
