import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const PrivateRoute = ({
  element,
  allowedRoles,
}: {
  element: JSX.Element;
  allowedRoles: string[];
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return element;
};

export default PrivateRoute;
