import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Asumiendo que el hook useAuth está definido en tu aplicación

interface ProtectedRouteProps {
  children: React.ReactNode;
  [key: string]: any;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />; // Si es admin, redirigir al dashboard
  }

  if (user?.role === 'operator') {
    return <Navigate to="/operator" replace />; 
  }

  return <>{children}</>; 
};

export default ProtectedRoute;