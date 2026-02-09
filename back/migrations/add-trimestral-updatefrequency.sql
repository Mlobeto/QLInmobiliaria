-- Migración para agregar la opción 'trimestral' al ENUM de updateFrequency
-- y cambiar allowNull a false para hacer el campo obligatorio

-- PostgreSQL: Primero necesitamos agregar el nuevo valor al tipo ENUM
DO $$ 
BEGIN
  -- Verificar si el tipo ENUM existe y agregar 'trimestral' si no está
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_enum e 
    JOIN pg_type t ON e.enumtypid = t.oid 
    WHERE t.typname = 'enum_Leases_updateFrequency' 
    AND e.enumlabel = 'trimestral'
  ) THEN
    ALTER TYPE "enum_Leases_updateFrequency" ADD VALUE 'trimestral' BEFORE 'cuatrimestral';
    RAISE NOTICE 'Valor trimestral agregado al ENUM';
  END IF;
END $$;

-- Actualizar los contratos existentes que tengan updateFrequency NULL
-- Asignarles un valor por defecto (semestral) antes de hacer el campo obligatorio
UPDATE "Leases" 
SET "updateFrequency" = 'semestral' 
WHERE "updateFrequency" IS NULL;

-- Hacer el campo obligatorio (NOT NULL)
ALTER TABLE "Leases" 
ALTER COLUMN "updateFrequency" SET NOT NULL;

-- Agregar comentario para documentar el cambio
COMMENT ON COLUMN "Leases"."updateFrequency" IS 'Frecuencia de actualización del alquiler: trimestral (3 meses), cuatrimestral (4 meses), semestral (6 meses), anual (12 meses)';
