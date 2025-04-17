import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  [key: string]: any;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (user?.role === 'admin' || user?.role === 'viewer') {
    return <Navigate to="/dashboard" replace />;
  }

  if (user?.role === 'operator') {
    return <Navigate to="/operator" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
