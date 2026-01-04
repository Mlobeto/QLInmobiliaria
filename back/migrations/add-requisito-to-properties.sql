-- Migración: Agregar campo 'requisito' a la tabla Property
-- Fecha: 2026-01-04

-- 1. Agregar la columna requisito (TEXT, nullable)
ALTER TABLE "Property" 
ADD COLUMN IF NOT EXISTS "requisito" TEXT;

-- 2. Actualizar propiedades de alquiler existentes con la plantilla por defecto
UPDATE "Property"
SET "requisito" = 'REQUISITOS PARA ALQUILAR

1. Fotocopia D.N.I./ CUIL/CUIT, solicitante/s y garante/s, domicilio y teléfono de los mismos, sino es del dominio del documento electrónico.

2. Fotocopia de los últimos tres recibos de sueldo, y certificado de trabajo, si es autónomo justificación de ingresos, esta puede hacer por un Contador y debe pasar por el Colegio Profesional de Ciencias Económicas, para ser certificada.

3. Tipos de garantía: Cantidad: 1 - con recibos de sueldo o certificación de ingresos.
   • Recibo de sueldo no inferior al tercio del monto del alquiler Garante:

DNI:
Domicilio:
Correo electrónico:

4. Los garantes firman el contrato ante escribano para que les certifique la firma, y cuando firme ante escribano deberá ser legalizado por el colegio de Escribanos.

5. Monto del alquiler mensual: 1º Cuatrimestre $$$$$$$$$$ Para los cuatrimestres siguientes de locación el precio será actualizado conforme el índice de precio al consumidor (IPC) que confecciona y publica el Instituto Nacional de Estadísticas y Censos (INDEC).

6. Honorarios de contratos ante escribano y favor de firma inmobiliaria: Igual al monto del alquiler

7. Período de locación: 2 años

8. Certificado de firma ante escribano público.

9. Sellado en rentas provincial

10. No se pide mes de depósito.

11. Reserva con seña 50% del monto del alquiler, validez 7 días hábiles.'
WHERE "type" = 'alquiler' AND ("requisito" IS NULL OR "requisito" = '');

-- Verificar los cambios
SELECT 
    "propertyId", 
    "address", 
    "type",
    CASE 
        WHEN "requisito" IS NOT NULL THEN 'Con requisito'
        ELSE 'Sin requisito'
    END as estado_requisito
FROM "Property"
ORDER BY "type", "propertyId";
