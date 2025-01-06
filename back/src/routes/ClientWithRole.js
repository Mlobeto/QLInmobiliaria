const express = require('express');
const { addPropertyToClientWithRole } = require('../controllers/addPropertyToClientWithRole');
const router = express.Router();

router.post('/addRole', addPropertyToClientWithRole);


module.exports = router;