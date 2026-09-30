import { useEffect, useState } from 'react';
import useProducts from '../../hooks/useProducts';
import { createProduct, deleteProduct, removeImageIfOrphan, reorderProducts, updateProduct, uploadImage } from '../../lib/products';
import AdminStats from './AdminStats';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

export default function AdminDashboard({ email, onSignOut }) {
  const { products, loading, error, reload } = useProducts(true);
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); } }, [toast]);
  const ok = (m) => setToast({ m });
  const fail = (e) => { console.error('[horova] admin action failed:', e); setToast({ m: 'Unable to save this product. Please try again.', bad: true }); };

  async function save(values, file) {
    let uploaded = null;
    const old = editing !== 'new' ? editing : null;
    try {
      if (file) { uploaded = await uploadImage(file); values.image_url = uploaded; }
      if (old) await updateProduct(old.id, values); else await createProduct(values, products);
    } catch (e) {
      if (uploaded) removeImageIfOrphan(uploaded).catch(() => {});
      throw e;
    }
    if (old?.image_url && old.image_url !== values.image_url) removeImageIfOrphan(old.image_url).catch(() => {});
    setEditing(null);
    ok(old ? 'Product updated successfully.' : 'Product added successfully.');
    reload();
  }

  async function run(fn) { setBusy(true); try { await fn(); await reload(); } catch (e) { fail(e); } finally { setBusy(false); } }
  const move = (i, d) => run(async () => {
    const arr = [...products]; [arr[i], arr[i + d]] = [arr[i + d], arr[i]];
    await reorderProducts(arr);
  });
  const toggle = (p, k) => run(() => updateProduct(p.id, { [k]: !p[k] }));
  const remove = () => run(async () => {
    const p = confirm; setConfirm(null);
    await deleteProduct(p.id);
    if (p.image_url) removeImageIfOrphan(p.image_url).catch(() => {});
    ok('Watch deleted.');
  });

  return (
    <div className="a-wrap">
      <div className="a-top">
        <div><div className="logo" style={{ fontSize: 18, marginBottom: 14 }}>HOROVA</div>
          <h1>Watch collection</h1><p>Manage your watch affiliate products.</p></div>
        <div className="a-bar">
          <a className="a-btn" style={{ display: 'inline-flex', alignItems: 'center' }} href="/">View site</a>
          <button className="a-btn" onClick={onSignOut} title={email}>Sign out</button>
          <button className="b" onClick={() => setEditing('new')}>+ Add Watch</button>
        </div>
      </div>

      {error && <div className="er">Something went wrong while loading the collection. <button className="a-btn" onClick={reload}>Retry</button></div>}
      {loading
        ? <div aria-busy="true">{[0, 1, 2, 3].map((i) => <div key={i} className="sk" style={{ height: 96, marginBottom: 8 }} />)}</div>
        : <>
            <AdminStats products={products} />
            <ProductList products={products} busy={busy} onMove={move} onToggle={toggle} onEdit={setEditing} onDelete={setConfirm} />
          </>}

      {editing && <ProductForm product={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} />}
      {confirm && (
        <div className="a-modal c" role="dialog" aria-modal="true"><div className="a-dlg">
          <h2>Delete this watch from the collection?</h2>
          <div className="btns"><button className="b o" onClick={() => setConfirm(null)}>Cancel</button><button className="b" onClick={remove}>Delete</button></div>
        </div></div>
      )}
      {toast && <div className={'a-toast' + (toast.bad ? ' bad' : '')} role="status">{toast.m}</div>}
    </div>
  );
}
