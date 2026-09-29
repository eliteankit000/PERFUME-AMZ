import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AuthCallback() {
  const nav = useNavigate();
  const { loading } = useAuth(); // supabase-js exchanges the ?code= param during initialisation
  useEffect(() => { if (!loading) nav('/admin', { replace: true }); }, [loading, nav]);
  return <div className="a-login"><p>Signing you in…</p></div>;
}
