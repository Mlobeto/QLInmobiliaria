/**
 * Script para corregir y completar cuotas de contratos con pagos faltantes o incorrectos.
 *
 * ESTRATEGIA:
 *   1. Elimina TODOS los pagos existentes de los contratos afectados (estaban mal cargados).
 *   2. Re-inserta todas las cuotas desde startDate hasta Marzo 2026 con status "paid".
 *
 * Contratos afectados: 16, 22, 23, 24, 25, 27, 28, 30, 32, 33, 35, 37, 40
 *
 * Uso: node scripts/insertar-pagos-faltantes.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DB_DEPLOY });

const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const CONTRATOS = [
  { id: 16,  startDate: '2026-01-01', totalMonths: 12,  rentAmount: 300000,  tenantId: 48  },
  { id: 22,  startDate: '2024-03-01', totalMonths: 36,  rentAmount: 595506,  tenantId: 67  },
  { id: 23,  startDate: '2025-04-01', totalMonths: 36,  rentAmount: 588300,  tenantId: 72  },
  { id: 24,  startDate: '2025-01-01', totalMonths: 36,  rentAmount: 524886,  tenantId: 73  },
  { id: 25,  startDate: '2024-08-01', totalMonths: 36,  rentAmount: 371860,  tenantId: 69  },
  { id: 27,  startDate: '2023-09-01', totalMonths: 36,  rentAmount: 361179,  tenantId: 78  },
  { id: 28,  startDate: '2023-09-01', totalMonths: 36,  rentAmount: 438573,  tenantId: 75  },
  { id: 30,  startDate: '2025-06-01', totalMonths: 24,  rentAmount: 526625,  tenantId: 101 },
  { id: 32,  startDate: '2025-02-01', totalMonths: 36,  rentAmount: 660000,  tenantId: 102 },
  { id: 33,  startDate: '2023-07-01', totalMonths: 36,  rentAmount: 484300,  tenantId: 51  },
  { id: 35,  startDate: '2024-05-01', totalMonths: 36,  rentAmount: 197164,  tenantId: 63  },
  { id: 37,  startDate: '2023-09-01', totalMonths: 36,  rentAmount: 312161,  tenantId: 56  },
  { id: 40,  startDate: '2025-02-01', totalMonths: 36,  rentAmount: 593800,  tenantId: 79  },
];

// Fecha de corte: Marzo 2026 (inclusive)
const CUTOFF_YEAR  = 2026;
const CUTOFF_MONTH = 2; // 0-indexed → Marzo

function generarCuotas(contrato) {
  // Parsear fecha como local para evitar desfase de timezone
  const [startYear, startMonth, startDay] = contrato.startDate.split('-').map(Number);
  const cuotas = [];
  let numero = 1;

  for (let i = 0; i < contrato.totalMonths; i++) {
    // Crear fecha en tiempo local para no sufrir desfase UTC
    const fecha = new Date(startYear, startMonth - 1 + i, 1);
    // Solo hasta Marzo 2026 inclusive
    if (
      fecha.getFullYear() > CUTOFF_YEAR ||
      (fecha.getFullYear() === CUTOFF_YEAR && fecha.getMonth() > CUTOFF_MONTH)
    ) break;

    cuotas.push({
      leaseId:           contrato.id,
      idClient:          contrato.tenantId,
      paymentDate:       `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}-01`,
      amount:            contrato.rentAmount,
      period:            `${MESES_ES[fecha.getMonth()]} ${fecha.getFullYear()}`,
      type:              'installment',
      installmentNumber: numero++,
      totalInstallments: contrato.totalMonths,
      status:            'paid',
    });
  }

  return cuotas;
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const leaseIds = CONTRATOS.map(c => c.id);

    // 1. Eliminar pagos existentes (incluyendo soft-deleted) para limpiar datos incorrectos
    const { rowCount: eliminados } = await client.query(
      `DELETE FROM "PaymentReceipts"
       WHERE "leaseId" IN (${leaseIds.join(',')}) AND type = 'installment'`
    );
    console.log(`🗑️  Eliminados ${eliminados} pagos incorrectos/incompletos existentes.\n`);

    // 2. Re-insertar todas las cuotas correctamente
    let totalInsertados = 0;

    for (const contrato of CONTRATOS) {
      const cuotas = generarCuotas(contrato);
      console.log(`Contrato ${contrato.id}: insertando ${cuotas.length} cuotas (${cuotas[0]?.period} → ${cuotas[cuotas.length-1]?.period})...`);

      for (const c of cuotas) {
        await client.query(
          `INSERT INTO "PaymentReceipts"
            ("leaseId", "idClient", "paymentDate", amount, period, type, "installmentNumber", "totalInstallments", status, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
          [c.leaseId, c.idClient, c.paymentDate, c.amount, c.period, c.type, c.installmentNumber, c.totalInstallments, c.status]
        );
        totalInsertados++;
      }
    }

    await client.query('COMMIT');
    console.log(`\n✅ Listo. Total de cuotas insertadas: ${totalInsertados}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error, se hizo ROLLBACK:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
