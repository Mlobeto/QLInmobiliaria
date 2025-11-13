const { conn } = require('../data');

exports.fixClientPropertyConstraints = async (req, res) => {
  try {
    console.log('=== INICIANDO CORRECCIÓN DE CONSTRAINTS ===');
    
    // 1. Eliminar constraints antiguos de ClientProperties
    console.log('Eliminando constraints antiguos de ClientProperties...');
    await conn.query('ALTER TABLE "ClientProperties" DROP CONSTRAINT IF EXISTS "ClientProperties_clientId_fkey"');
    await conn.query('ALTER TABLE "ClientProperties" DROP CONSTRAINT IF EXISTS "ClientProperties_propertyId_fkey"');
    console.log('✓ Constraints antiguos de ClientProperties eliminados');
    
    // 2. Crear constraints nuevos de ClientProperties con referencias correctas
    console.log('Creando constraints nuevos para ClientProperties...');
    await conn.query(`
      ALTER TABLE "ClientProperties" 
      ADD CONSTRAINT "ClientProperties_clientId_fkey" 
      FOREIGN KEY ("clientId") REFERENCES "Clients"("idClient") ON DELETE CASCADE
    `);
    
    await conn.query(`
      ALTER TABLE "ClientProperties" 
      ADD CONSTRAINT "ClientProperties_propertyId_fkey" 
      FOREIGN KEY ("propertyId") REFERENCES "Property"("propertyId") ON DELETE CASCADE
    `);
    console.log('✓ Constraints de ClientProperties creados');
    
    // 3. Eliminar constraints antiguos de Leases
    console.log('Eliminando constraints antiguos de Leases...');
    await conn.query('ALTER TABLE "Leases" DROP CONSTRAINT IF EXISTS "Leases_landlordId_fkey"');
    await conn.query('ALTER TABLE "Leases" DROP CONSTRAINT IF EXISTS "Leases_tenantId_fkey"');
    await conn.query('ALTER TABLE "Leases" DROP CONSTRAINT IF EXISTS "Leases_propertyId_fkey"');
    console.log('✓ Constraints antiguos de Leases eliminados');
    
    // 4. Crear constraints nuevos de Leases con referencias correctas
    console.log('Creando constraints nuevos para Leases...');
    await conn.query(`
      ALTER TABLE "Leases" 
      ADD CONSTRAINT "Leases_landlordId_fkey" 
      FOREIGN KEY ("landlordId") REFERENCES "Clients"("idClient") ON DELETE RESTRICT
    `);
    
    await conn.query(`
      ALTER TABLE "Leases" 
      ADD CONSTRAINT "Leases_tenantId_fkey" 
      FOREIGN KEY ("tenantId") REFERENCES "Clients"("idClient") ON DELETE RESTRICT
    `);
    
    await conn.query(`
      ALTER TABLE "Leases" 
      ADD CONSTRAINT "Leases_propertyId_fkey" 
      FOREIGN KEY ("propertyId") REFERENCES "Property"("propertyId") ON DELETE RESTRICT
    `);
    console.log('✓ Constraints de Leases creados');
    
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
