import { useEffect, useRef, useContext } from 'react';
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Accidental,
  Annotation,
  Stem,
} from 'vexflow';
import NotationContext from '../../contexts/NotationContext';
import { Key, NoteInScale } from '../../utils/scaleBuilder';
import { Note } from '../../utils/notes';
import {
  positionToVexflowKey,
  keyToVexflowKeySignature,
  accidentalToVexflow,
  calculateStaveWidth,
  COLOR_MAP,
} from './noteConverter';

type VexflowStaffProps = {
  displayedNotes: number[];
  correspondingNotes?: NoteInScale[];
  musicalKey: Key;
  noteColour?: 'emerald' | 'red' | 'sky' | 'amber' | 'purple';
  colour?: 'sky' | 'emerald' | 'amber' | 'red' | 'purple';
  accidentals?: ('sharp' | 'flat' | 'doubleSharp' | 'doubleFlat' | null)[];
  activeNoteIndex?: number | null;
};

function VexflowStaff({
  displayedNotes,
  correspondingNotes,
  musicalKey,
  noteColour,
  colour,
  accidentals,
  activeNoteIndex,
}: VexflowStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const noteDataRef = useRef<{ el: SVGElement | null; x: number }[]>([]);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const { selectedNotation } = useContext(NotationContext);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous render
    containerRef.current.innerHTML = '';

    // Re-add the indicator element (it was cleared with innerHTML)
    const indicator = document.createElement('div');
    indicator.style.cssText =
      'position:absolute;bottom:0;width:8px;height:8px;border-radius:50%;opacity:0;transition:left 0.1s ease-out,opacity 0.15s;pointer-events:none;';
    containerRef.current.appendChild(indicator);
    indicatorRef.current = indicator;

    // Calculate width based on content
    const width = calculateStaveWidth(displayedNotes.length, musicalKey);

    const STAVE_Y = 20;
    const STAVE_LINE_HEIGHT = 40; // 4 spaces × 10px
    const PX_PER_STEP = 5;
    const STAVE_BOTTOM_POS = 2; // E4 = bottom stave line

    // Compute how far notes extend below the stave
    let lowestPos = STAVE_BOTTOM_POS;
    if (displayedNotes.length > 0) {
      let off = 0;
      for (let i = 0; i < displayedNotes.length; i++) {
        if (i > 0 && displayedNotes[i - 1] > displayedNotes[i]) off += 7;
        lowestPos = Math.min(lowestPos, displayedNotes[i] + off);
      }
    }
    const belowStave = Math.max(STAVE_BOTTOM_POS - lowestPos, 0) * PX_PER_STEP;
    const hasAnnotations = displayedNotes.length > 0 && correspondingNotes;
    const annotationSpace = hasAnnotations ? 65 : 0;
    const height =
      STAVE_Y + STAVE_LINE_HEIGHT + belowStave + annotationSpace + 5;

    // Setup renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // Create stave
    const stave = new Stave(10, STAVE_Y, width - 20);
    stave.addClef('treble');

    // Add key signature (no time signature per requirements)
    const keySpec = keyToVexflowKeySignature(musicalKey);
    if (keySpec !== 'C') {
      stave.addKeySignature(keySpec);
    }

    stave.setContext(context).draw();

    // Create notes if any
    if (displayedNotes.length > 0) {
      const notes = createStaveNotes(
        displayedNotes,
        correspondingNotes,
        accidentals,
        noteColour,
        selectedNotation
      );

      // Create voice in SOFT mode (no time signature constraints)
      const voice = new Voice({ numBeats: notes.length, beatValue: 4 });
      voice.setMode(Voice.Mode.SOFT);
      voice.addTickables(notes);

      // Format and draw — use VexFlow's own note bounds so notes
      // never exceed the stave (accounts for clef + key signature width)
      const availableWidth = stave.getNoteEndX() - stave.getNoteStartX();
      new Formatter().joinVoices([voice]).format([voice], availableWidth);

      voice.draw(context, stave);

      // Store SVG elements and x positions for highlighting
      noteDataRef.current = notes.map(n => {
        let el: SVGElement | null = null;
        try { el = n.getSVGElement() ?? null; } catch { /* */ }
        let x = 0;
        try { x = n.getAbsoluteX(); } catch { /* */ }
        return { el, x };
      });
    } else {
      noteDataRef.current = [];
    }

    // Make SVG responsive: scale down with container but don't stretch beyond natural size
    const svg = containerRef.current.querySelector('svg') as SVGSVGElement | null;
    if (svg) {
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.width = '100%';
      svg.style.maxWidth = `${width}px`;
      svg.style.height = 'auto';
    }
  }, [
    displayedNotes,
    correspondingNotes,
    musicalKey,
    noteColour,
    accidentals,
    selectedNotation,
  ]);

  // Highlight the active note during playback
  useEffect(() => {
    const data = noteDataRef.current;
    const indicator = indicatorRef.current;
    const isPlaying = activeNoteIndex != null;

    // Subtle opacity: dim inactive notes slightly, active stays full
    data.forEach(({ el }, i) => {
      if (!el) return;
      if (isPlaying) {
        el.style.opacity = i === activeNoteIndex ? '1' : '0.85';
        el.style.transition = 'opacity 0.1s';
      } else {
        el.style.opacity = '';
        el.style.transition = '';
      }
    });

    // Position the indicator dot below the active note
    if (indicator && isPlaying && data[activeNoteIndex!]) {
      const { x } = data[activeNoteIndex!];
      // Convert VexFlow absolute x to percentage of the SVG viewBox
      const svg = containerRef.current?.querySelector('svg');
      if (svg) {
        const viewBox = svg.getAttribute('viewBox');
        const svgWidth = viewBox ? parseFloat(viewBox.split(' ')[2]) : 0;
        const containerWidth = svg.getBoundingClientRect().width;
        const scale = containerWidth / svgWidth;
        const pxLeft = x * scale - 4; // center the 8px dot
        indicator.style.left = `${pxLeft}px`;
        indicator.style.opacity = '1';
        indicator.style.backgroundColor =
          colour ? (COLOR_MAP[colour] ?? '#666') : '#666';
      }
    } else if (indicator) {
      indicator.style.opacity = '0';
    }
  }, [activeNoteIndex, colour]);

  return (
    <div ref={containerRef} className="vexflow-staff-container" style={{ position: 'relative' }} />
  );
}

