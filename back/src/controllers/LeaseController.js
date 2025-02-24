const { Lease, Property, Client, ClientProperty, PaymentReceipt, Garantor } = require('../data');

exports.createLease = async (req, res) => {
    try {
      console.log('CreateLease - Received data:', req.body);
      
      const {
        propertyId,
        landlordId, 
        tenantId,
        startDate,
        rentAmount,
        updateFrequency,
        commission,
        totalMonths,
        inventory
      } = req.body;
      
      // Validación básica de campos obligatorios
      if (!propertyId || !landlordId || !tenantId || !startDate || !rentAmount || !totalMonths || !inventory) {
        return res.status(400).json({
          error: 'Datos incompletos',
          details: 'Los campos propertyId, landlordId, tenantId, startDate, rentAmount, totalMonths e inventory son obligatorios'
        });
      }
      
      // Parsear y validar
      const parsedData = {
        propertyId: parseInt(propertyId),
        landlordId: parseInt(landlordId),
        tenantId: parseInt(tenantId),
        startDate: new Date(startDate),
        rentAmount: parseFloat(rentAmount),
        updateFrequency,  // ENUM, se asume válido
        commission: commission ? parseFloat(commission) : null,
        totalMonths: parseInt(totalMonths),
        inventory
      };
  
      console.log('CreateLease - Parsed data:', parsedData);
  
      // Verificar existencia y disponibilidad de la propiedad
      const property = await Property.findByPk(parsedData.propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Propiedad no encontrada' });
      }
      if (!property.isAvailable) {
        return res.status(400).json({ error: 'La propiedad ya no está disponible' });
      }
      
      // Verificar que el landlord existe y tiene rol de propietario para esa propiedad
      const landlord = await Client.findByPk(parsedData.landlordId);
      if (!landlord) {
        return res.status(404).json({ error: 'Propietario no encontrado' });
      }
      const ownerRole = await ClientProperty.findOne({ 
        where: { clientId: parsedData.landlordId, propertyId: parsedData.propertyId, role: 'propietario' }
      });
      if (!ownerRole) {
        return res.status(400).json({ error: 'El cliente no tiene rol de propietario para esta propiedad' });
      }
      
      // Verificar que el tenant exista (opcional validar rol si fuera necesario)
      const tenant = await Client.findByPk(parsedData.tenantId);
      if (!tenant) {
        return res.status(404).json({ error: 'Inquilino no encontrado' });
      }
      
      // Crear el contrato
      const newLease = await Lease.create(parsedData);
      console.log('New Lease created:', newLease);
  
      // Actualizar la propiedad (marcarla como no disponible)
      await property.update({ isAvailable: false });
  
      res.status(201).json(newLease);
    } catch (error) {
      console.error('CreateLease Error:', error);
      res.status(500).json({ 
        error: 'Error al crear el contrato de alquiler', 
        details: error.message 
      });
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
