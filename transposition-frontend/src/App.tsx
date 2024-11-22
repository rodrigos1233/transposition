import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/output.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SimpleTransposition from './pages/simple-transposition';
import ScaleTransposition from './pages/scale-transposition';
import AboutPage from './pages/about';
import LandingPage from './pages/landing';
import { BottomNav, Footer, Header } from './header';
import { Note } from './utils/notes';
import ReactDOM, { createRoot } from 'react-dom/client';
import { useIsMobile } from './hooks/useIsMobile';
import { Language } from './hooks/useTranslation';
import LanguageSelector from './header/LanguageSelector';

const detectUserBrowserLanguage = (): Language => {
    const userLanguage = navigator.language.toLowerCase().split('-')[0];
    const localStorageLanguage = localStorage.getItem(
        'selectedLanguage'
    ) as Language;

    if (localStorageLanguage) {
        return localStorageLanguage;
    }

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

    const localStorageNotation = localStorage.getItem('selectedNotation') as
        | keyof Note
        | null;

    if (localStorageNotation) {
        return localStorageNotation;
    }

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

    function handleChangeNotation(notation: keyof Note) {
        setSelectedNotation(notation);
        localStorage.setItem('selectedNotation', selectedNotation);
    }

    function handleChangeLanguage(language: Language) {
        setSelectedLanguage(language);
        localStorage.setItem('selectedLanguage', language);
    }

    useEffect(() => {
        localStorage.setItem('selectedNotation', selectedNotation);
    }, [selectedNotation]);

    useEffect(() => {
        localStorage.setItem('selectedLanguage', selectedLanguage);
    }, [selectedLanguage]);

    return (
        <div className="App container mx-auto overflow-clip">
            <BrowserRouter>
                <Header
                    selectedNotation={selectedNotation}
                    setSelectedNotation={handleChangeNotation}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={handleChangeLanguage}
                />
                <main className="w-full m-auto flex flex-col items-center">
                    <div className={`contents flex p-2 z-0 relative`}>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <LandingPage
                                        selectedNotation={selectedNotation}
                                        selectedLanguage={selectedLanguage}
                                    />
                                }
                            />
                            <Route path="note">
                                <Route
                                    index
                                    element={<Navigate to="0-0-0" replace />}
                                />
                                <Route
                                    path=":linkParams"
                                    element={
                                        <SimpleTransposition
                                            selectedNotation={selectedNotation}
                                            selectedLanguage={selectedLanguage}
                                        />
                                    }
                                />
                            </Route>
                            <Route path="scale">
                                <Route
                                    index
                                    element={<Navigate to="0-0-0-0" replace />}
                                />
                                <Route
                                    path=":linkParams"
                                    element={
                                        <ScaleTransposition
                                            selectedLanguage={selectedLanguage}
                                            selectedNotation={selectedNotation}
                                        />
                                    }
                                />
                            </Route>
                            <Route
                                path="about"
                                element={
                                    <AboutPage
                                        selectedLanguage={selectedLanguage}
                                        selectedNotation={selectedNotation}
                                    />
                                }
                            />
                            <Route
                                path="*"
                                element={
                                    <LandingPage
                                        selectedNotation={selectedNotation}
                                        selectedLanguage={selectedLanguage}
                                    />
                                }
                            />
                        </Routes>
                    </div>
                </main>
                <BottomNav selectedLanguage={selectedLanguage} />
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
