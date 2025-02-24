const express = require('express');
const router = express.Router();
const { createSaleAuthorization } = require('../controllers/createSaleAuthorization');

router.post('/', createSaleAuthorization);

module.exports = router;