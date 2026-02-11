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

router.post('/', createPayment);
// Solo admins pueden ver todos los pagos (requiere autenticación + rol admin)
router.get('/', authMiddleware, checkRole('admin'), getAllPayments);
router.get('/lease/:leaseId', getPaymentsByLeaseId);
router.get('/client/:idClient', getPaymentsByIdClient);
// Rutas para actualizar y eliminar pagos (usuarios autenticados)
router.put('/:id', authMiddleware, updatePayment);
router.delete('/:id', authMiddleware, deletePayment);


module.exports = router;