const express = require('express');
const { createPayment, getPaymentsByIdClient, getPaymentsByLeaseId } = require('../controllers');
const router = express.Router();

router.post('/', createPayment);
router.get('/:leaseId', getPaymentsByLeaseId);
router.get('/:idClient', getPaymentsByIdClient);


module.exports = router;