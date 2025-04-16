import './App.css';
import './styles/output.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SimpleTransposition from './pages/simple-transposition';
import CrossInstrumentsScaleTransposition from './pages/scale-transposition/crossInstruments';
import AboutPage from './pages/about';
import LandingPage from './pages/landing';
import { BottomNav, Footer, Header } from './header';
import IntervalsScaleTransposition from './pages/scale-transposition/intervals';
import ContextsProvider from './contexts/ContextsProvider';

function App() {
  return (
    <div className="App container mx-auto">
      <BrowserRouter>
        <ContextsProvider>
          <Header />
          <main className="w-full m-auto flex flex-col items-center pt-4">
            <div className={`contents flex p-2 z-0 relative`}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="note">
                  <Route index element={<Navigate to="0-0-0" replace />} />
                  <Route path=":linkParams" element={<SimpleTransposition />} />
                </Route>
                <Route path="scale">
                  <Route index element={<Navigate to="0-0-0-0" replace />} />
                  <Route
                    path=":linkParams"
                    element={<CrossInstrumentsScaleTransposition />}
                  />
                </Route>
                <Route path="scale-cross-instruments">
                  <Route index element={<Navigate to="0-0-0-0" replace />} />
                  <Route
                    path=":linkParams"
                    element={<CrossInstrumentsScaleTransposition />}
                  />
                </Route>
                <Route path="scale-intervals">
                  <Route index element={<Navigate to="0-5-up" replace />} />
                  <Route
                    path=":linkParams"
                    element={<IntervalsScaleTransposition />}
                  />
                </Route>
                <Route path="about" element={<AboutPage />} />
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </div>
          </main>
          <BottomNav />
          <Footer />
        </ContextsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
