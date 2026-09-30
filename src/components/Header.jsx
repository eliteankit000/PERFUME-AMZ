import { useState } from 'react';
import { NAV } from '../lib/constants';

export default function Header({ onFilter, onSearch }) {
  const [open, setOpen] = useState(false);
  const pick = (k) => { setOpen(false); onFilter(k); };

  return (
    <header>
      <div className="w nav">
        <a href="#top" className="logo" aria-label="HOROVA home">HOROVA</a>
        <nav className={`ln${open ? ' open' : ''}`} aria-label="Main">
          {NAV.map(([k, label]) => (
            <button key={k} type="button" onClick={() => pick(k)}>{label}</button>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button type="button" className="ic" aria-label="Search watches" onClick={() => { setOpen(false); onSearch(); }}>⌕</button>
          <button type="button" className="ic bg" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>{open ? '✕' : '☰'}</button>
        </div>
      </div>
    </header>
  );
}
