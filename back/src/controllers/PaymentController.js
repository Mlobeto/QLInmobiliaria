const { PaymentReceipt, Lease, Client } = require('../data');

exports.createPayment = async (req, res) => {
    try {
        const {
          idClient,
          leaseId,
          paymentDate,
          amount,
          period,
          installmentNumber,
          totalInstallments,
        } = req.body;
    
        // Validación previa
        if (!idClient || !leaseId || !paymentDate || !amount || !period || !installmentNumber || !totalInstallments) {
          return res.status(400).json({ error: 'Faltan datos obligatorios.' });
        }
    
        // Creación del pago
        const newPaymentReceipt = await PaymentReceipt.create({
          idClient,
          leaseId,
          paymentDate,
          amount,
          period,
          installmentNumber,
          totalInstallments,
        });
    
        res.status(201).json(newPaymentReceipt);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: 'Error al crear el pago',
          details: error.message,
        });
      }
    };

    
exports.getPaymentsByIdClient = async (req, res) => {
    try {
        const { idClient } = req.params;

        const payments = await PaymentReceipt.findAll({
            where: { idClient },
            include: [
                {
                    model: Lease,
                    include: [{ model: Property }], // Detalles de la propiedad si es necesario
                },
            ],
        });

        if (!payments.length) {
            return res.status(404).json({ error: 'No se encontraron pagos para este cliente' });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pagos', details: error.message });
    }
};
exports.getPaymentsByLeaseId = async (req, res) => {
    try {
        const { leaseId } = req.params;

        const payments = await PaymentReceipt.findAll({
            where: { leaseId },
            include: [
                { model: Client }, // Incluye información del cliente
                { model: Lease },  // Incluye información del contrato
            ],
        });

        if (!payments.length) {
            return res.status(404).json({ error: 'No se encontraron pagos para este contrato' });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pagos', details: error.message });
    }
};

