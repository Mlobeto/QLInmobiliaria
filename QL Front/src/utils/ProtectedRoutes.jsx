import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  // Verificar si hay token en localStorage
  const token = localStorage.getItem('token');
  
  // Selecciona solo la parte necesaria del estado
  const adminInfo = useSelector((state) => state.adminInfo);

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si no hay adminInfo o no tiene rol, redirigir al login
  if (!adminInfo || !adminInfo.role) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol no es admin, redirigir a la página principal
  if (adminInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;