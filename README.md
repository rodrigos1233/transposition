# transposition - ClaveShift.com

A modern React/TypeScript web app for musicians to quickly transpose a single note or an entire scale from one instrument's key to another. Ideal for music students, teachers, and professionals.

---

### What is Musical Transposition?

**Musical transposition** is the process of shifting a set of musical notes (a melody, scale, or chord) up or down by a fixed interval, so that the music sounds higher or lower, but keeps the same relative structure.

- In programming terms, imagine you have an array of numbers representing musical notes. Transposing means adding (or subtracting) the same value to each element, so the pattern stays the same, but the starting point changes.
- In music, this is useful for adapting a song to fit different instruments (which may be tuned differently), or to make it easier for a singer or player.

**Example:**  
If a melody starts on C and you transpose it up by 2 steps, every note moves up by 2, so C becomes D, D becomes E, etc. The melody sounds higher, but the relationships between notes are unchanged.

**This site automates transposition** so you don’t need to know music theory:
- You select the original and target keys (or interval), and the app instantly gives you the transposed notes or scale, ready for any instrument.

---

## Features
- Cross-instrument transposition: Transpose individual notes or full scales between any two instrument keys (e.g., from Bb Clarinet to Eb Alto Sax).
- Interval-based transposition: Transpose up or down by a selected interval (e.g., up a fifth, down a third), regardless of instrument.
- Supports all-to-all key transpositions: Any key to any key, not limited to common transpositions.
- Visualizes music notation with a custom implementation (currently using a custom renderer; VexFlow replacement planned).
- Interactive Circle of Fifths for quick reference.
- Multi-language support (English, French, Spanish, German).
- Responsive design for desktop and mobile.

---

## Usage

### Cross-Instrument Transposition
1. **Select the original instrument key** (e.g., Bb Clarinet, Eb Alto Sax).
2. **Choose the target instrument key** or scale.
3. **Input the note or scale** you want to transpose.
4. View the transposed result instantly, both as text and on a musical staff.
5. Use the Circle of Fifths and other tools for reference.

### Interval-Based Transposition
1. **Select the starting note or scale.**
2. **Choose the interval** you wish to transpose by (e.g., up a fifth, down a second).
3. **Select the direction** (up or down).
4. Instantly view the transposed result, both as text and as rendered music notation.

---

## Installation

1. Clone the repository and navigate to the frontend folder:
   ```bash
   git clone <repo-url>
   cd transposition/transposition-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the app:
   ```bash
   npm run build
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:5173` by default.

---

## Project Architecture

```
transposition-frontend/
├── src/
│   ├── assets/         # Images and static resources
│   ├── components/     # Reusable UI components (selectors, cards, nav, etc.)
│   ├── contexts/       # React Contexts for shared state (language, notation)
│   ├── hooks/          # Custom React hooks (e.g., device detection, translation)
│   ├── locales/        # Translation files for i18n
│   ├── pages/          # Page-level components for each route
│   ├── styles/         # CSS and Tailwind styles
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Core logic (transposer.ts, scaleBuilder.ts, etc.)
│   └── index.tsx       # App entry point
├── public/             # Static public assets
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── ...
```

- **Core Logic:** All transposition and scale-building logic is in `src/utils/`, notably `transposer.ts` and `scaleBuilder.ts`.
- **UI:** Modular React components with Tailwind CSS for styling.
- **Routing:** Uses React Router for navigation between pages.
- **State:** Uses React Context for language and notation preferences.
- **Testing:** Set up with Testing Library and Vitest.

---

## Internationalization
- Powered by `react-i18next` and custom translation hooks.
- Languages supported: English, French, Spanish, German.
- Language and notation preferences are saved in localStorage for a persistent experience.
- To add a new language, update the files in `src/locales/` and extend the language enums/types as needed.

---

## Credits
- Built by Rodrigo Salazar
- Powered by React, TypeScript, Tailwind CSS, Vite, and VexFlow.

