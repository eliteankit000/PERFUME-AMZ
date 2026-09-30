import { useState } from 'react';
import { catName } from '../../lib/constants';

function Thumb({ url }) {
  const [bad, setBad] = useState(false);
  return <div className="t">{url && !bad ? <img src={url} alt="" loading="lazy" onError={() => setBad(true)} /> : <div className="ph">IMAGE</div>}</div>;
}

export default function ProductList({ products, busy, onMove, onToggle, onEdit, onDelete }) {
  if (!products.length) return <div className="empty" style={{ padding: '48px 20px' }}><h3>The collection is being curated.</h3></div>;
  return products.map((p, i) => (
    <div className="a-row" key={p.id}>
      <Thumb url={p.image_url} />
      <div>
        <div className="nm">{p.name || 'Untitled watch'}</div>
        <small>{catName(p.category)} · {p.active ? 'Active' : 'Hidden'}{p.featured ? ' · Featured' : ''} · {p.click_count || 0} clicks</small>
      </div>
      <div className="a-act">
        <button className="a-btn" aria-label="Move up" disabled={busy || i === 0} onClick={() => onMove(i, -1)}>↑</button>
        <button className="a-btn" aria-label="Move down" disabled={busy || i === products.length - 1} onClick={() => onMove(i, 1)}>↓</button>
        <button className="a-btn" aria-pressed={p.featured} disabled={busy} onClick={() => onToggle(p, 'featured')}>Featured</button>
        <button className="a-btn" aria-pressed={p.active} disabled={busy} onClick={() => onToggle(p, 'active')}>{p.active ? 'Active' : 'Hidden'}</button>
        <button className="a-btn" disabled={busy} onClick={() => onEdit(p)}>Edit</button>
        <button className="a-btn danger" disabled={busy} onClick={() => onDelete(p)}>Delete</button>
      </div>
    </div>
  ));
}
