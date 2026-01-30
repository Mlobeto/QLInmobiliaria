const { Property, Client, ClientProperty } = require("../data");

/**
 * Crear o actualizar datos de la autorización de venta
 * POST /api/property/:propertyId/sale-authorization
 */
exports.createOrUpdateSaleAuthorization = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const {
      ownerName,
      ownerCuil,
      ownerAddress,
      propertyDescription,
      salePrice,
      commission,
      validityDays = 360,
      customText,
      socio,
      currency
    } = req.body;

    console.log('=== CREAR/ACTUALIZAR AUTORIZACIÓN DE VENTA ===');
    console.log('PropertyId:', propertyId);
    console.log('Datos recibidos:', req.body);

    // Buscar la propiedad
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    // Verificar que sea una propiedad en venta
    if (property.type !== 'venta') {
      return res.status(400).json({ 
        error: "Solo se puede crear autorización para propiedades en venta" 
      });
    }

    // Crear o actualizar el objeto de autorización
    const authorizationData = {
      ownerName: ownerName || property.saleAuthorizationData?.ownerName || '',
      ownerCuil: ownerCuil || property.saleAuthorizationData?.ownerCuil || '',
      ownerAddress: ownerAddress || property.saleAuthorizationData?.ownerAddress || '',
      propertyDescription: propertyDescription || property.saleAuthorizationData?.propertyDescription || property.description || '',
      salePrice: salePrice || property.saleAuthorizationData?.salePrice || property.price,
      commission: commission || property.saleAuthorizationData?.commission || property.comision,
      validityDays: validityDays || property.saleAuthorizationData?.validityDays || 360,
      customText: customText || property.saleAuthorizationData?.customText || '',
      socio: socio || property.saleAuthorizationData?.socio || property.socio || '',
      currency: currency || property.saleAuthorizationData?.currency || property.currency || 'ARS',
      createdDate: property.saleAuthorizationData?.createdDate || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // Actualizar la propiedad con los nuevos datos
    await property.update({
      saleAuthorizationData: authorizationData
    });

    console.log('✅ Autorización guardada exitosamente');

    res.status(200).json({
      success: true,
      message: "Autorización de venta guardada/actualizada correctamente",
      data: authorizationData
    });

  } catch (error) {
    console.error('Error al crear/actualizar autorización:', error);
    res.status(500).json({
      error: "Error al procesar la autorización de venta",
      details: error.message
    });
  }
};

/**
 * Obtener datos de la autorización de venta
 * GET /api/property/:propertyId/sale-authorization
 */
exports.getSaleAuthorization = async (req, res) => {
  try {
    const { propertyId } = req.params;

    console.log('=== OBTENER AUTORIZACIÓN DE VENTA ===');
    console.log('PropertyId:', propertyId);

    const property = await Property.findByPk(propertyId, {
      include: [
        {
          model: Client,
          through: { 
            model: ClientProperty,
            where: { role: 'vendedor' }
          },
          required: false
        }
      ]
    });

    if (!property) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    if (property.type !== 'venta') {
      return res.status(400).json({ 
        error: "Esta propiedad no está en venta" 
      });
    }

    // Si no hay datos guardados, devolver datos por defecto desde la propiedad y el cliente
    const client = property.Clients && property.Clients.length > 0 ? property.Clients[0] : null;

    const authorizationData = property.saleAuthorizationData || {
      ownerName: client?.name || '',
      ownerCuil: client?.cuil || '',
      ownerAddress: client?.address || '',
      propertyDescription: property.description || '',
      salePrice: property.price,
      commission: property.comision,
      validityDays: 360,
      customText: '',
      surrency: property.currency || 'ARS',
      cocio: property.socio || '',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      property: {
        propertyId: property.propertyId,
        address: property.address,
        city: property.city,
        neighborhood: property.neighborhood,
        description: property.description,
        superficieCubierta: property.superficieCubierta,
        superficieTotal: property.superficieTotal,
        price: property.price,
        comision: property.comision,
        socio: property.socio
      },
      authorization: authorizationData,
      client: client ? {
        name: client.name,
        cuil: client.cuil,
        address: client.address
      } : null
    });

  } catch (error) {
    console.error('Error al obtener autorización:', error);
    res.status(500).json({
      error: "Error al obtener la autorización de venta",
      details: error.message
    });
  }
};
