const { Lease, Property, Client, ClientProperty, PaymentReceipt, Garantor, RentUpdate } = require('../data');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Function to decode base64 string to buffer
function decodeBase64(dataString) {
  try {
    // Verificar si el string comienza con el prefijo esperado
    const base64Data = dataString.startsWith('data:application/pdf;base64,')
      ? dataString.slice('data:application/pdf;base64,'.length)
      : dataString; // Si no comienza con el prefijo, usar el string completo

    // Decodificar el string Base64
    const buffer = Buffer.from(base64Data, 'base64');
    return buffer;
  } catch (error) {
    console.error('decodeBase64 - Error al decodificar Base64:', error);
    throw new Error('Error al decodificar la cadena Base64');
  }
}

exports.savePdf = async (req, res) => {
  try {
    console.log('savePdf - Received data:', req.body);

    const { pdfData, fileName, leaseId } = req.body;

    if (!pdfData || !fileName || !leaseId) {
      return res.status(400).json({
        error: 'Datos incompletos',
        details: 'Los campos pdfData, fileName y leaseId son obligatorios'
      });
    }

    // Decode base64 string
    const buffer = decodeBase64(pdfData);

    // Define the path where the PDF will be saved
    const pdfDirectory = path.join(__dirname, '../../pdfs'); // Directory relative to the controller
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true }); // Create directory if it doesn't exist
    }
    const filePath = path.join(pdfDirectory, fileName);

    // Save the PDF to a file
    fs.writeFile(filePath, buffer, async (err) => {
      if (err) {
        console.error('savePdf - Error al guardar el PDF:', err);
        return res.status(500).json({
          error: 'Error al guardar el PDF',
          details: err.message
        });
      }

      console.log('savePdf - PDF guardado exitosamente en:', filePath);

      // Update the Lease model with the pdfPath
      try {
        const lease = await Lease.findByPk(leaseId);
        if (!lease) {
          console.error('savePdf - Contrato no encontrado');
          return res.status(404).json({
            error: 'Contrato no encontrado',
            details: 'No se encontró el contrato con el ID proporcionado'
          });
        }

        await lease.update({ pdfPath: filePath });
        console.log('savePdf - pdfPath actualizado en el contrato');

        return res.status(200).json({
          message: 'PDF guardado exitosamente y contrato actualizado',
          filePath: filePath
        });
      } catch (updateError) {
        console.error('savePdf - Error al actualizar el contrato:', updateError);
        return res.status(500).json({
          error: 'Error al actualizar el contrato',
          details: updateError.message
        });
      }
    });
  } catch (error) {
    console.error('savePdf - Error:', error);
    res.status(500).json({
      error: 'Error al guardar el PDF',
      details: error.message
    });
  }
};


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

    // Recuperar el contrato con todas las asociaciones necesarias
    const fullLease = await Lease.findByPk(newLease.id, {
      include: [
        { model: Property },
        { model: PaymentReceipt, required: false },
        { model: Garantor, required: false },
        { model: Client, as: 'Tenant', attributes: ['name', 'cuil', 'direccion','ciudad','provincia'] },
        { model: Client, as: 'Landlord', attributes: ['name', 'cuil', 'direccion','ciudad','provincia','mobilePhone'] }
      ]
    });

    res.status(201).json(fullLease);
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
            where: { tenantId: idClient },
            include: [
                Property,
                { model: PaymentReceipt, required: false },
                { model: Garantor, required: false },
                { model: Client, as: 'Tenant', attributes: ['name'] } ,
                { model: Client, as: 'Landlord', attributes: ['name'] }
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


// Endpoint para obtener un contrato por leaseId
exports.getLeaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const lease = await Lease.findOne({ id }); 
    include: [
                Property,
                { model: PaymentReceipt, required: false },
                { model: Garantor, required: false },
                { model: Client, as: 'Tenant', attributes: ['name'] } ,
                { model: Client, as: 'Landlord', attributes: ['name'] }]

    if (!lease) {
      return res.status(404).json({ message: "Contrato no encontrado" });
    }
    res.json(lease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el contrato" });
  }
}





exports.terminateLease = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el contrato de alquiler
        const lease = await Lease.findByPk(id);
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

exports.getAllLeases = async (req, res) => {
  try {
    const leases = await Lease.findAll({
      include: [
        Property,
        { model: PaymentReceipt, required: false },
        { model: Garantor, required: false },
        { model: Client, as: 'Tenant', attributes: ['name'] },
        { model: Client, as: 'Landlord', attributes: ['name'] }
      ],
    });

    const leasesWithNextUpdate = leases.map(lease => ({
      ...lease.toJSON(),
      nextUpdateDate: getNextUpdateDate(lease.startDate, lease.updateFrequency, lease.updatedAt)
    }));

    res.status(200).json(leasesWithNextUpdate); // <-- Devuelve los leases CON nextUpdateDate
  } catch (error) {
    console.error("Error al obtener contratos:", error);
    res.status(500).json({ error: "Error al obtener contratos", details: error.message });
  }
};

