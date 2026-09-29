import { supabase } from './supabase';

// Fire-and-forget: never blocks or breaks the visitor's trip to Amazon.
export function trackClick(productId) {
  try {
    supabase?.rpc('track_click', { p_product_id: productId }).then(
      ({ error }) => { if (error) console.warn('[scente] click tracking failed:', error.message); },
      () => {}
    );
  } catch { /* ignore */ }
}
