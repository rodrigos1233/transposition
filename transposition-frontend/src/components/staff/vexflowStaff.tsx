import { useCallback, useEffect, useRef, useContext } from 'react';
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
  onNoteClick?: (position: number) => void;
};

function VexflowStaff({
  displayedNotes,
  correspondingNotes,
  musicalKey,
  noteColour,
  colour,
  accidentals,
  activeNoteIndex,
  onNoteClick,
}: VexflowStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const noteDataRef = useRef<{ el: SVGElement | null; x: number }[]>([]);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const hoverIndicatorRef = useRef<HTMLDivElement | null>(null);
  const staveMetricsRef = useRef<{ topLineY: number; lineSpacing: number } | null>(null);
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

    // Hover indicator shadow
    const hoverShadow = document.createElement('div');
    hoverShadow.style.cssText =
      'position:absolute;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0.08) 50%,rgba(0,0,0,0) 70%);opacity:0;transition:opacity 0.15s;pointer-events:none;transform:translate(-50%,-50%);';
    containerRef.current.appendChild(hoverShadow);
    hoverIndicatorRef.current = hoverShadow;

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

    // Store rendered stave metrics for click detection
    const topLineY = stave.getYForLine(0);
    const bottomLineY = stave.getYForLine(4);
    const lineSpacing = (bottomLineY - topLineY) / 4;
    staveMetricsRef.current = { topLineY, lineSpacing };

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
        const pxLeft = x * scale + 4; // center the 8px dot under the note head
        indicator.style.left = `${pxLeft}px`;
        indicator.style.opacity = '1';
        indicator.style.backgroundColor =
          colour ? (COLOR_MAP[colour] ?? '#666') : '#666';
      }
    } else if (indicator) {
      indicator.style.opacity = '0';
    }
  }, [activeNoteIndex, colour]);

  // Convert mouse Y to staff position (0 = C4 on middle line area)
  // Staff lines top to bottom: F5(line0), D5(line1), B4(line2), G4(line3), E4(line4)
  // Position 0=C, 1=D, 2=E, 3=F, 4=G, 5=A, 6=B
  // VexFlow line 0 = top line = F5 = position 3+7=10 (F in octave above)
  // Each half-line step = one note position
  // Top line (line 0) = position 10 (F5), bottom line (line 4) = position 2 (E4)
  const svgYToPosition = useCallback((svgY: number): number => {
    const metrics = staveMetricsRef.current;
    if (!metrics) return 0;
    const { topLineY, lineSpacing } = metrics;
    // halfStep = lineSpacing / 2 (distance between adjacent note positions on staff)
    const halfStep = lineSpacing / 2;
    // Top line = position 10 (F5 in our numbering: C=0, D=1, ..., B=6, C5=7, D5=8, E5=9, F5=10)
    const topLinePosition = 10;
    const positionFromTop = (svgY - topLineY) / halfStep;
    const rawPosition = topLinePosition - positionFromTop;
    return Math.round(rawPosition);
  }, []);

  const positionToSvgY = useCallback((position: number): number => {
    const metrics = staveMetricsRef.current;
    if (!metrics) return 0;
    const { topLineY, lineSpacing } = metrics;
    const halfStep = lineSpacing / 2;
    const topLinePosition = 10;
    return topLineY + (topLinePosition - position) * halfStep;
  }, []);

  // Click handler
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!onNoteClick || !staveMetricsRef.current) return;

      const svg = containerRef.current?.querySelector('svg');
      if (!svg) return;

      // Convert screen coords to SVG coords
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM()?.inverse();
      if (!ctm) return;
      const svgPt = pt.matrixTransform(ctm);

      const position = svgYToPosition(svgPt.y);
      const clamped = Math.max(-2, Math.min(12, position));

      onNoteClick(clamped);
    },
    [onNoteClick, svgYToPosition]
  );

  // Hover handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!onNoteClick || !staveMetricsRef.current || activeNoteIndex != null) {
        if (hoverIndicatorRef.current) hoverIndicatorRef.current.style.opacity = '0';
        return;
      }

      const svg = containerRef.current?.querySelector('svg');
      const hoverShadow = hoverIndicatorRef.current;
      if (!svg || !hoverShadow) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM()?.inverse();
      if (!ctm) return;
      const svgPt = pt.matrixTransform(ctm);

      const position = Math.round(svgYToPosition(svgPt.y));
      const clamped = Math.max(-2, Math.min(12, position));
      const targetSvgY = positionToSvgY(clamped);

      // Convert SVG coords to container pixels
      const viewBox = svg.getAttribute('viewBox');
      if (!viewBox) return;
      const [, , vbW, vbH] = viewBox.split(' ').map(Number);
      const rect = svg.getBoundingClientRect();
      const scaleY = rect.height / vbH;
      const scaleX = rect.width / vbW;

      const pxTop = targetSvgY * scaleY;
      const pxLeft = svgPt.x * scaleX;

      // Size the shadow to match one staff half-step (the click hitbox)
      const hitboxPx = (staveMetricsRef.current.lineSpacing / 2) * scaleY;
      const size = Math.max(hitboxPx * 2.5, 20);
      hoverShadow.style.width = `${size}px`;
      hoverShadow.style.height = `${size}px`;

      hoverShadow.style.left = `${pxLeft}px`;
      hoverShadow.style.top = `${pxTop}px`;
      hoverShadow.style.opacity = '1';
    },
    [onNoteClick, activeNoteIndex, svgYToPosition, positionToSvgY]
  );

  const handleMouseLeave = useCallback(() => {
    if (hoverIndicatorRef.current) hoverIndicatorRef.current.style.opacity = '0';
  }, []);

  return (
    <div
      ref={containerRef}
      className="vexflow-staff-container"
      style={{ position: 'relative', cursor: onNoteClick ? 'pointer' : undefined }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
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
