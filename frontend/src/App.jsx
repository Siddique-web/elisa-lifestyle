import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AdminLayout from './admin/components/AdminLayout';
import AdminAppointmentsPage from './admin/pages/AdminAppointmentsPage';
import AdminStaffPage from './admin/pages/AdminStaffPage';
import AdminReportsPage from './admin/pages/AdminReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminAppointmentsPage />} />
          <Route path="equipa" element={<AdminStaffPage />} />
          <Route path="relatorios" element={<AdminReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
