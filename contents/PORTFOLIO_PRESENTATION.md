---
id: claveshift-transposition
title: ClaveShift
tagline: Cross-instrument musical transposition tool with interactive notation rendering
status: wip
visibility: public
tags:
  - web
  - visualization
  - open-source
stack:
  - TypeScript
  - React
  - VexFlow
  - Tailwind CSS
  - Vite
  - react-i18next
role: solo
timeframe:
  start: "2022-06"
origin: personal
featured: true
links:
  live: https://claveshift.com
  repo: https://github.com/rodrigos1233/transposition
---

## Context / Problem

Musicians regularly need to transpose notes and scales between instruments pitched in different keys (e.g. Bb clarinet to Eb alto saxophone). This requires mental arithmetic over the circle of fifths, accounting for enharmonic equivalents, key signatures, and modal contexts. Existing tools are either oversimplified (single-note lookup tables) or buried inside full notation software that's overkill for quick transposition tasks.

## Solution

ClaveShift is a React/TypeScript single-page application that handles three transposition modes with real-time staff notation rendering:

- **Cross-instrument transposition** — select origin and target instrument keys, pick a note or full scale, and get the correctly enharmonic-spelled result with key signature
- **Interval-based transposition** — transpose by any of 13 intervals (unison through octave) in either direction, with proper accidental selection based on circle of fifths position
- **Scale and mode support** — generates all 7 diatonic modes (Ionian through Locrian) with correct key signatures and accidentals
- **Interactive circle of fifths** — SVG visualization that rotates to reflect mode offsets and highlights the active key
- **VexFlow staff rendering** — professional SVG music notation with clefs, key signatures, accidentals, and color-coded note annotations
- **Multilingual interface** — English, French, Spanish, and German with browser language auto-detection and three notation systems (English, Romance, German)
- **Shareable URLs** — transposition state encoded in route params so results can be bookmarked and shared

## Architecture

```mermaid
architecture-beta
    group ui(cloud)[UI Layer]
    group logic(cloud)[Logic Layer]
    group data(cloud)[Data Layer]

    service router(server)[BrowserRouter] in ui
    service contexts(server)[ContextsProvider] in ui
    service pages(server)[Transposition Pages] in ui
    service selectors(server)[Note and Mode Selectors] in ui
    service circle(server)[Circle of Fifths SVG] in ui
    service staff(server)[VexFlow Staff Renderer] in ui

    service transposer(server)[Transposer Engine] in logic
    service scalebuilder(server)[Scale Builder] in logic
    service noteconverter(server)[Note Converter] in logic

    service notes(database)[Notes and Scales] in data
    service modes(database)[Modes and Intervals] in data
    service instruments(database)[Instruments] in data

    router:B --> T:contexts
    contexts:B --> T:pages
    pages:B --> T:selectors
    pages:B --> T:circle
    selectors:B --> T:staff
    staff:B --> T:noteconverter
    selectors:B --> T:transposer
    transposer:R --> L:scalebuilder
    transposer:B --> T:notes
    scalebuilder:B --> T:modes
    noteconverter:B --> T:notes
    transposer:B --> T:instruments
```

## Current State

The core transposition engine and all three transposition modes are fully functional. The application currently supports four languages and three notation systems with URL-driven state for shareable results. Active work is on the `vexflow-integration` branch, migrating from a custom staff renderer to VexFlow for professional-quality music notation with proper key signatures, accidentals, and clef rendering. Next steps include completing the VexFlow integration and deploying the updated notation rendering.
