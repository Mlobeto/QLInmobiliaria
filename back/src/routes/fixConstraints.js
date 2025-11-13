const { Router } = require('express');
const { fixClientPropertyConstraints } = require('../controllers/fixConstraintsController');

const router = Router();

// Endpoint temporal para corregir constraints
router.post('/fix-client-property-constraints', fixClientPropertyConstraints);

module.exports = router;
