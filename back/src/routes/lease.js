const express = require('express');
const { createLease, getLeasesByIdClient, getLeaseById, getAllLeases, terminateLease, savePdf, updateRentAmount } = require('../controllers');
const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
    console.log('Lease Route:', {
        method: req.method,
        path: req.path,
        body: req.body
    });
    next();
});

// POST route for creating a new lease
router.post('/', createLease);
router.post('/savePdf', savePdf);
// GET routes
router.get('/client/:idClient', getLeasesByIdClient);
router.get('/all', getAllLeases);
router.put('/:id/terminate', terminateLease); // Changed to PUT for terminating
router.get('/:id', getLeaseById); // Added route to get lease by ID
router.put('/leases/:id/rent', updateRentAmount) 

module.exports = router;