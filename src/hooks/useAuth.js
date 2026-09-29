import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchRole, signOut } from '../lib/auth';
import { ADMIN_EMAIL } from '../lib/constants';

export default function useAuth() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState(undefined); // undefined = unknown, null = no profile

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  useEffect(() => {
    let off = false;
    if (!user) { setRole(undefined); return; }
    setRole(undefined);
    fetchRole(user.id).then((r) => { if (!off) setRole(r); });
    return () => { off = true; };
  }, [user?.id]);

  const loading = !ready || (!!user && role === undefined);
  // Client check is for UX only; RLS is what actually protects the data.
  const isAdmin = !!user && role === 'admin' && user.email?.toLowerCase() === ADMIN_EMAIL;
  return { user, loading, isAdmin, signOut };
}
