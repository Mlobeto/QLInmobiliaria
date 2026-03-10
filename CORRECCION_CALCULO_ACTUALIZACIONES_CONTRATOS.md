# Corrección del Cálculo de Actualizaciones de Contratos

## Problema Identificado

El sistema estaba calculando las fechas de actualización y los períodos de forma incorrecta:

1. **Usaba `lease.updatedAt` en lugar de las actualizaciones reales**: `lease.updatedAt` es la fecha de modificación del registro del contrato, NO la fecha de la última actualización de alquiler registrada en `RentUpdate`.

2. **No consideraba contratos viejos recién cargados**: Si un contrato con `startDate` de hace 2 años se ingresaba hoy al sistema, el cálculo mostraba que necesitaba múltiples actualizaciones atrasadas, cuando en realidad el monto ingresado ya debería estar actualizado.

3. **Cálculo inconsistente**: No verificaba correctamente si había actualizaciones de alquiler registradas en la tabla `RentUpdate`.

## Solución Implementada

### 1. Corregir Referencia de Fechas

**Archivos modificados:**
- `back/src/controllers/LeaseController.js`

**Cambios:**
- Ahora se usa `RentUpdate[0].updateDate` (última actualización registrada) en lugar de `lease.updatedAt`
- Se incluye el modelo `RentUpdate` en las consultas con orden descendente por fecha

### 2. Manejar Contratos Viejos Recién Cargados

Se implementó una lógica de tres casos:

#### **CASO 1: Contrato con Actualizaciones Registradas**
- **Condición**: Tiene registros en `RentUpdate`
- **Lógica**: Calcular si necesita actualización desde la última fecha de actualización registrada
- **Verificación**: `monthsSinceLastUpdate >= freqMonths`

#### **CASO 2: Contrato Viejo Recién Cargado al Sistema**
- **Condición**: 
  - NO tiene registros en `RentUpdate`
  - `createdAt` es más de 2 meses posterior a `startDate`
- **Lógica**: 
  - Asumir que el monto ingresado ya está actualizado
  - Calcular próxima actualización desde `createdAt` (fecha de carga)
  - Alinear fechas con `startDate` para mantener coherencia
- **Campo adicional**: `isOldContractRecentlyLoaded: true`

#### **CASO 3: Contrato Nuevo**
- **Condición**: 
  - NO tiene registros en `RentUpdate`
  - `createdAt` cercano a `startDate` (menos de 2 meses)
- **Lógica**: Calcular normalmente desde `startDate`

### 3. Funciones Actualizadas

#### `getAllLeases()`
```javascript
// Ahora maneja tres casos:
// 1. Con RentUpdates: usa última actualización
// 2. Contrato viejo recién cargado: usa createdAt como referencia
// 3. Contrato nuevo: usa startDate normalmente

updateInfo: {
  monthsSinceStart,
  monthsSinceLastUpdate,
  shouldUpdate,
  lastUpdateDate,
  nextUpdateDate,
  periodsElapsed,
  hasUpdates,
  isOldContractRecentlyLoaded  // ← NUEVO CAMPO
}
```

#### `getLeasesPendingUpdate()`
- Ahora filtra correctamente considerando los tres casos
- Muestra información relevante sobre contratos viejos recién cargados

#### `debugLeaseAlerts()`
- Corregido para usar `RentUpdate[0].updateDate` en lugar de `lease.updatedAt`

#### `getNextUpdateDate()`
- Simplificado para siempre alinearse con `startDate`
- Calcula períodos completos desde el inicio del contrato

## Ejemplos de Funcionamiento

### Ejemplo 1: Contrato Nuevo
```
startDate: 2025-11-10
createdAt: 2025-11-15
updateFrequency: semestral (6 meses)
hoy: 2026-03-10

Resultado:
- Meses desde startDate: 4 meses
- Períodos completos: 0
- shouldUpdate: false
- nextUpdateDate: 2026-05-10 (6 meses después de startDate)
```

### Ejemplo 2: Contrato con Actualizaciones
```
startDate: 2024-06-15
createdAt: 2024-06-20
lastUpdate: 2025-12-15
updateFrequency: semestral (6 meses)
hoy: 2026-03-10

Resultado:
- Meses desde última actualización: 3 meses
- shouldUpdate: false (faltan 3 meses)
- nextUpdateDate: 2026-06-15 (alineado con startDate)
```

### Ejemplo 3: Contrato Viejo Recién Cargado ✨ NUEVO
```
startDate: 2024-01-15 (hace 2 años)
createdAt: 2026-03-05 (recién cargado)
updateFrequency: semestral (6 meses)
hoy: 2026-03-10

Resultado:
- isOldContractRecentlyLoaded: true
- Meses desde carga: 0 meses
- shouldUpdate: false (se asume monto actualizado)
- nextUpdateDate: 2026-07-15 (próximo período desde startDate)
- lastUpdateDate: 2026-03-05 (se usa createdAt como referencia)
```

## Campos Disponibles en el Frontend

El backend ahora envía en `updateInfo`:

