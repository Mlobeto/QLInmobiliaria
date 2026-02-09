-- Migración para agregar campos de seguro de caución al modelo Garantor

-- Agregar campo para entidad certificadora (ya existía antes, pero por si acaso)
ALTER TABLE "Garantors" 
ADD COLUMN IF NOT EXISTS "certificationEntity" VARCHAR(255);

-- Agregar campos específicos para seguro de caución
ALTER TABLE "Garantors" 
ADD COLUMN IF NOT EXISTS "insuranceCompany" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "policyNumber" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "insuredAmount" DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS "insuranceStartDate" TIMESTAMP WITH TIME ZONE;

-- Agregar comentarios para documentar los campos
COMMENT ON COLUMN "Garantors"."certificationEntity" IS 'Entidad certificadora para el caso de certificación de ingresos';
COMMENT ON COLUMN "Garantors"."insuranceCompany" IS 'Aseguradora para el caso de seguro de caución';
COMMENT ON COLUMN "Garantors"."policyNumber" IS 'Número de póliza para el caso de seguro de caución';
COMMENT ON COLUMN "Garantors"."insuredAmount" IS 'Suma asegurada para el caso de seguro de caución';
COMMENT ON COLUMN "Garantors"."insuranceStartDate" IS 'Fecha de inicio de vigencia del seguro de caución';
