const express = require('express');
const { createGarantorsForLease,  getGarantorsByLeaseId, updateGarantor } = require('../controllers');
const router = express.Router();

router.post('/', createGarantorsForLease);

router.get('/:leaseId', getGarantorsByLeaseId);
router.put('/:garantorId', updateGarantor);

module.exports = router;