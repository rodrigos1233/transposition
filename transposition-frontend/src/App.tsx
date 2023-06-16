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
import { Language } from './hooks/useTranslation';

const detectUserBrowserLanguage = (): Language => {
    const userLanguage = navigator.language.toLowerCase().split('-')[0];

    switch (userLanguage) {
        case 'fr':
            return Language.French;
        // Add more cases for other supported languages
        default:
            return Language.English;
    }
};

const defaultNotation = (): keyof Note => {
    const userLanguage = navigator.language.toLowerCase().split('-')[0];

    switch (userLanguage) {
        case 'fr':
            return 'romance';
        case 'es':
            return 'romance';
        case 'it':
            return 'romance';
        case 'pt':
            return 'romance';
        case 'de':
            return 'german';
        default:
            return 'english';
    }
};

function App() {
    const [selectedNotation, setSelectedNotation]: [keyof Note, any] =
        useState(defaultNotation);
    const [selectedLanguage, setSelectedLanguage] = useState(
        detectUserBrowserLanguage
    );
    const isMobile = useIsMobile();

    return (
        <div className="App container mx-auto overflow-clip">
            <BrowserRouter>
                <Header
                    selectedNotation={selectedNotation}
                    setSelectedNotation={setSelectedNotation}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                />
                <div className={`contents flex p-2 z-0 relative`}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <SimpleTransposition
                                    selectedNotation={selectedNotation}
                                    selectedLanguage={selectedLanguage}
                                />
                            }
                        />
                        <Route
                            path="/scale"
                            element={
                                <ScaleTransposition
                                    selectedLanguage={selectedLanguage}
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
