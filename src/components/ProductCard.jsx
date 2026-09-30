import { useRef, useState } from 'react';
import { trackClick } from '../lib/analytics';
import { CATS } from '../lib/constants';

const MAX_SHIFT = 7; // px — mouse-follow travel limit
const canFollow = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ProductCard({ p }) {
  const [bad, setBad] = useState(false);
  const imRef = useRef(null);
  const raf = useRef(0);
  const track = () => trackClick(p.id); // href is untouched, so the link always works
  const cat = p.category ? (CATS.find((c) => c[0] === p.category) || [])[1] : null;

  // Mouse-follow writes CSS variables directly on the element: no React re-renders.
  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (!canFollow()) return;
    const el = imRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${(nx * MAX_SHIFT).toFixed(2)}px`);
      el.style.setProperty('--my', `${(ny * MAX_SHIFT).toFixed(2)}px`);
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    const el = imRef.current;
    if (!el) return;
    el.style.setProperty('--mx', '0px');
    el.style.setProperty('--my', '0px');
  };

  return (
    <article className="card">
      <div className="im" ref={imRef} onPointerMove={onMove} onPointerLeave={onLeave}>
        {p.featured === true && <span className="fb">Curated</span>}
        {p.image_url && !bad
          ? <img src={p.image_url} alt={p.name || 'Curated luxury watch'} loading="lazy" decoding="async" onError={() => setBad(true)} />
          : <div className="ph">WATCH IMAGE</div>}
      </div>
      <div className="ct">
        <div className="tx">
          {cat && <span className="cl">{cat}</span>}
          {p.name && <h3>{p.name}</h3>}
        </div>
        <a className="b" href={p.affiliate_url} target="_blank" rel="nofollow sponsored noopener" onClick={track} onAuxClick={track}>
          Check on Amazon →
        </a>
      </div>
    </article>
  );
}
