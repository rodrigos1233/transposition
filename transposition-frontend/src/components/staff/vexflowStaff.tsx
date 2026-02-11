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
  accidentals?: ('sharp' | 'flat' | 'doubleSharp' | 'doubleFlat' | null)[];
};

function VexflowStaff({
  displayedNotes,
  correspondingNotes,
  musicalKey,
  noteColour,
  accidentals,
}: VexflowStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedNotation } = useContext(NotationContext);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous render
    containerRef.current.innerHTML = '';

    // Calculate width based on content
    const width = calculateStaveWidth(displayedNotes.length, musicalKey);

    // Render with generous dimensions — we'll crop via viewBox after
    const RENDER_HEIGHT = 300;
    const STAVE_Y = 20; // generous top space so nothing clips above

    // Setup renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, RENDER_HEIGHT);
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
    }

    // Crop SVG to actual rendered content using getBBox
    const svg = containerRef.current.querySelector('svg');
    if (svg) {
      const bbox = (svg as SVGSVGElement).getBBox();
      const pad = 2;
      const vbX = Math.max(0, bbox.x - pad);
      const vbY = Math.max(0, bbox.y - pad);
      const vbW = bbox.width + pad * 2;
      const vbH = bbox.height + pad * 2;

      svg.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);
      svg.setAttribute('width', `${vbW}`);
      svg.setAttribute('height', `${vbH}`);
    }
  }, [
    displayedNotes,
    correspondingNotes,
    musicalKey,
    noteColour,
    accidentals,
    selectedNotation,
  ]);

  return <div ref={containerRef} className="vexflow-staff-container" />;
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
