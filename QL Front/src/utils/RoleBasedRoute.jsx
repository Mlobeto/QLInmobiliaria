import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const RoleBasedRoute = ({ children, allowedRoles = ['admin'] }) => {
  const adminInfo = useSelector((state) => state.adminInfo);

  // Debug: ver qué contiene adminInfo
  console.log('RoleBasedRoute - adminInfo:', adminInfo);
  console.log('RoleBasedRoute - allowedRoles:', allowedRoles);

  // Si no hay información del admin, redirigir al login
  if (!adminInfo || !adminInfo.token) {
    console.log('RoleBasedRoute - No hay token, redirigiendo a /');
    return <Navigate to="/" />;
  }

  // Si el usuario no tiene rol o su rol no está permitido
  if (!adminInfo.role || !allowedRoles.includes(adminInfo.role)) {
    console.log('RoleBasedRoute - Rol no permitido:', adminInfo.role, 'Roles permitidos:', allowedRoles);
    return <Navigate to="/panel" />;
  }

  console.log('RoleBasedRoute - Acceso permitido');
  return children;
};

export default RoleBasedRoute;
