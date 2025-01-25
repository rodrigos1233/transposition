import React, { useEffect, useRef } from 'react';
import { Renderer, Stave } from 'vexflow4';



function VexFlowExample( { musicalKey, replacedKey }: { musicalKey: string, replacedKey?: string } )  {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderer = new Renderer(containerRef.current!, Renderer.Backends.SVG);
        const context = renderer.getContext();
        const stave = new Stave(10, 40, 400);
        stave.addClef("bass").addTimeSignature("4/4").addKeySignature(musicalKey, replacedKey);
        stave.setContext(context).draw();
    }, []);

    return <div ref={containerRef}></div>;
};

export default VexFlowExample;