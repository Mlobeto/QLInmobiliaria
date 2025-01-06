const { Router } = require('express');
const { getAllProperties, getPropertiesByIdClient, createProperty, updateProperty, getFilteredProperties,  deleteProperty, getPropertiesByType } = require('../controllers');

const router = Router();

router.get('/', getAllProperties);
router.get('/client/:idClient', getPropertiesByIdClient);
router.post('/', createProperty);
router.put('/:propertyId', updateProperty);
router.get('/type/:type', getPropertiesByType);
router.delete('/:propertyId', deleteProperty);
router.get('/filter', getFilteredProperties);
router.get('/all', getAllProperties);

module.exports = router;
