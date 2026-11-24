import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./lib/auth";
import { configured } from "./lib/supabase";
import Layout from "./components/Layout";
import AuthForm from "./components/AuthForm";
import Dashboard from "./pages/Dashboard";
import UpdatePassword from "./pages/UpdatePassword";
import ComingSoon from "./pages/ComingSoon";
import { NAV } from "./components/Nav";

function Protected() {
  const { session, loading } = useAuth();
  if (loading) return <p className="p-10 text-center text-mute">Yükleniyor…</p>;
  return session ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
}
function PublicOnly() {
  const { session, loading } = useAuth();
  if (loading) return <p className="p-10 text-center text-mute">Yükleniyor…</p>;
  return session ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function App() {
  if (!configured) return (
    <main className="grid min-h-screen place-items-center p-4"><div className="card max-w-lg">
      <h1 className="text-2xl">Yapılandırma eksik</h1>
      <p className="mt-2">Uygulama derlendi ama Supabase bağlantısı yok. GitHub'da <b>Settings → Secrets and variables → Actions</b> altına
        <code> VITE_SUPABASE_URL </code> ve <code> VITE_SUPABASE_ANON_KEY </code> ekle, sonra workflow'u yeniden çalıştır.</p>
      <p className="mt-4 text-xs text-mute">Lunumi v3 · build {__BUILD_SHA__}</p>
    </div></main>
  );
  return (
    <Routes>
      <Route element={<PublicOnly />}>
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/signup" element={<AuthForm mode="signup" />} />
        <Route path="/reset" element={<AuthForm mode="reset" />} />
      </Route>
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        {NAV.filter((n) => !n.ready).map((n) => <Route key={n.to} path={n.to} element={<ComingSoon title={n.label} />} />)}
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
