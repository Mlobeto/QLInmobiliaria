// Middleware para verificar roles específicos
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // El role debe venir del authMiddleware que se ejecuta antes
    const userRole = req.role;

    console.log('🔒 roleMiddleware - Verificando rol');
    console.log('🔒 roleMiddleware - Rol del usuario:', userRole);
    console.log('🔒 roleMiddleware - Roles permitidos:', allowedRoles);

    if (!userRole) {
      console.log('❌ roleMiddleware - No se pudo verificar el rol del usuario');
      return res.status(401).json({ 
        message: 'No se pudo verificar el rol del usuario' 
      });
    }

    if (!allowedRoles.includes(userRole)) {
      console.log('❌ roleMiddleware - Rol no permitido:', userRole);
      return res.status(403).json({ 
        message: 'No tienes permisos para acceder a este recurso',
        requiredRole: allowedRoles,
        currentRole: userRole
      });
    }

    console.log('✅ roleMiddleware - Acceso permitido');
    next();
  };
};

module.exports = { checkRole };
