import { useState } from 'react';

export default function Hero({ product, onExplore, onBest }) {
  const [bad, setBad] = useState(false);
  const img = product?.image_url && !bad;
  return (
    <div className="w hero">
      <div>
        <span className="eb">The Art of Fragrance</span>
        <h1>Find a scent<br />that becomes<br /><em>your signature.</em></h1>
        <p>Discover fragrances worth wearing, gifting, and remembering.</p>
        <div className="btns">
          <button className="b" onClick={onExplore}>Explore Fragrances</button>
          <button className="b o" onClick={onBest}>Best Sellers</button>
        </div>
      </div>
      <div className="vis">
        {img
          ? <img src={product.image_url} alt={product.name || 'Curated fragrance product'} onError={() => setBad(true)} />
          : <div className="bt" aria-hidden="true" />}
        <small>SCENTÉ / THE EDIT</small>
      </div>
    </div>
  );
}
