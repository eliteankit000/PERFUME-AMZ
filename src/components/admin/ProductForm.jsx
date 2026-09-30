import { useEffect, useMemo, useState } from 'react';
import { CATS } from '../../lib/constants';
import { isHttps, validateImageFile } from '../../lib/products';

export default function ProductForm({ product, onSave, onCancel }) {
  const [name, setName] = useState(product?.name || '');
  const [mode, setMode] = useState('upload');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(product?.affiliate_url || '');
  const [category, setCategory] = useState(product?.category || 'men');
  const [featured, setFeatured] = useState(!!product?.featured);
  const [active, setActive] = useState(product ? product.active : true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const preview = useMemo(() => {
    if (mode === 'upload' && file) return URL.createObjectURL(file);
    return isHttps(imageUrl) ? imageUrl : '';
  }, [mode, file, imageUrl]);
  useEffect(() => () => { if (preview.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);

  function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const problem = validateImageFile(f);
    if (problem) { setErr(problem); e.target.value = ''; return; }
    setErr(''); setFile(f);
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    const url = link.trim();
    if (name.trim().length > 80) return setErr('Name must be 80 characters or fewer.');
    if (!url) return setErr('Amazon affiliate link is required.');
    if (!isHttps(url)) return setErr('Affiliate link must be a valid https URL.');
    if (mode === 'url' && imageUrl.trim() && !isHttps(imageUrl.trim())) return setErr('Image URL must be a valid https URL.');
    setBusy(true);
    try {
      const image_url = mode === 'url' ? imageUrl.trim() || null : file ? null : product?.image_url || null;
      await onSave({ name: name.trim() || null, affiliate_url: url, category, featured, active, image_url }, mode === 'upload' ? file : null);
    } catch (ex) {
      console.error('[scente] save failed:', ex);
      setErr('Unable to save this product. Please try again.');
      setBusy(false);
    }
  }

  return (
    <div className="a-modal" role="dialog" aria-modal="true" aria-label={product ? 'Edit watch' : 'Add watch'}>
      <form className="a-sheet" onSubmit={submit} noValidate>
        <h2>{product ? 'Edit watch' : 'Add watch'}</h2>

        <label htmlFor="f-name">Product name (optional)</label>
        <input id="f-name" type="text" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} placeholder="Dior Sauvage" />

        <div className="lb">Product image</div>
        <div className="a-tabs">
          <button type="button" className="a-btn" aria-pressed={mode === 'upload'} onClick={() => setMode('upload')}>Upload image</button>
          <button type="button" className="a-btn" aria-pressed={mode === 'url'} onClick={() => setMode('url')}>Paste image URL</button>
        </div>
        {mode === 'upload'
          ? <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} aria-label="Upload image" />
          : <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" aria-label="Image URL" />}
        <div className="a-prev">{preview ? <img src={preview} alt="Preview" /> : <div className="ph">PREVIEW</div>}</div>

        <label htmlFor="f-link">Amazon affiliate link (required)</label>
        <input id="f-link" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.amazon.com/…" />

        <label htmlFor="f-cat">Category</label>
        <select id="f-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATS.map(([k, n]) => <option key={k} value={k}>{n}</option>)}
        </select>

        <label className="ck"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured product</label>
        <label className="ck"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Show on storefront</label>

        <div className="er" role="alert">{err}</div>
        <div className="btns" style={{ marginTop: 14 }}>
          <button className="b" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save Product'}</button>
          <button className="b o" type="button" onClick={onCancel} disabled={busy}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
