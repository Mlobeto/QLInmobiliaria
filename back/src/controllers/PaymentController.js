const { PaymentReceipt, Lease, Client, Property } = require('../data');

exports.createPayment = async (req, res) => {
    try {
      const {
        idClient,
        leaseId,
        paymentDate,
        amount,
        period,
        type, // "installment", "commission" o "initial"
        installmentNumber, // opcional para "installment"
        totalInstallments, // opcional para "installment"
      } = req.body;
  
      // Validación previa básica
      if (!idClient || !leaseId || !paymentDate || !amount || !type) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
      }

      // Validar que period exista para installment y commission
      if ((type === 'installment' || type === 'commission') && !period) {
        return res.status(400).json({ error: 'El período es requerido para cuotas y comisiones.' });
      }

      // Generar período automáticamente para pagos iniciales si no se proporciona
      let finalPeriod = period;
      if (type === 'initial' && !period) {
        const fecha = new Date(paymentDate);
        const mes = fecha.toLocaleDateString('es-AR', { month: 'long' });
        const año = fecha.getFullYear();
        finalPeriod = `Pago Inicial - ${mes} ${año}`;
      }
  
      // Validar que solo exista un pago inicial por contrato
      if (type === "initial") {
        const existingInitial = await PaymentReceipt.findOne({
          where: { leaseId, type: 'initial' },
        });
        if (existingInitial) {
          return res.status(400).json({ 
            error: 'Ya existe un pago inicial para este contrato. Solo se permite un pago inicial por contrato.' 
          });
        }
      }
  
      let finalInstallmentNumber = null;
      let finalTotalInstallments = null;
  
      if (type === "installment") {
        // Si es cuota, se requiere calcular o recibir installmentNumber y totalInstallments.
        // Podés calcular el número siguiente si no lo pasás desde el front:
        const lastReceipt = await PaymentReceipt.findOne({
          where: { leaseId, type: 'installment' },
          order: [['installmentNumber', 'DESC']],
        });
        finalInstallmentNumber = lastReceipt ? lastReceipt.installmentNumber + 1 : 1;
  
        // Si totalInstallments se envía, se puede usar, o de lo contrario puede venir del contrato.
        if (totalInstallments) {
          finalTotalInstallments = totalInstallments;
        } else {
          // Aquí podrías, por ejemplo, consultar el contrato para definir la cantidad total.
          return res.status(400).json({ error: 'El total de cuotas es requerido para una cuota.' });
        }
      }
  
      // Para comisión y pago inicial, no se requieren installmentNumber y totalInstallments.
      const newPaymentReceipt = await PaymentReceipt.create({
        idClient,
        leaseId,
        paymentDate,
        amount,
        period: finalPeriod,
        type,
        installmentNumber: type === "installment" ? finalInstallmentNumber : null,
        totalInstallments: type === "installment" ? finalTotalInstallments : null,
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

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentReceipt.findAll({
      include: [
        { model: Client }, // Información del cliente
        { 
          model: Lease,   // Información del contrato
          include: [{ model: Property }] // Opcional: Detalles de la propiedad
        },
      ],
    });

    // ✅ Devolver array vacío si no hay pagos, no un error 404
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pagos', details: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      paymentDate,
      amount,
      period,
      type,
      installmentNumber,
      totalInstallments
    } = req.body;

    console.log('=== UPDATE PAYMENT ===' );
    console.log('Payment ID:', id);
    console.log('Request body:', req.body);

    // Buscar el pago
    const payment = await PaymentReceipt.findByPk(id);
    if (!payment) {
      console.log('Payment not found with ID:', id);
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    console.log('Payment found:', payment.toJSON());

    // Si se está cambiando el tipo a "initial", validar que no exista otro pago inicial
    if (type === 'initial' && payment.type !== 'initial') {
      const existingInitial = await PaymentReceipt.findOne({
        where: { 
          leaseId: payment.leaseId, 
          type: 'initial',
          id: { [require('sequelize').Op.ne]: id } // Excluir el pago actual
        },
      });
      if (existingInitial) {
        return res.status(400).json({ 
          error: 'Ya existe un pago inicial para este contrato.' 
        });
      }
    }

    // Actualizar los campos proporcionados
    const updateData = {};
    if (paymentDate !== undefined) updateData.paymentDate = paymentDate;
    if (amount !== undefined) updateData.amount = amount;
    if (period !== undefined) updateData.period = period;
    if (type !== undefined) updateData.type = type;
    if (installmentNumber !== undefined) updateData.installmentNumber = installmentNumber;
    if (totalInstallments !== undefined) updateData.totalInstallments = totalInstallments;

    await payment.update(updateData);

    console.log('Payment updated successfully');

    // Recargar con relaciones
    const updatedPayment = await PaymentReceipt.findByPk(id, {
      include: [
        { model: Client },
        { 
          model: Lease,
          include: [{ model: Property }]
        },
      ],
    });

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      error: 'Error al actualizar el pago',
      details: error.message,
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('=== DELETE PAYMENT ===');
    console.log('Payment ID:', id);

    // Buscar el pago
    const payment = await PaymentReceipt.findByPk(id);
    if (!payment) {
      console.log('Payment not found with ID:', id);
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Guardar información antes de eliminar para el log
    const paymentInfo = {
      id: payment.id,
      leaseId: payment.leaseId,
      amount: payment.amount,
      type: payment.type
    };

    await payment.destroy();

    console.log('Payment deleted successfully:', paymentInfo);

    res.status(200).json({ 
      message: 'Pago eliminado correctamente',
      deletedPayment: paymentInfo
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      error: 'Error al eliminar el pago',
      details: error.message,
    });
  }
};

exports.getPaymentsByLease = async (req, res) => {
  try {
    const { leaseId } = req.params;

    // Buscar el contrato
    const lease = await Lease.findByPk(leaseId, {
      include: [
        {
          model: PaymentReceipt,
          required: false,
          attributes: ['id', 'amount', 'paymentDate', 'periodMonth', 'periodYear'],
        },
      ],
    });
    if (!lease) {
      return res.status(404).json({ error: 'Contrato no encontrado.' });
    }

    res.status(200).json({
      message: 'Pagos encontrados.',
      payments: lease.PaymentReceipts.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        period: `${payment.periodMonth}/${payment.periodYear}`,
      })),
    });
  } catch (error) {
    console.error('Error al obtener pagos del contrato:', error);
    res.status(500).json({
      error: 'Error al obtener pagos del contrato.',
      details: error.message,
    });
  }
};