exports.checkPendingPayments = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Mes actual (1-12)
    const currentYear = today.getFullYear();

    // Buscar contratos activos
    const activeLeases = await Lease.findAll({
      where: { status: { [Op.ne]: 'terminated' } }, // Contratos que no están terminados
      include: [
        {
          model: PaymentReceipt,
          required: false,
          where: {
            [Op.and]: [
              { periodMonth: currentMonth },
              { periodYear: currentYear },
            ],
          },
        },
        { model: Client, as: 'Tenant', attributes: ['name'] },
        { model: Client, as: 'Landlord', attributes: ['name'] },
      ],
    });

    // Filtrar contratos que no tienen pagos registrados para el mes actual
    const pendingPayments = activeLeases.filter(
      (lease) => lease.PaymentReceipts.length === 0
    );

    if (pendingPayments.length === 0) {
      return res.status(200).json({ message: 'No hay pagos pendientes.' });
    }

    res.status(200).json({
      message: 'Pagos pendientes encontrados.',
      pendingPayments: pendingPayments.map((lease) => ({
        leaseId: lease.id,
        tenantName: lease.Tenant.name,
        landlordName: lease.Landlord.name,
        propertyId: lease.propertyId,
        rentAmount: lease.rentAmount,
      })),
    });
  } catch (error) {
    console.error('Error al verificar pagos pendientes:', error);
    res.status(500).json({
      error: 'Error al verificar pagos pendientes.',
      details: error.message,
    });
  }
};

function calculateUpdatePeriod(startDate, updateFrequency, updateDate) {
  const start = new Date(startDate);
  const update = new Date(updateDate);
  let monthsSinceStart = (update.getFullYear() - start.getFullYear()) * 12;
  monthsSinceStart -= start.getMonth();
  monthsSinceStart += update.getMonth();

  let period = '';
  switch (updateFrequency) {
      case 'semestral':
          const semester = Math.floor(monthsSinceStart / 6) + 1;
          period = `Semestre ${semester}`;
          break;
      case 'cuatrimestral':
          const trimester = Math.floor(monthsSinceStart / 4) + 1;
          period = `Cuatrimestre ${trimester}`;
          break;
      case 'anual':
          const year = Math.floor(monthsSinceStart / 12) + 1;
          period = `Año ${year}`;
          break;
      default:
          period = 'Desconocido';
  }
  return period;
}

function getNextUpdateDate(startDate, updateFrequency, updatedAt) {
  let freqMonths = 0;
  if (updateFrequency === 'semestral') freqMonths = 6;
  else if (updateFrequency === 'cuatrimestral') freqMonths = 4;
  else if (updateFrequency === 'anual') freqMonths = 12;

  const baseDate = updatedAt ? new Date(updatedAt) : new Date(startDate);
  let nextUpdate = new Date(baseDate);

  while (nextUpdate <= new Date()) {
    nextUpdate.setMonth(nextUpdate.getMonth() + freqMonths);
  }
  return nextUpdate;
}

exports.updateRentAmount = async (req, res) => {
  try {
      const { id } = req.params;
      const { newRentAmount, updateDate, pdfData, fileName } = req.body; // Recibe newRentAmount, updateDate, pdfData y fileName

      if (!newRentAmount || !updateDate || !pdfData || !fileName) {
          return res.status(400).json({ error: 'El nuevo monto de alquiler, la fecha de actualización, el PDF y el nombre del archivo son obligatorios.' });
      }

      const lease = await Lease.findByPk(id);

      if (!lease) {
          return res.status(404).json({ error: 'Contrato no encontrado.' });
      }

      const oldRentAmount = lease.rentAmount;

      // Calcula el período de actualización
      const period = calculateUpdatePeriod(lease.startDate, lease.updateFrequency, updateDate);

      // Define the path where the PDF will be saved
      const pdfDirectory = path.join(__dirname, '../../pdfs');
      if (!fs.existsSync(pdfDirectory)) {
          fs.mkdirSync(pdfDirectory, { recursive: true });
      }
      const filePath = path.join(pdfDirectory, fileName);

      // Decode base64 string
      const buffer = decodeBase64(pdfData);

      // Guardar el PDF en el sistema de archivos
      fs.writeFileSync(filePath, buffer);

      // Crear el registro en el modelo RentUpdate
      await RentUpdate.create({
          leaseId: id,
          updateDate: updateDate,
          oldRentAmount: oldRentAmount,
          newRentAmount: newRentAmount,
          period: period,
          pdfPath: filePath,
      });

      // Actualizar el monto del alquiler en el modelo Lease
      lease.rentAmount = newRentAmount;
      await lease.save();

      res.status(200).json({ message: 'Monto de alquiler actualizado con éxito.', lease });

  } catch (error) {
      console.error('Error al actualizar el monto del alquiler:', error);
      res.status(500).json({ error: 'Error al actualizar el monto del alquiler.', details: error.message });
  }
};