import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const RoleBasedRoute = ({ children, allowedRoles = ['admin'] }) => {
  const adminInfo = useSelector((state) => state.adminInfo);

  // Si no hay información del admin, redirigir al login
  if (!adminInfo || !adminInfo.token) {
    return <Navigate to="/" />;
  }

  // Si el usuario no tiene rol o su rol no está permitido
  if (!adminInfo.role || !allowedRoles.includes(adminInfo.role)) {
    return <Navigate to="/panel" />;
  }

  return children;
};

export default RoleBasedRoute;
