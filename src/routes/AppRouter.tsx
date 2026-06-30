import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../layout/AppLayout';
import DashboardPage from '../pages/DashboardPage';
import TasksPage from '../pages/TasksPage';
import IncidentsPage from '../pages/IncidentsPage';
import CamerasPage from '../pages/CamerasPage';
import WorkOrdersPage from '../pages/WorkOrdersPage';
import ShiftsPage from '../pages/ShiftsPage';
import LoginPage from '../pages/LoginPage';

function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<Navigate to="/login" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="incidents" element={<IncidentsPage />} />
          <Route path="cameras" element={<CamerasPage />} />
          <Route path="work-orders" element={<WorkOrdersPage />} />
          <Route path="shifts" element={<ShiftsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
