import { useState } from 'react';
import { trackClick } from '../lib/analytics';

export default function ProductCard({ p }) {
  const [bad, setBad] = useState(false);
  const track = () => trackClick(p.id); // href is untouched, so the link always works
  return (
    <article className="card">
      <div className="im">
        {p.image_url && !bad
          ? <img src={p.image_url} alt={p.name || 'Curated fragrance product'} loading="lazy" decoding="async" onError={() => setBad(true)} />
          : <div className="ph">FRAGRANCE IMAGE</div>}
      </div>
      <div className="ct">
        {p.name && <h3>{p.name}</h3>}
        <a className="b" href={p.affiliate_url} target="_blank" rel="nofollow sponsored noopener" onClick={track} onAuxClick={track}>
          Check on Amazon →
        </a>
      </div>
    </article>
  );
}
