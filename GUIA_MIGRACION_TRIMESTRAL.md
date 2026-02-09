# Migración: Agregar Opción 'Trimestral' a updateFrequency

## 📋 Descripción

Esta migración agrega la opción **'trimestral'** al campo `updateFrequency` del modelo `Lease` y hace que el campo sea **obligatorio** (NOT NULL).

## 🎯 Cambios Realizados

### Backend
- ✅ **Modelo `Lease.js`**: ENUM actualizado con 'trimestral' y campo ahora obligatorio
- ✅ **`LeaseController.js`**: Lógica actualizada para calcular períodos trimestrales (3 meses)
- ✅ **Rutas `lease.js`**: Debug de alertas actualizado con soporte trimestral
- ✅ **`seedLeases.js`**: Agregado ejemplo de contrato trimestral

### Frontend
- ✅ **`CreateLeaseForm.jsx`**: Agregada opción 'Trimestral' en el selector
- ✅ **`EstadoContratos.jsx`**: Agregada opción 'Trimestral' en modo edición
- ✅ **`ActualizarAlquileres.jsx`**: Cálculo de períodos trimestrales implementado
- ✅ **`UpdateRentAmount.jsx`**: Template PDF actualizado con lógica trimestral
- ✅ **`ContratoAlquiler.jsx`**: Template de contrato con textos trimestrales
- ✅ **`generarHTMLContrato.js`**: HTML de contrato con cláusulas trimestrales

### Base de Datos
- ✅ **Migración SQL**: Archivo `add-trimestral-updatefrequency.sql` creado
- ✅ **Scripts de ejecución**: `.bat` (Windows) y `.sh` (Linux/Mac)

## 🚀 Instrucciones de Ejecución

### Opción 1: Usando el script (Recomendado)

**En Windows:**
```bash
cd back
ejecutar-migracion-trimestral.bat
```

**En Linux/Mac:**
```bash
cd back
chmod +x ejecutar-migracion-trimestral.sh
./ejecutar-migracion-trimestral.sh
```

### Opción 2: Manual con psql

```bash
cd back
psql $DATABASE_URL -f migrations/add-trimestral-updatefrequency.sql
```

### Opción 3: Desde la interfaz de base de datos

Copia y ejecuta el contenido del archivo `migrations/add-trimestral-updatefrequency.sql` en tu cliente SQL preferido.

## ⚙️ Detalles Técnicos

### ENUM Actualizado
```sql
enum_Leases_updateFrequency: 'trimestral' | 'cuatrimestral' | 'semestral' | 'anual'
```

### Lógica de Períodos
- **Trimestral**: 3 meses
- **Cuatrimestral**: 4 meses  
- **Semestral**: 6 meses
- **Anual**: 12 meses

### Conversión de Datos Existentes
La migración actualiza automáticamente todos los contratos con `updateFrequency = NULL` a `'semestral'` antes de hacer el campo obligatorio.

## ⚠️ Notas Importantes

1. **Backup**: Asegúrate de tener un backup de la base de datos antes de ejecutar la migración
2. **Contratos existentes**: Los contratos sin frecuencia definida serán actualizados a 'semestral'
3. **Campo obligatorio**: Después de esta migración, todos los contratos nuevos **deben** tener un `updateFrequency` definido
4. **Frontend actualizado**: El frontend ahora muestra la opción 'Trimestral' en todos los formularios

## 🧪 Testing

Después de ejecutar la migración:

1. Crear un nuevo contrato con frecuencia 'Trimestral'
2. Verificar que las alertas se calculen correctamente cada 3 meses
3. Probar la actualización de renta con período trimestral
4. Revisar que el PDF del contrato muestre el texto correcto

## 📝 Rollback (Si es necesario)

Si necesitas revertir los cambios:

```sql
-- Remover el constraint NOT NULL
ALTER TABLE "Leases" ALTER COLUMN "updateFrequency" DROP NOT NULL;

-- No es posible remover un valor del ENUM sin recrear el tipo
-- Se recomienda dejar 'trimestral' en el ENUM sin usarlo
```

## ✅ Verificación

Para verificar que la migración se ejecutó correctamente:

```sql
-- Verificar el ENUM
SELECT enumlabel 
FROM pg_enum e 
JOIN pg_type t ON e.enumtypid = t.oid 
WHERE t.typname = 'enum_Leases_updateFrequency'
ORDER BY enumsortorder;

-- Verificar contratos con frecuencia trimestral
SELECT id, "updateFrequency", "startDate", "rentAmount"
FROM "Leases"
WHERE "updateFrequency" = 'trimestral';
```

## 📅 Fecha de Aplicación

**Fecha**: 2026-02-09  
**Autor**: Sistema de Gestión de Contratos  
**Versión**: 1.0.0
