import { NAV } from '../lib/constants';

export default function Footer({ onFilter }) {
  return (
    <footer><div className="w">
      <div className="logo">HOROVA</div>
      <nav className="fl" aria-label="Footer">{NAV.map(([k, l]) => <button key={k} onClick={() => onFilter(k)}>{l}</button>)}</nav>
      <div className="dis"><span>As an Amazon Associate, we may earn from qualifying purchases.</span><span>© {new Date().getFullYear()} HOROVA</span></div>
    </div></footer>
  );
}
