const { sequelize } = require('../data');

exports.fixClientPropertyConstraints = async (req, res) => {
  try {
    console.log('=== INICIANDO CORRECCIÓN DE CONSTRAINTS ===');
    
    // 1. Eliminar constraints antiguos
    console.log('Eliminando constraints antiguos...');
    await sequelize.query('ALTER TABLE "ClientProperties" DROP CONSTRAINT IF EXISTS "ClientProperties_clientId_fkey"');
    await sequelize.query('ALTER TABLE "ClientProperties" DROP CONSTRAINT IF EXISTS "ClientProperties_propertyId_fkey"');
    console.log('✓ Constraints antiguos eliminados');
    
    // 2. Crear constraints nuevos con referencias correctas
    console.log('Creando constraints nuevos...');
    await sequelize.query(`
      ALTER TABLE "ClientProperties" 
      ADD CONSTRAINT "ClientProperties_clientId_fkey" 
      FOREIGN KEY ("clientId") REFERENCES "Client"("idClient") ON DELETE CASCADE
    `);
    
    await sequelize.query(`
      ALTER TABLE "ClientProperties" 
      ADD CONSTRAINT "ClientProperties_propertyId_fkey" 
      FOREIGN KEY ("propertyId") REFERENCES "Property"("propertyId") ON DELETE CASCADE
    `);
    console.log('✓ Constraints nuevos creados');
    
    console.log('=== CORRECCIÓN COMPLETADA EXITOSAMENTE ===');
    
    res.status(200).json({
      success: true,
      message: 'Constraints corregidos exitosamente',
      details: 'Las referencias ahora apuntan a "Client" y "Property" (singular)'
    });
    
  } catch (error) {
    console.error('Error al corregir constraints:', error);
    res.status(500).json({
      success: false,
      error: 'Error al corregir constraints',
      details: error.message,
      stack: error.stack
    });
  }
};
