import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/output.css';
import SimpleTransposition from './pages/simple-transposition';
import Header from './header';
import { Note } from './utils/notes';

function App() {
    const [selectedNotation, setSelectedNotation]: [keyof Note, any] =
        useState('romance');

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