function createStaveNotes(
  displayedNotes: number[],
  correspondingNotes: NoteInScale[] | undefined,
  accidentals:
    | ('sharp' | 'flat' | 'doubleSharp' | 'doubleFlat' | null)[]
    | undefined,
  noteColour: string | undefined,
  selectedNotation: keyof Note
): StaveNote[] {
  let offset = 0;

  return displayedNotes.map((note, index) => {
    // Handle octave wrapping (same logic as current Staff)
    if (index > 0 && displayedNotes[index - 1] > note) {
      offset += 7;
    }
    const adjustedPosition = note + offset;

    // Create VexFlow key
    const vexKey = positionToVexflowKey(adjustedPosition);

    // Determine stem direction based on position
    const stemDirection = adjustedPosition > 4 ? Stem.DOWN : Stem.UP;

    // Create note - whole note (no stem)
    const staveNote = new StaveNote({
      keys: [vexKey],
      duration: 'w', // whole note - no stem
      stemDirection,
    });

    // Add accidental if specified
    if (accidentals?.[index]) {
      const vexAccidental = accidentalToVexflow(accidentals[index]);
      if (vexAccidental) {
        staveNote.addModifier(new Accidental(vexAccidental), 0);
      }
    }

    // Add note label annotation below
    if (correspondingNotes?.[index]) {
      const noteName = correspondingNotes[index].note[selectedNotation];
      const annotation = new Annotation(noteName);
      annotation.setVerticalJustification(Annotation.VerticalJustify.BOTTOM);
      staveNote.addModifier(annotation, 0);
    }

    // Apply color to first and last notes
    if (noteColour && (index === 0 || index === displayedNotes.length - 1)) {
      const color = COLOR_MAP[noteColour];
      if (color) {
        staveNote.setStyle({ fillStyle: color, strokeStyle: color });
      }
    }

    return staveNote;
  });
}

export default VexflowStaff;
