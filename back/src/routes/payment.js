const express = require('express');
const { 
  createPayment, 
  getPaymentsByIdClient, 
  getAllPayments, 
  getPaymentsByLeaseId,
  updatePayment,
  deletePayment
} = require('../controllers');
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Logs para todas las rutas de payment
router.use((req, res, next) => {
  console.log('💳 Payment Router:', {
    method: req.method,
    path: req.path,
    params: req.params
  });
  next();
});

router.post('/', createPayment);
// Solo admins pueden ver todos los pagos (requiere autenticación + rol admin)
router.get('/', authMiddleware, checkRole('admin'), getAllPayments);

// ⚠️ IMPORTANTE: Rutas específicas ANTES de rutas con parámetros genéricos
router.get('/lease/:leaseId', getPaymentsByLeaseId);
router.get('/client/:idClient', getPaymentsByIdClient);

// Rutas para actualizar y eliminar pagos (usuarios autenticados)
// Estas van al final porque /:id es muy genérico
router.put('/:id', authMiddleware, updatePayment);
router.delete('/:id', authMiddleware, deletePayment);


module.exports = router;