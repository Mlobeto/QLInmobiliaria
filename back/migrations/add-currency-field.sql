-- Agregar campo currency a la tabla Property
-- Este campo permite especificar la moneda (ARS o USD) solo para propiedades en venta

ALTER TABLE "Property" 
ADD COLUMN IF NOT EXISTS "currency" VARCHAR(3) DEFAULT 'ARS' CHECK ("currency" IN ('ARS', 'USD'));

-- Comentario para documentar el campo
COMMENT ON COLUMN "Property"."currency" IS 
'Moneda de la transacción (solo para ventas): ARS = Pesos Argentinos, USD = Dólares Estadounidenses';