```javascript
{
  monthsSinceStart: number,           // Meses desde startDate
  monthsSinceLastUpdate: number,      // Meses desde última actualización o carga
  shouldUpdate: boolean,              // Si necesita actualización HOY
  lastUpdateDate: Date | null,        // Última actualización o createdAt
  nextUpdateDate: Date,               // Próxima fecha alineada con startDate
  periodsElapsed: number,             // Períodos completos desde startDate
  hasUpdates: boolean,                // Si tiene registros en RentUpdate
  isOldContractRecentlyLoaded: boolean // ⭐ Nuevo: indica contrato viejo recién cargado
}
```

## Ventajas de la Solución

✅ **Preciso**: Usa las fechas de actualizaciones reales de `RentUpdate`
✅ **Inteligente**: Detecta automáticamente contratos viejos recién cargados
✅ **Consistente**: Todas las fechas se alinean con `startDate`
✅ **Flexible**: Maneja correctamente contratos con y sin historial de actualizaciones
✅ **Informativo**: Proporciona información clara al frontend sobre el estado del contrato

## Próximos Pasos Opcionales

1. **Interfaz Usuario**: Mostrar badge o indicador visual cuando `isOldContractRecentlyLoaded: true`
2. **Ajuste Manual**: Permitir al usuario ajustar la "fecha de referencia" para contratos viejos si es necesario
3. **Auditoría**: Agregar logs detallados de cuándo se detectan contratos viejos recién cargados

## Corrección Adicional: Problema de Zona Horaria en Frontend

### Problema Detectado
Las fechas en la base de datos se almacenan como `2024-08-01` pero se mostraban como `31/7/2024` en el frontend.

**Causa**: Al usar `new Date(dateString)` con un string ISO (`2024-08-01T00:00:00Z`), JavaScript lo interpreta como UTC medianoche, que al convertirse a la zona horaria de Argentina (UTC-3) resulta en el día anterior (31 de julio a las 21:00).

### Solución Implementada

#### 1. Utilidades de Fecha Mejoradas (`utils/dateUtils.js`)

Se agregaron dos funciones clave que replican el comportamiento del backend:

```javascript
/**
 * Parsea una fecha de forma segura evitando conversiones UTC
 * Compatible con el parseSafeDate del backend
 */
export const parseSafeDate = (dateValue) => {
  if (!dateValue) return null;
  
  if (typeof dateValue === 'string') {
    const dateOnly = dateValue.includes('T') ? dateValue.split('T')[0] : dateValue;
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      const [year, month, day] = dateOnly.split('-').map(Number);
      // Crear fecha en hora local (mediodía) para evitar cambios de día
      return new Date(year, month - 1, day, 12, 0, 0);
    }
  }
  // ... más manejo de casos
};

/**
 * Formatea una fecha de forma segura en formato DD/MM/YYYY
 */
export const formatDateSafe = (date) => {
  const d = parseSafeDate(date);
  if (!d) return 'Fecha inválida';
  
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
};
```

#### 2. Componentes Actualizados

**EstadoContratos.jsx**
- ❌ Antes: `{new Date(lease.startDate).toLocaleDateString()}`
- ✅ Ahora: `{formatDateSafe(lease.startDate)}`

**ActualizarAlquileres.jsx**
- Reemplazada función `formatearFecha` local por `formatDateSafe` de utilidades
- Actualizado parseo de fechas en `necesitaActualizacion()` y `calcularProximaActualizacion()` para usar `parseSafeDate`
- Corregido cálculo de período en `generarPdfActualizacion()`

#### 3. Archivos Modificados

1. `QL Front/src/utils/dateUtils.js`
   - Agregado `parseSafeDate()`
   - Agregado `formatDateSafe()`
   - Actualizados `formatArgentinaDate()` y `parseArgentinaDate()` para usar `parseSafeDate`

2. `QL Front/src/Components/Contratos/EstadoContratos.jsx`
   - Importado `formatDateSafe` y `formatDateForInput`
   - Reemplazado `new Date().toLocaleDateString()` por `formatDateSafe()`
   - Reemplazado `.toISOString().substring(0, 10)` por `formatDateForInput()`

3. `QL Front/src/Components/Contratos/ActualizarAlquileres.jsx`
   - Importado `parseSafeDate` y `formatDateSafe`
   - Reemplazada función local de parseo por utilidades
   - Actualizado cálculo de períodos

### Resultado
✅ Las fechas ahora se muestran correctamente:
- `startDate: 2024-08-01` → Se muestra como `01/08/2024`
- `startDate: 2024-07-31` → Se muestra como `31/07/2024`
- No más desfases de un día por zona horaria

## Testing Recomendado

1. Crear un contrato con `startDate` antiguo (ej: 2024-01-15)
2. Verificar que aparece como `isOldContractRecentlyLoaded: true`
3. Verificar que `shouldUpdate: false` inicialmente
4. Verificar que `nextUpdateDate` está correctamente alineado con `startDate`
5. Registrar una actualización manualmente
6. Verificar que ahora usa esa actualización como referencia

---
**Fecha de implementación**: 10 de marzo de 2026
**Autor**: Sistema de IA - GitHub Copilot
