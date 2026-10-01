import { useMemo, useRef, useState } from 'react';
import useProducts from '../hooks/useProducts';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import ProductMarquee from '../components/ProductMarquee';
import CategoryFilter from '../components/CategoryFilter';
import MoodTiles from '../components/MoodTiles';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  const { products, loading, error } = useProducts(false);
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const searchRef = useRef(null);

  const picks = useMemo(() => [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured)], [products]);
  const best = useMemo(() => products.filter((p) => p.category === 'best'), [products]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter((p) => (cat === 'all' || p.category === cat) && (!s || (p.name || '').toLowerCase().includes(s)));
  }, [products, cat, q]);

  const goCollection = () => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  const filter = (c) => { setCat(c); goCollection(); };
  const focusSearch = () => { goCollection(); setTimeout(() => searchRef.current?.focus(), 500); };
  const empty = products.length ? 'No watches match.' : 'The collection is being curated.';

  return (
    <>
      <Header onFilter={filter} onSearch={focusSearch} />
      <main id="top">
        <Hero products={products} onExplore={goCollection} onBest={() => filter('best')} />
        <section className="alt" id="picks"><div className="w">
          <div className="hd"><span className="eb">Editor's Picks</span><h2>Timepieces Worth Discovering</h2>
            <p>A curated collection of luxury watches selected for different styles, occasions, and personalities.</p></div>
          <ProductMarquee products={picks} loading={loading} error={error} />
        </div></section>
        <section id="collection"><div className="w">
          <div className="hd"><span className="eb">Discover Your Timepiece</span><h2>Choose Your Style</h2></div>
          <CategoryFilter cat={cat} onChange={setCat} />
          <input ref={searchRef} className="sr" type="search" placeholder="Search watches" aria-label="Search watches" value={q} onChange={(e) => setQ(e.target.value)} />
          <ProductGrid products={list} loading={loading} error={error} empty={empty} />
          <MoodTiles onPick={filter} />
        </div></section>
        <section className="alt"><div className="w">
          <div className="hd"><span className="eb">Most Wanted</span><h2>The Watches Everyone Is Talking About</h2></div>
          <ProductGrid products={best} loading={loading} error={error} empty="Coming soon." />
        </div></section>
        <CTA onClick={() => filter('all')} />
      </main>
      <Footer onFilter={filter} />
    </>
  );
}
