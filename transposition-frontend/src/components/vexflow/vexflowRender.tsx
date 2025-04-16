import { useEffect, useRef } from 'react';
import { Renderer, Stave } from 'vexflow4';

type VexflowStaveProps = {
    alteration?: 'sharp' | 'flat';
    alteredNotes?: number[];
    doubleAlteredNotes?: number[];
};

function VexflowStave({ alteration = 'sharp', alteredNotes = [], doubleAlteredNotes = [] }: VexflowStaveProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false); // Tracks if the effect has already run

    useEffect(() => {
        if (initializedRef.current) return; // Prevents the effect from running more than once
        initializedRef.current = true;

        const renderer = new Renderer(containerRef.current!, Renderer.Backends.SVG);
        const context = renderer.getContext();
        const stave = new Stave(10, 40, 400);

        // Determine the key signature value
        const totalAlterations = alteredNotes.length + doubleAlteredNotes.length;
        const keySignature = totalAlterations > 0 ? `${alteration}s_${totalAlterations}` : 'C';

        stave
            .addClef('treble')
            .addTimeSignature('4/4')
            .addKeySignature(keySignature);

        stave.setContext(context).draw();
    }, [alteration, alteredNotes, doubleAlteredNotes]); // Dependencies to update if props change

    return <div ref={containerRef}></div>;
}

export default VexflowStave;