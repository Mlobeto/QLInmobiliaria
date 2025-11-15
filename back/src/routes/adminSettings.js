const express = require('express');
const router = express.Router();
const AdminSettingsController = require('../controllers/AdminSettingsController');

// Rutas de firma
router.get('/signature', AdminSettingsController.getSignature);
router.post('/signature', AdminSettingsController.saveSignature);
router.delete('/signature', AdminSettingsController.deleteSignature);

module.exports = router;
