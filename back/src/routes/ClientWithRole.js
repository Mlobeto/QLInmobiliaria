const express = require('express');
const { addPropertyToClientWithRole } = require('../controllers');
const router = express.Router();


router.post('/addRole', addPropertyToClientWithRole);


module.exports = router;