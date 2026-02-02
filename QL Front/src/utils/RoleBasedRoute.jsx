import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const RoleBasedRoute = ({ children, allowedRoles = ['admin'] }) => {
  const adminInfo = useSelector((state) => state.adminInfo);
  const token = useSelector((state) => state.token);

  // Debug: ver qué contiene adminInfo
  console.log('RoleBasedRoute - adminInfo:', adminInfo);
  console.log('RoleBasedRoute - token:', token ? 'Presente' : 'Ausente');
  console.log('RoleBasedRoute - allowedRoles:', allowedRoles);

  // Si no hay información del admin o token, redirigir al login
  if (!adminInfo || !token) {
    console.log('RoleBasedRoute - No hay token o adminInfo, redirigiendo a /');
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
