-- Agregar campo saleAuthorizationData a la tabla Property
-- Este campo almacenará los datos de la autorización de venta en formato JSON

ALTER TABLE "Property" 
ADD COLUMN IF NOT EXISTS "saleAuthorizationData" JSONB DEFAULT NULL;

-- Comentario para documentar el campo
COMMENT ON COLUMN "Property"."saleAuthorizationData" IS 
'Datos de la autorización de venta almacenados en formato JSON. Estructura: {ownerName, ownerCuil, ownerAddress, propertyDescription, salePrice, commission, validityDays, createdDate, lastUpdated, customText, socio}';
