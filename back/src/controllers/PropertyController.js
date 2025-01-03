const { Client, Property, ClientProperty } = require('../data');

// POST: Crear una propiedad
exports.createProperty = async (req, res) => {
    try {
        const { address, neighborhood, city, type, typeProperty, price, images,  comision, escritura } = req.body;

        // Validación básica
        if (!address || !neighborhood || !city || !type || !typeProperty || !price || !images  || !escritura || !comision) {
            return res.status(400).json({
                error: 'Faltan datos requeridos',
                details: 'Por favor asegúrese de que todos los campos estén completos, incluido el idClient del cliente.'
            });
        }

        // Validación de tipo de precio
        if (isNaN(price)) {
            return res.status(400).json({
                error: 'El precio debe ser un número válido',
                details: `Precio recibido: ${price}`
            });
        }

        // Crear la propiedad
        const newProperty = await Property.create({
            address,
            neighborhood,
            city,
            type,
            typeProperty,
            price,
            images,
            comision,
            escritura
        });

        // Buscar al cliente por su idClient
        
        // Responder con la propiedad creada
        res.status(201).json(newProperty);

    } catch (error) {
        console.error('Error al crear propiedad:', error);
        res.status(500).json({
            error: 'Error al crear la propiedad',
            details: error.message,
            stack: error.stack
        });
    }
};


// GET: Obtener todas las propiedades de un cliente
exports.getPropertiesByIdClient = async (req, res) => {
    try {
        const { idClient } = req.params;
        const client = await Client.findByPk(idClient, {
            include: Property,
        });
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(client.Properties);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las propiedades del cliente', details: error.message });
    }
};


exports.getPropertiesByType = async (req, res) => {
    try {
        const { type } = req.params;
        if (!['venta', 'alquiler'].includes(type)) {
            return res.status(400).json({ error: 'Tipo inválido. Debe ser "venta" o "alquiler".' });
        }

        const properties = await Property.findAll({ where: { type } });
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las propiedades por tipo', details: error.message });
    }
};

// PUT: Actualizar una propiedad
exports.updateProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const updated = await Property.update(req.body, { where: { propertyId } });
        if (!updated[0]) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        res.status(200).json({ message: 'Propiedad actualizada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la propiedad', details: error.message });
    }
};

// DELETE: Eliminar una propiedad
exports.deleteProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const deleted = await Property.destroy({ where: { propertyId } });
        if (!deleted) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        res.status(200).json({ message: 'Propiedad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la propiedad', details: error.message });
    }
};

exports.getFilteredProperties = async (req, res) => {
    try {
        const { 
            type, 
            city, 
            neighborhood, 
            priceMin, 
            priceMax, 
            rooms, 
            typeProperty 
        } = req.query;


        const where = {};

        if (type) where.type = type; // Venta o alquiler
        if (typeProperty) where.typeProperty = typeProperty; // Casa, departamento, etc.
        if (city) where.city = city;
        if (neighborhood) where.neighborhood = neighborhood;
        if (priceMin || priceMax) {
            where.price = {};
            if (priceMin) where.price[Sequelize.Op.gte] = priceMin;
            if (priceMax) where.price[Sequelize.Op.lte] = priceMax;
        }
        if (rooms) where.rooms = rooms;

        const properties = await Property.findAll({ where });

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ error: 'Error al filtrar las propiedades', details: error.message });
    }
};
