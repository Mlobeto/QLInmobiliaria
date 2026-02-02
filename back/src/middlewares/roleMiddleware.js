// Middleware para verificar roles específicos
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    // El role debe venir del authMiddleware que se ejecuta antes
    const userRole = req.role;

    if (!userRole) {
      return res.status(401).json({ 
        message: 'No se pudo verificar el rol del usuario' 
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para acceder a este recurso',
        requiredRole: allowedRoles,
        currentRole: userRole
      });
    }

    next();
  };
};

module.exports = { checkRole };
