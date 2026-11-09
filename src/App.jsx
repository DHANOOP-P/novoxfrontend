import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import toast from 'react-hot-toast';

import useAuthStore from './store/authStore';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import TaskBoardPage from './pages/TaskBoardPage';
import UsersPage from './pages/UsersPage';
import TasksPage from './pages/TasksPage';

import './App.css';

function App() {
  const { bootstrap, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    bootstrap().catch(() => toast.error('Session expired. Please log in again.'));
  }, [bootstrap]);

  const getDefaultDashboardPath = () => {
    if (user?.role === 'admin') return '/dashboard/overview';
    if (user?.role === 'manager') return '/dashboard/manager';
    if (user?.role === 'user') return '/dashboard/user';
    return '/dashboard';
  };

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={getDefaultDashboardPath()} replace />} />
        <Route
          path="overview"
          element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </RoleBasedRoute>
          }
        />
        <Route
          path="manager"
          element={
            <RoleBasedRoute allowedRoles={['manager']}>
              <ManagerDashboardPage />
            </RoleBasedRoute>
          }
        />
        <Route
          path="user"
          element={
            <RoleBasedRoute allowedRoles={['user']}>
              <UserDashboardPage />
            </RoleBasedRoute>
          }
        />
        <Route path="board" element={<TaskBoardPage />} />
        <Route
          path="users"
          element={
            <RoleBasedRoute allowedRoles={['admin', 'manager']}>
              <UsersPage />
            </RoleBasedRoute>
          }
        />
        <Route path="tasks" element={<TasksPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? getDefaultDashboardPath() : '/login'} replace />} />
    </Routes>
  );
}

export default App;
