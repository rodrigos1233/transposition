import React, { useEffect, useState } from 'react';
import './App.css';
import './styles/output.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SimpleTransposition from './pages/simple-transposition';
import CrossInstrumentsScaleTransposition from './pages/scale-transposition/crossInstruments';
import AboutPage from './pages/about';
import LandingPage from './pages/landing';
import { BottomNav, Footer, Header } from './header';
import { Note } from './utils/notes';
import { useIsMobile } from './hooks/useIsMobile';
import { Language } from './hooks/useTranslation';
import IntervalsScaleTransposition from './pages/scale-transposition/intervals';
import LanguageContext from './contexts/LanguageContext';

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
        case 'nl':
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
                <LanguageContext.Provider
                    value={{ selectedLanguage, setSelectedLanguage }}
                >
                    <Header
                        selectedNotation={selectedNotation}
                        setSelectedNotation={handleChangeNotation}
                    />
                    <main className="w-full m-auto flex flex-col items-center">
                        <div className={`contents flex p-2 z-0 relative`}>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <LandingPage
                                            selectedNotation={selectedNotation}
                                        />
                                    }
                                />
                                <Route path="note">
                                    <Route
                                        index
                                        element={
                                            <Navigate to="0-0-0" replace />
                                        }
                                    />
                                    <Route
                                        path=":linkParams"
                                        element={
                                            <SimpleTransposition
                                                selectedNotation={
                                                    selectedNotation
                                                }
                                            />
                                        }
                                    />
                                </Route>
                                <Route path="scale-cross-instruments">
                                    <Route
                                        index
                                        element={
                                            <Navigate to="0-0-0-0" replace />
                                        }
                                    />
                                    <Route
                                        path=":linkParams"
                                        element={
                                            <CrossInstrumentsScaleTransposition
                                                selectedNotation={
                                                    selectedNotation
                                                }
                                            />
                                        }
                                    />
                                </Route>
                                <Route path="scale-intervals">
                                    <Route
                                        index
                                        element={
                                            <Navigate to="0-5-up" replace />
                                        }
                                    />
                                    <Route
                                        path=":linkParams"
                                        element={
                                            <IntervalsScaleTransposition
                                                selectedNotation={
                                                    selectedNotation
                                                }
                                            />
                                        }
                                    />
                                </Route>
                                <Route
                                    path="about"
                                    element={
                                        <AboutPage
                                            selectedNotation={selectedNotation}
                                        />
                                    }
                                />
                                <Route
                                    path="*"
                                    element={
                                        <LandingPage
                                            selectedNotation={selectedNotation}
                                        />
                                    }
                                />
                            </Routes>
                        </div>
                    </main>
                    <BottomNav />
                    <Footer />
                </LanguageContext.Provider>
            </BrowserRouter>
        </div>
    );
}

export default App;
