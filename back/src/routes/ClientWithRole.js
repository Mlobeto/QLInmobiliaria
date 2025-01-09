const express = require('express');
const { addPropertyToClientWithRole } = require('../controllers/addPropertyToClientController');
const router = express.Router();


router.post('/addRole', addPropertyToClientWithRole);


module.exports = router;