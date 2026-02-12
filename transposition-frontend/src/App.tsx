import './App.css';
import './styles/output.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NoteTranspositionPage from './pages/simple-transposition';
import { NoteRedirect } from './pages/simple-transposition/redirects';
import ScaleTranspositionPage from './pages/scale-transposition';
import {
  CrossInstrumentsRedirect,
  IntervalsRedirect,
} from './pages/scale-transposition/redirects';
import AboutPage from './pages/about';
import LandingPage from './pages/landing';
import { BottomNav, Footer, Header } from './header';
import ContextsProvider from './contexts/ContextsProvider';

function App() {
  return (
    <div className="App container mx-auto">
      <BrowserRouter>
        <ContextsProvider>
          <Header />
          <main className="w-full m-auto flex flex-col items-center">
            <div className={`contents flex p-2 z-0 relative`}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                {/* Note transposition (query params) */}
                <Route
                  path="note"
                  element={<NoteTranspositionPage />}
                />
                {/* Redirect old /note/:linkParams (path params) to new format */}
                <Route
                  path="note/:linkParams"
                  element={<NoteRedirect />}
                />

                {/* New unified scale page (query params) */}
                <Route
                  path="scale"
                  element={<ScaleTranspositionPage />}
                />
                {/* Redirect old /scale/:linkParams (path params) to new format */}
                <Route
                  path="scale/:linkParams"
                  element={<CrossInstrumentsRedirect />}
                />

                {/* Backward-compatible redirects for old URL formats */}
                <Route path="scale-cross-instruments">
                  <Route
                    index
                    element={
                      <Navigate
                        to="/scale?from_key=0&scale=0&to_key=0&mode=0"
                        replace
                      />
                    }
                  />
                  <Route
                    path=":linkParams"
                    element={<CrossInstrumentsRedirect />}
                  />
                </Route>
                <Route path="scale-intervals">
                  <Route
                    index
                    element={
                      <Navigate
                        to="/scale?from_key=0&scale=0&mode=0&method=interval&interval=5&direction=up"
                        replace
                      />
                    }
                  />
                  <Route
                    path=":linkParams"
                    element={<IntervalsRedirect />}
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
