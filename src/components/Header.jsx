import { useState } from 'react';
import { NAV } from '../lib/constants';

export default function Header({ onFilter, onSearch }) {
  const [open, setOpen] = useState(false);
  const go = (c) => { setOpen(false); onFilter(c); };
  return (
    <header>
      <div className="w nav">
        <a className="logo" href="#top">CHRONÉ</a>
        <nav className={'ln' + (open ? ' open' : '')} aria-label="Primary">
          {NAV.map(([k, l]) => <button key={k} onClick={() => go(k)}>{l}</button>)}
        </nav>
        <div>
          <button className="ic" aria-label="Search" onClick={() => { setOpen(false); onSearch(); }}>⌕</button>
          <button className="ic bg" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>☰</button>
        </div>
      </div>
    </header>
  );
}
