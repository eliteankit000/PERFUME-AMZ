export default function AdminStats({ products }) {
  const clicks = products.reduce((n, p) => n + (p.click_count || 0), 0);
  const top = [...products].filter((p) => p.click_count > 0).sort((a, b) => b.click_count - a.click_count).slice(0, 5);
  const stats = [
    ['Products', products.length], ['Active', products.filter((p) => p.active).length],
    ['Featured', products.filter((p) => p.featured).length], ['Clicks', clicks],
  ];
  return (
    <>
      <div className="a-stats">{stats.map(([l, n]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
      <div className="a-panel">
        <h2>Top clicked</h2>
        {top.length
          ? top.map((p) => <div className="a-top3" key={p.id}><span>{p.name || 'Untitled watch'}</span><span>{p.click_count} clicks</span></div>)
          : <p style={{ color: 'var(--mute)', margin: 0 }}>No affiliate clicks yet.</p>}
      </div>
    </>
  );
}
