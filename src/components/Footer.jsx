import { NAV } from '../lib/constants';

export default function Footer({ onFilter }) {
  return (
    <footer>
      <div className="w">
        <div className="logo">HOROVA</div>
        <div className="fl">
          {NAV.map(([k, label]) => (
            <button key={k} type="button" onClick={() => onFilter(k)}>{label}</button>
          ))}
        </div>
        <div className="dis">
          <span>As an Amazon Associate, we earn from qualifying purchases.</span>
          <span>© {new Date().getFullYear()} HOROVA</span>
        </div>
      </div>
    </footer>
  );
}
