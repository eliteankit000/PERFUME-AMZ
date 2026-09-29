import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { envMissing } from './lib/supabase';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';

function EnvError() {
  return (
    <div className="a-env">
      <h1>Supabase is not configured</h1>
      <p>Copy <code>.env.example</code> to <code>.env</code> and set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>, then restart <code>npm run dev</code>. On Vercel, add both under Project → Settings → Environment Variables and redeploy.</p>
    </div>
  );
}

export default function App() {
  if (envMissing) return <EnvError />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
