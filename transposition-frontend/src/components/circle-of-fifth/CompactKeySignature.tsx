import { useEffect, useRef } from 'react';
import { Renderer, Stave, BarlineType } from 'vexflow';
import { Key } from '../../utils/scaleBuilder';
import { keyToVexflowKeySignature } from '../staff/noteConverter';

type CompactKeySignatureProps = {
  keys: Key[];
  activeIndex: number;
  onToggle: () => void;
};

const STAVE_WIDTH = 120;
const STAVE_HEIGHT = 55;

function CompactKeySignature({
  keys,
  activeIndex,
  onToggle,
}: CompactKeySignatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMultiple = keys.length > 1;
  const activeKey = keys[activeIndex] ?? keys[0];

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(STAVE_WIDTH, STAVE_HEIGHT);
    const context = renderer.getContext();

    // staveY: tweak this value to vertically center the stave in the circle
    const stave = new Stave(-6, -35, STAVE_WIDTH);
    stave.addClef('treble');
    stave.setBegBarType(BarlineType.NONE);
    stave.setEndBarType(BarlineType.NONE);

    const keySpec = keyToVexflowKeySignature(activeKey);
    if (keySpec !== 'C') {
      stave.addKeySignature(keySpec);
    }

    stave.setContext(context).draw();

    const svg = containerRef.current.querySelector('svg');
    if (svg) {
      svg.setAttribute('viewBox', `0 0 ${STAVE_WIDTH} ${STAVE_HEIGHT}`);
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.width = '100%';
      svg.style.height = '100%';
    }
  }, [activeKey]);

  function handleClick(e: React.MouseEvent) {
    if (hasMultiple) {
      e.stopPropagation();
      onToggle();
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        cursor: hasMultiple ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', flexGrow: 1 }} />
      {hasMultiple && (
        <div style={{ display: 'flex', gap: '3px', paddingBottom: '2px' }}>
          {keys.map((_, i) => (
            <div
              key={i}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: i === activeIndex ? '#888' : '#ccc',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CompactKeySignature;

export function getDefaultActiveIndex(keys: Key[]): number {
  if (keys.length <= 1) return 0;
  const countA =
    keys[0].alteredNotes.length + keys[0].doubleAlteredNotes.length;
  const countB =
    keys[1].alteredNotes.length + keys[1].doubleAlteredNotes.length;
  return countA <= countB ? 0 : 1;
}
