import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { signInWithGoogle } from '../lib/auth';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function Admin() {
  const { user, loading, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'robots'; m.content = 'noindex, nofollow';
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  if (loading) return <div className="a-login"><p>Loading…</p></div>;

  if (!user) {
    return (
      <div className="a-login"><div className="box">
        <div className="logo">SCENTÉ</div>
        <h1>Collection admin</h1>
        <p>Sign in with the authorized Google account to manage your fragrance collection.</p>
        <button className="b" onClick={() => signInWithGoogle().catch((e) => console.error(e))}>Continue with Google</button>
      </div></div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="a-login"><div className="box">
        <div className="logo">SCENTÉ</div>
        <h1>Access denied.</h1>
        <p>This account is not authorized to manage the collection.</p>
        <button className="b o" onClick={signOut}>Sign out</button>
      </div></div>
    );
  }
  return <AdminDashboard email={user.email} onSignOut={signOut} />;
}
