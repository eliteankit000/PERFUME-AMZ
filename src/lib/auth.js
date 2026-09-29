import { supabase } from './supabase';

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
export const signOut = () => supabase.auth.signOut();

export async function fetchRole(userId) {
  const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  if (error) { console.error('[scente] role lookup failed:', error.message); return null; }
  return data?.role ?? null;
}
