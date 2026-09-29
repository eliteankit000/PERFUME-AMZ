import { TILES } from '../lib/constants';

export default function MoodTiles({ onPick }) {
  return (
    <div className="tiles">
      {TILES.map(([k, t, s, bg]) => (
        <button key={k} className="tile" style={{ background: bg }} onClick={() => onPick(k)}><h3>{t}</h3><span>{s}</span></button>
      ))}
    </div>
  );
}
