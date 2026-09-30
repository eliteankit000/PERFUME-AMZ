import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import ProductGrid from './ProductGrid';

const SPEED = 45;      // px per second, moves LEFT (change here)
const DRAG_THRESHOLD = 6;

/**
 * Endless right-to-left product row.
 * - Auto-scrolls left forever; cards leave on the left and re-enter from the right.
 * - New products are picked up automatically (rendered from the `products` prop).
 * - Hover (mouse) or press/drag (touch + mouse) stops it; drag left/right to move by hand.
 * - Trackpad / shift+wheel horizontal scroll also moves it. No buttons.
 */
export default function ProductMarquee({ products, loading, error }) {
  const viewRef = useRef(null);
  const setRef = useRef(null);
  const trackRef = useRef(null);
  const [copies, setCopies] = useState(2);

  const st = useRef({ x: 0, setW: 0, hover: false, drag: false, moved: false, startX: 0, startPos: 0, last: 0, resumeAt: 0 });
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const hasItems = products && products.length > 0;

  // Measure one full set and render enough copies to always fill the screen.
  useEffect(() => {
    if (!hasItems) return;
    const measure = () => {
      const setW = setRef.current?.offsetWidth || 0;
      const viewW = viewRef.current?.offsetWidth || 0;
      if (!setW) return;
      st.current.setW = setW;
      setCopies(Math.max(2, Math.ceil(viewW / setW) + 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (setRef.current) ro.observe(setRef.current);
    if (viewRef.current) ro.observe(viewRef.current);
    return () => ro.disconnect();
  }, [hasItems, products]);

  // Animation loop
  useEffect(() => {
    if (!hasItems) return;
    let raf = 0;
    let prev = performance.now();
    const wrap = (x, w) => (w ? ((x % w) - w) % w : 0); // keep in (-w, 0]
    const tick = (now) => {
      const s = st.current;
      const dt = Math.min(now - prev, 64) / 1000;
      prev = now;
      const idle = !s.hover && !s.drag && now >= s.resumeAt && !document.hidden && !reduce;
      if (idle) s.x -= SPEED * dt;
      s.x = wrap(s.x, s.setW);
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${s.x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasItems, reduce]);

  if (!hasItems) return <ProductGrid products={products} loading={loading} error={error} />;

  const s = st.current;
  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    s.drag = true; s.moved = false; s.startX = e.clientX; s.startPos = s.x;
  };
  const onMove = (e) => {
    if (!s.drag) return;
    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      s.moved = true;
      try { viewRef.current.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    }
    if (s.moved) s.x = s.startPos + dx;
  };
  const onUp = () => {
    if (!s.drag) return;
    s.drag = false;
    s.resumeAt = performance.now() + (s.moved ? 1200 : 0); // short pause after a manual move
    setTimeout(() => { s.moved = false; }, 0);
  };
  const onWheel = (e) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (!d) return;
    s.x -= d;
    s.resumeAt = performance.now() + 1200;
  };
  const stopClickAfterDrag = (e) => { if (s.moved) { e.preventDefault(); e.stopPropagation(); } };

  return (
    <div
      ref={viewRef}
      className="mq"
      role="region"
      aria-label="Featured watches. Hover or drag to stop and move."
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') s.hover = true; }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') s.hover = false; onUp(); }}
      onFocus={() => { s.hover = true; }}
      onBlur={() => { s.hover = false; }}
      onWheel={onWheel}
      onClickCapture={stopClickAfterDrag}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="mq-t" ref={trackRef}>
        {Array.from({ length: copies }).map((_, c) => (
          <div className="mq-set" key={c} ref={c === 0 ? setRef : undefined} aria-hidden={c > 0 || undefined} {...(c > 0 ? { inert: '' } : {})}>
            {products.map((p) => (
              <div className="mq-i" key={`${c}-${p.id}`}><ProductCard p={p} /></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
