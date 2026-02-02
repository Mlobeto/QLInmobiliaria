const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  console.log('🔐 authMiddleware - Authorization header:', authHeader ? 'Presente' : 'Ausente');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ authMiddleware - No se proporcionó token válido');
    return res.status(401).json({ message: 'Acceso denegado, se requiere token válido' });
  }

  const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"
  console.log('🔐 authMiddleware - Token extraído:', token ? 'Sí' : 'No');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.adminId = verified.id; // Asegúrate de que coincida con el payload del token
    req.role = verified.role; // Si necesitas el rol
    
    console.log('✅ authMiddleware - Token verificado:', {
      adminId: req.adminId,
      role: req.role
    });
    
    next();
  } catch (error) {
    console.log('❌ authMiddleware - Error al verificar token:', error.message);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
