import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/output.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SimpleTransposition from './pages/simple-transposition';
import { BottomNav, Footer, Header } from './header';
import { Note } from './utils/notes';
import ReactDOM, { createRoot } from 'react-dom/client';
import ScaleTransposition from './pages/scale-transposition';
import { useIsMobile } from './hooks/useIsMobile';

function App() {
    const [selectedNotation, setSelectedNotation]: [keyof Note, any] =
        useState('romance');
    const isMobile = useIsMobile();

    return (
        <div className="App container mx-auto overflow-clip">
            <BrowserRouter>
                <Header
                    selectedNotation={selectedNotation}
                    setSelectedNotation={setSelectedNotation}
                />
                <div className={`contents flex p-2 z-0 relative`}>
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
                <BottomNav />
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
