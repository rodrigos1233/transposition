import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/output.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SimpleTransposition from './pages/simple-transposition';
import Header from './header';
import { Note } from './utils/notes';
import ReactDOM, { createRoot } from 'react-dom/client';
import ScaleTransposition from './pages/scale-transposition';

function App() {
    const [selectedNotation, setSelectedNotation]: [keyof Note, any] =
        useState('romance');

    return (
        <div className="App container mx-auto">
            <BrowserRouter>
                <Header
                    selectedNotation={selectedNotation}
                    setSelectedNotation={setSelectedNotation}
                />
                <div className="contents flex p-2">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <SimpleTransposition
                                    selectedNotation={selectedNotation}
                                />
                            }
                        />
                        <Route
                            path="/scale"
                            element={
                                <ScaleTransposition
                                    selectedNotation={selectedNotation}
                                />
                            }
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
