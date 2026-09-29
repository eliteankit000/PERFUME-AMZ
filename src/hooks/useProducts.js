import { useCallback, useEffect, useState } from 'react';
import { fetchAdminProducts, fetchPublicProducts } from '../lib/products';

export default function useProducts(admin = false) {
  const [state, set] = useState({ products: [], loading: true, error: null });
  const load = useCallback(async () => {
    try {
      const products = await (admin ? fetchAdminProducts() : fetchPublicProducts());
      set({ products, loading: false, error: null });
    } catch (e) {
      console.error('[scente] failed to load products:', e);
      set((s) => ({ ...s, loading: false, error: e }));
    }
  }, [admin]);
  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
}
