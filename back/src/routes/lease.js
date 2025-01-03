const express = require('express');
const { createLease, getLeasesByIdClient, terminateLease} = require('../controllers');
const router = express.Router();

router.post('/', createLease);
router.get('/:idClient', getLeasesByIdClient);
router.get('/:leaseId', terminateLease);


module.exports = router;