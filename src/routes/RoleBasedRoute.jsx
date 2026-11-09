import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleBasedRoute;
