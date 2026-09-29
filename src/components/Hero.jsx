import { useEffect, useMemo, useState } from 'react';

const SLIDE_MS = 2000; // time each product stays on screen (change here)
const MAX_SLIDES = 10;

export default function Hero({ products = [], onExplore, onBest }) {
  const [bad, setBad] = useState(() => new Set());
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  // featured first, then the rest; only products that have an image
  const slides = useMemo(() => {
    const withImg = products.filter((p) => p.image_url && !bad.has(p.id));
    return [...withImg.filter((p) => p.featured), ...withImg.filter((p) => !p.featured)].slice(0, MAX_SLIDES);
  }, [products, bad]);

  const n = slides.length;
  const idx = n ? i % n : 0;

  useEffect(() => {
    if (n < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((v) => v + 1), SLIDE_MS);
    return () => clearInterval(t);
  }, [n, paused]);

  return (
    <div className="w hero">
      <div>
        <span className="eb">The Art of Fragrance</span>
        <h1>Find a scent<br />that becomes<br /><em>your signature.</em></h1>
        <p>Discover fragrances worth wearing, gifting, and remembering.</p>
        <div className="btns">
          <button className="b" onClick={onExplore}>Explore Fragrances</button>
          <button className="b o" onClick={onBest}>Best Sellers</button>
        </div>
      </div>
      <div
        className="vis"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured fragrances"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {n
          ? slides.map((p, k) => (
              <img
                key={p.id}
                className={`sl${k === idx ? ' on' : ''}`}
                src={p.image_url}
                alt={k === idx ? (p.name || 'Curated fragrance product') : ''}
                aria-hidden={k === idx ? undefined : true}
                loading={k < 2 ? 'eager' : 'lazy'}
                decoding="async"
                onError={() => setBad((s) => new Set(s).add(p.id))}
              />
            ))
          : <div className="bt" aria-hidden="true" />}
        <small>SCENTÉ / THE EDIT</small>
        {n > 1 && (
          <div className="dots">
            {slides.map((p, k) => (
              <button key={p.id} type="button" className={k === idx ? 'on' : ''} aria-label={`Show slide ${k + 1}`} aria-current={k === idx} onClick={() => setI(k)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
