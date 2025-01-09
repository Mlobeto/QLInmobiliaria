const express = require('express');
const clientController = require('../controllers');
const router = express.Router();


router.post('/addRole',clientController.addPropertyToClientWithRole);


module.exports = router;