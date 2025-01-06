const { Lease, Property, Client } = require('../data');

exports.createLease = async (req, res) => {
    try {
        const { idClient, propertyId, ...leaseData } = req.body;

        // Verificar que la propiedad existe y está disponible
        const property = await Property.findByPk(propertyId);
        if (!property) {
            return res.status(404).json({ error: 'Propiedad no encontrada' });
        }
        if (!property.isAvailable) {
            return res.status(400).json({ error: 'La propiedad ya no está disponible' });
        }

        // Verificar que el cliente existe
        const client = await Client.findByPk(idClient);
        if (!client) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Crear el contrato de alquiler
        const newLease = await Lease.create({ idClient, propertyId, ...leaseData });

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
            where: { idClient },
            include: [Property],
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

        // (Opcional) Eliminar el contrato de alquiler o marcarlo como terminado
        await lease.destroy();

        res.status(200).json({ message: 'Contrato terminado y propiedad marcada como disponible' });
    } catch (error) {
        res.status(500).json({ error: 'Error al terminar el contrato de alquiler', details: error.message });
    }
};
