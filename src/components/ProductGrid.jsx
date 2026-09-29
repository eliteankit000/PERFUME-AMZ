import ProductCard from './ProductCard';

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading collection">
      {Array.from({ length: count }, (_, i) => (
        <div className="card sk-card" key={i}>
          <div className="im"><div className="sk sk-img" /></div>
          <div className="sk sk-line" />
        </div>
      ))}
    </div>
  );
}

export default function ProductGrid({ products, loading, error, empty = 'The collection is being curated.' }) {
  if (loading) return <SkeletonGrid />;
  if (error) return <div className="grid"><div className="empty"><h3>Something went wrong while loading the collection.</h3></div></div>;
  return (
    <div className="grid">
      {products.length ? products.map((p) => <ProductCard key={p.id} p={p} />) : <div className="empty"><h3>{empty}</h3></div>}
    </div>
  );
}
