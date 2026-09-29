import { CATS, CHIP_KEYS } from '../lib/constants';

const CHIPS = [['all', 'All'], ...CATS.filter((c) => CHIP_KEYS.includes(c[0])).map((c) => [c[0], c[2]])];

export default function CategoryFilter({ cat, onChange }) {
  return (
    <div className="chips" role="group" aria-label="Categories">
      {CHIPS.map(([k, l]) => <button key={k} className="chip" aria-pressed={cat === k} onClick={() => onChange(k)}>{l}</button>)}
    </div>
  );
}
