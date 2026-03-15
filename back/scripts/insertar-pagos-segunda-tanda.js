/**
 * Segunda tanda: corregir contratos con pagos faltantes o incorrectos.
 * 
 * Estrategia:
 *  - Contratos 17, 19, 20, 26, 29, 31, 36, 38, 39 → borrar installments y re-insertar todos correctamente.
 *  - Contrato 21 → solo insertar los números faltantes (3-18) sin tocar 1, 2, 19, 20.
 * 
 * Uso: node scripts/insertar-pagos-segunda-tanda.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DB_DEPLOY });

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const CUTOFF_YEAR = 2026;
const CUTOFF_MONTH = 2; // 0-indexed → Marzo

// Contratos a re-insertar completamente
const CONTRATOS_FULL = [
  { id: 17,  startDate: '2025-01-01', totalMonths: 36, rentAmount: 629280,  tenantId: 58  },
  { id: 19,  startDate: '2024-03-01', totalMonths: 36, rentAmount: 331000,  tenantId: 54  },
  { id: 20,  startDate: '2025-01-01', totalMonths: 36, rentAmount: 524400,  tenantId: 68  },
  { id: 26,  startDate: '2025-07-01', totalMonths: 36, rentAmount: 432690,  tenantId: 76  },
  { id: 29,  startDate: '2025-11-01', totalMonths: 36, rentAmount: 1050000, tenantId: 33  },
  { id: 31,  startDate: '2024-10-01', totalMonths: 36, rentAmount: 555400,  tenantId: 61  },
  { id: 36,  startDate: '2024-05-01', totalMonths: 24, rentAmount: 535650,  tenantId: 66  },
  { id: 38,  startDate: '2024-06-01', totalMonths: 36, rentAmount: 239900,  tenantId: 57  },
  { id: 39,  startDate: '2024-04-01', totalMonths: 24, rentAmount: 387783,  tenantId: 53  },
];

// Contrato 21: solo insertar cuotas 3-18 (las demás ya están bien)
const CONTRATO_21 = { id: 21, startDate: '2024-08-01', totalMonths: 36, rentAmount: 371860, tenantId: 99 };
const CUOTAS_EXISTENTES_21 = new Set([1, 2, 19, 20]);

function generarCuotas(contrato, soloNumeros = null) {
  const [y, m] = contrato.startDate.split('-').map(Number);
  const cuotas = [];
  let numero = 1;

  for (let i = 0; i < contrato.totalMonths; i++) {
    const fecha = new Date(y, m - 1 + i, 1);
    if (
      fecha.getFullYear() > CUTOFF_YEAR ||
      (fecha.getFullYear() === CUTOFF_YEAR && fecha.getMonth() > CUTOFF_MONTH)
    ) break;

    if (!soloNumeros || soloNumeros.has(numero)) {
      cuotas.push({
        leaseId:           contrato.id,
        idClient:          contrato.tenantId,
        paymentDate:       `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}-01`,
        amount:            contrato.rentAmount,
        period:            `${MESES_ES[fecha.getMonth()]} ${fecha.getFullYear()}`,
        type:              'installment',
        installmentNumber: numero,
        totalInstallments: contrato.totalMonths,
        status:            'paid',
      });
    }
    numero++;
  }
  return cuotas;
}

async function insertarCuotas(client, cuotas) {
  for (const c of cuotas) {
    await client.query(
      `INSERT INTO "PaymentReceipts"
        ("leaseId", "idClient", "paymentDate", amount, period, type, "installmentNumber", "totalInstallments", status, "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW())`,
      [c.leaseId, c.idClient, c.paymentDate, c.amount, c.period, c.type, c.installmentNumber, c.totalInstallments, c.status]
    );
  }
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let total = 0;

    // --- Contratos full: borrar y re-insertar ---
    const fullIds = CONTRATOS_FULL.map(c => c.id).join(',');
    const { rowCount: borrados } = await client.query(
      `DELETE FROM "PaymentReceipts" WHERE "leaseId" IN (${fullIds}) AND type = 'installment'`
    );
    console.log(`🗑️  Eliminados ${borrados} pagos incorrectos.\n`);

    for (const contrato of CONTRATOS_FULL) {
      const cuotas = generarCuotas(contrato);
      console.log(`Contrato ${contrato.id}: ${cuotas.length} cuotas (${cuotas[0]?.period} → ${cuotas[cuotas.length-1]?.period})`);
      await insertarCuotas(client, cuotas);
      total += cuotas.length;
    }

    // --- Contrato 21: solo insertar los faltantes ---
    // Calcular qué números van del 1 al 20 y cuáles NO existen aún
    const faltantes21 = new Set();
    const [y21, m21] = CONTRATO_21.startDate.split('-').map(Number);
    let num = 1;
    for (let i = 0; i < CONTRATO_21.totalMonths; i++) {
      const f = new Date(y21, m21 - 1 + i, 1);
      if (f.getFullYear() > CUTOFF_YEAR || (f.getFullYear() === CUTOFF_YEAR && f.getMonth() > CUTOFF_MONTH)) break;
      if (!CUOTAS_EXISTENTES_21.has(num)) faltantes21.add(num);
      num++;
    }

    const cuotas21 = generarCuotas(CONTRATO_21, faltantes21);
    console.log(`\nContrato 21: insertando ${cuotas21.length} cuotas faltantes (${cuotas21[0]?.period} → ${cuotas21[cuotas21.length-1]?.period})`);
    await insertarCuotas(client, cuotas21);
    total += cuotas21.length;

    await client.query('COMMIT');
    console.log(`\n✅ Listo. Total cuotas insertadas: ${total}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error, ROLLBACK:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
