// Script para ejecutar migraciones automáticamente
// Ejecutar con: node back/migrations/runMigrations.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🚀 Conectando a Neon PostgreSQL...');
    
    const client = await pool.connect();
    console.log('✅ Conectado exitosamente');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'add-custom-content-to-leases.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 Ejecutando migración: add-custom-content-to-leases.sql');
    
    // Ejecutar la migración
    await client.query(sql);
    
    console.log('✅ Migración ejecutada exitosamente');

    // Verificar que la columna existe
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Leases' AND column_name = 'customContent'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Columna customContent verificada:', result.rows[0]);
    } else {
      console.log('⚠️  Columna customContent NO encontrada');
    }

    client.release();
    await pool.end();
    
    console.log('✅ Proceso completado');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
