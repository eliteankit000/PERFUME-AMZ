import { supabase } from './supabase';

const BUCKET = 'product-images';
// Public columns only (click_count is not readable by anonymous visitors).
const PUBLIC_COLS = 'id,name,image_url,affiliate_url,category,featured,active,sort_order';

export const isHttps = (u) => { try { return new URL(u).protocol === 'https:'; } catch { return false; } };

export async function fetchPublicProducts() {
  const { data, error } = await supabase.from('products').select(PUBLIC_COLS)
    .eq('active', true).order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
export async function fetchAdminProducts() {
  const { data, error } = await supabase.from('products').select('*')
    .order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
export async function createProduct(values, existing) {
  const next = existing.reduce((m, p) => Math.max(m, p.sort_order ?? 0), -1) + 1;
  const { error } = await supabase.from('products').insert({ ...values, sort_order: next });
  if (error) throw error;
}
export async function updateProduct(id, patch) {
  const { error } = await supabase.from('products').update(patch).eq('id', id);
  if (error) throw error;
}
export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
export async function reorderProducts(list) {
  const jobs = list.map((p, i) => (p.sort_order === i ? null : supabase.from('products').update({ sort_order: i }).eq('id', p.id)));
  const results = await Promise.all(jobs.filter(Boolean));
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}

/* ---------- images ---------- */
const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
export function validateImageFile(file) {
  if (!TYPES[file.type]) return 'Use a JPG, PNG, or WebP image.';
  if (file.size > 5 * 1024 * 1024) return 'Image must be 5 MB or smaller.';
  return '';
}
export async function uploadImage(file) {
  const path = `${crypto.randomUUID()}.${TYPES[file.type]}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
const storagePath = (url) => {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = (url || '').indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
};
// Deletes an uploaded image only if no product still references it.
export async function removeImageIfOrphan(url) {
  const path = storagePath(url);
  if (!path) return;
  const { count, error } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('image_url', url);
  if (error || count > 0) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
