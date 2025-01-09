const { Lease, Property, Client, ClientProperty, PaymentReceipt, Garantor } = require('../data');

exports.createLease = async (req, res) => {
    try {
        const { propertyId, ownerId, tenantId, ...leaseData } = req.body;

        // Verificar que la propiedad existe y está disponible
        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        if (!property.isAvailable) {
            return res.status(400).json({ error: 'La propiedad ya no está disponible' });
        }

        // Verificar que el propietario existe y tiene rol propietario para esta propiedad
        const owner = await Client.findByPk(ownerId);
        if (!owner) {
            return res.status(404).json({ error: 'Propietario no encontrado' });
        }
        const ownerRole = await ClientProperty.findOne({
            where: { clientId: ownerId, propertyId, role: 'propietario' },
        });
        if (!ownerRole) {
            return res.status(400).json({ error: 'El cliente no tiene el rol de propietario para esta propiedad' });
        }

        // Verificar que el inquilino existe
        const tenant = await Client.findByPk(tenantId);
        if (!tenant) {
            return res.status(404).json({ error: 'Inquilino no encontrado' });
        }
        const tenantRole = await ClientProperty.findOne({
            where: { clientId: tenantId, propertyId, role: 'inquilino' },
        });
        if (!tenantRole) {
            return res.status(400).json({ error: 'El cliente no tiene el rol de inquilino para esta propiedad' });
        }

        // Crear el contrato de alquiler con ambos clientes
        const newLease = await Lease.create({ propertyId, ownerId, tenantId, ...leaseData });

        // Marcar la propiedad como no disponible
        await property.update({ isAvailable: false });

        res.status(201).json(newLease);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el contrato de alquiler', details: error.message });
    }
};



exports.getLeasesByIdClient = async (req, res) => {
    try {
        const { idClient } = req.params;

        const leases = await Lease.findAll({
            where: { tenantId: idClient }, // Cambia tenantId si el campo tiene otro nombre.
            include: [
                Property,
                { model: PaymentReceipt, required: false }, // Opcional
                { model: Garantor, required: false } // Opcional
            ],
        });

        if (!leases.length) {
            return res.status(404).json({ error: 'No se encontraron contratos para este cliente' });
        }

        res.status(200).json(leases);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener contratos', details: error.message });
    }
};


exports.terminateLease = async (req, res) => {
    try {
        const { leaseId } = req.params;

        // Buscar el contrato de alquiler
        const lease = await Lease.findByPk(leaseId);
        if (!lease) {
            return res.status(404).json({ error: 'Contrato de alquiler no encontrado' });
        }

        // Buscar la propiedad asociada al contrato
        const property = await Property.findByPk(lease.propertyId);
        if (!property) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }

        // Actualizar la propiedad para marcarla como disponible
        await property.update({ isAvailable: true });

        // Marcar el contrato como terminado
        await lease.update({ status: 'terminated' });

        res.status(200).json({ message: 'Contrato terminado y propiedad marcada como disponible' });
    } catch (error) {
        res.status(500).json({ error: 'Error al terminar el contrato de alquiler', details: error.message });
    }
};
