import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './state/AuthContext';
import { AppLayout } from './components/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { RequestsPage } from './pages/RequestsPage';
import { RequestFormPage } from './pages/RequestFormPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { RegistersPage } from './pages/RegistersPage';
import { RisksPage } from './pages/RisksPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner" /><span>กำลังตรวจสอบสิทธิ์...</span></div>;
  if (!user) return <LoginPage />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/new" element={<RequestFormPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />
        <Route path="/registers" element={<RegistersPage />} />
        <Route path="/risks" element={<RisksPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
