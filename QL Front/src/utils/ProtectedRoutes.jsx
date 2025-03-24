import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  // Obtenemos el rol del usuario desde Redux
  const adminInfo = useSelector((state) => state.adminInfo);

  // Si adminInfo es null o undefined, redirigimos al login
  if (!adminInfo || !adminInfo.role) {
    return <Navigate to="/login" />;
  }

  // Si el usuario no es administrador, lo redirigimos a la página principal
  if (adminInfo.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Si es administrador, muestra la ruta protegida (el panel)
  return children;
};

export default ProtectedRoute;