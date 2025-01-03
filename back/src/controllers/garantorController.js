const { Garantor, Lease } = require("../data");

exports.createGarantorsForLease = async (req, res) => {
  try {
    const { leaseId } = req.params;
    const guarantors = req.body.guarantors; // Array de garantes

    // Validar que el contrato existe
    const lease = await Lease.findByPk(leaseId);
    if (!lease) {
      return res.status(404).json({ error: "Contrato de alquiler no encontrado" });
    }

    // Validar que hay entre 2 y 4 garantes
    if (!Array.isArray(guarantors) || guarantors.length < 2 || guarantors.length > 4) {
      return res.status(400).json({
        error: "Debe proporcionar entre 2 y 4 garantes.",
      });
    }

    // Crear y asociar los garantes
    const createdGuarantors = await Promise.all(
      guarantors.map((guarantorData) => 
        Garantor.create({ ...guarantorData, leaseId })
      )
    );

    res.status(201).json({ message: "Garantes creados exitosamente", guarantors: createdGuarantors });
  } catch (error) {
    res.status(500).json({
      error: "Error al crear garantes para el contrato de alquiler",
      details: error.message,
    });
  }
};


exports.updateGarantor = async (req, res) => {
    try {
      const { guarantorId } = req.params;
      const updatedData = req.body;
  
      // Verificar que el garante existe
      const guarantor = await Garantor.findByPk(guarantorId);
      if (!guarantor) {
        return res.status(404).json({ error: "Garante no encontrado" });
      }
  
      // Actualizar garante
      await guarantor.update(updatedData);
  
      res.status(200).json({ message: "Garante actualizado exitosamente", guarantor });
    } catch (error) {
      res.status(500).json({
        error: "Error al actualizar el garante",
        details: error.message,
      });
    }
  };
  
  exports.getGarantorsByLeaseId = async (req, res) => {
    try {
      const { leaseId } = req.params;
  
      // Verificar que el contrato existe
      const lease = await Lease.findByPk(leaseId, {
        include: { model: Garantor },
      });
      if (!lease) {
        return res.status(404).json({ error: "Contrato de alquiler no encontrado" });
      }
  
      res.status(200).json({ guarantors: lease.Garantors });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener los garantes del contrato de alquiler",
        details: error.message,
      });
    }
  };
  