import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import ProductGrid from './ProductGrid';

const SPEED = 45;      // px / second — cards glide to the LEFT, endlessly
const FRICTION = 0.92; // how quickly a fling slows down
const MIN_ITEMS = 3;   // fewer products than this -> normal static grid

export default function ProductMarquee({ products, loading, error, empty }) {
  const n = products.length;
  const live = !loading && !error && n >= MIN_ITEMS;
  const [reps, setReps] = useState(2);
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const setRef = useRef(null);
  const st = useRef({ x: 0, v: 0, W: 0, down: false, drag: false, moved: false, hover: false, focus: false, startX: 0, lastX: 0, lastT: 0 });

  // measure one set of cards; render enough copies to fill the screen seamlessly
  useEffect(() => {
    if (!live || reduced) return;
    const view = viewRef.current, set = setRef.current;
    if (!view || !set) return;
    const measure = () => {
      const w = set.getBoundingClientRect().width;
      st.current.W = w;
      if (w > 0) setReps(Math.max(2, Math.ceil(view.clientWidth / w) + 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(view); ro.observe(set);
    return () => ro.disconnect();
  }, [live, reduced, n]);

  // the endless animation loop (writes transform directly: no React re-renders)
  useEffect(() => {
    if (!live || reduced) return;
    let raf, last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const s = st.current, W = s.W;
      if (W > 0 && trackRef.current) {
        if (!s.drag) {
          const auto = s.hover || s.focus ? 0 : -SPEED;
          s.x += (auto + s.v) * dt;
          s.v *= Math.pow(FRICTION, dt * 60);
          if (Math.abs(s.v) < 1) s.v = 0;
        }
        s.x = (((s.x % W) + W) % W) - W; // wrap -> seamless loop
        trackRef.current.style.transform = `translate3d(${s.x}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [live, reduced]);

  // duplicate cards must not be keyboard tab stops
  useEffect(() => {
    trackRef.current?.querySelectorAll('.mq-set:not(:first-child) a').forEach((a) => { a.tabIndex = -1; });
  });

  if (!live) return <ProductGrid products={products} loading={loading} error={error} empty={empty} />;

  if (reduced) {
    return (
      <div className="mq mq-rm" role="region" aria-label="Featured watches" tabIndex={0}>
        <div className="mq-set">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>
    );
  }

  const s = st.current;
  const down = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    s.down = true; s.moved = false; s.v = 0;
    s.startX = s.lastX = e.clientX; s.lastT = performance.now();
  };
  const move = (e) => {
    if (!s.down) return;
    const now = performance.now(), dx = e.clientX - s.lastX;
    if (!s.moved && Math.abs(e.clientX - s.startX) > 6) {
      s.moved = true; s.drag = true;
      try { viewRef.current.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      viewRef.current.classList.add('drag');
    }
    if (s.moved) {
      s.x += dx;
      const dt = (now - s.lastT) / 1000;
      if (dt > 0) s.v = Math.max(-2500, Math.min(2500, s.v * 0.6 + (dx / dt) * 0.4));
    }
    s.lastX = e.clientX; s.lastT = now;
  };
  const up = (e) => {
    if (!s.down) return;
    s.down = false;
    if (performance.now() - s.lastT > 80) s.v = 0; // held still before release: no fling
    if (s.drag) {
      s.drag = false;
      try { viewRef.current.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
      viewRef.current.classList.remove('drag');
    }
  };
  const onFocus = (e) => {
    s.focus = true;
    const view = viewRef.current, r = e.target.getBoundingClientRect(), vr = view.getBoundingClientRect();
    if (r.left < vr.left) s.x += vr.left - r.left + 16;
    else if (r.right > vr.right) s.x -= r.right - vr.right + 16;
  };

  return (
    <div
      className="mq"
      ref={viewRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured watches"
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') s.hover = true; }}
      onPointerLeave={() => { s.hover = false; }}
      onFocus={onFocus}
      onBlur={() => { s.focus = false; }}
      onScroll={(e) => { e.currentTarget.scrollLeft = 0; }}
      onDragStart={(e) => e.preventDefault()}
      onWheel={(e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { s.x -= e.deltaX; s.v = 0; } }}
      onClickCapture={(e) => { if (s.moved) { e.preventDefault(); e.stopPropagation(); s.moved = false; } }}
    >
      <div className="mq-track" ref={trackRef}>
        {Array.from({ length: reps }, (_, r) => (
          <div className="mq-set" key={r} ref={r === 0 ? setRef : null} aria-hidden={r > 0 ? true : undefined}>
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
