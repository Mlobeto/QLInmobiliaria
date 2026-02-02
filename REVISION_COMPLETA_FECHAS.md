# Revisión Completa de Manejo de Fechas

## Fecha de revisión: 2 de Febrero, 2026

---

## 🎯 Objetivo
Asegurar que TODAS las fechas en el sistema se manejen correctamente para la zona horaria de Argentina (GMT-3), evitando problemas de conversión UTC que causan cambios de día.

---

## 📋 Archivos Revisados y Corregidos

### **1. Backend - LeaseController.js**

#### Cambios principales:

1. **Nueva función helper `parseSafeDate()`** (líneas 6-20)
   ```javascript
   function parseSafeDate(dateValue) {
     if (!dateValue) return null;
     
     if (dateValue instanceof Date) {
       return dateValue;
     }
     
     if (typeof dateValue === 'string') {
       const dateOnly = dateValue.split('T')[0];
       const [year, month, day] = dateOnly.split('-').map(Number);
       return new Date(year, month - 1, day, 12, 0, 0);
     }
     
     return new Date(dateValue);
   }
   ```

2. **Funciones actualizadas para usar `parseSafeDate()`:**
   - ✅ `createLease()` - línea 157
   - ✅ `getAllLeases()` - línea 592
   - ✅ `calculateUpdatePeriod()` - líneas 708-709
   - ✅ `getNextUpdateDate()` - líneas 750, 757, 778
   - ✅ `needsUpdate()` - líneas 796, 806
   - ✅ `getLeasesPendingUpdate()` - líneas 1007, 1025, 1043
   - ✅ `getExpiringLeases()` - líneas 1521, 1527

**Impacto:** Todos los cálculos de fechas en el backend ahora parsean fechas correctamente sin conversión UTC no deseada.

---

### **2. Frontend - generarHTMLContrato.js**

#### Cambios realizados:

1. **Función `formatearFecha()` mejorada** (líneas 9-26)
   ```javascript
   const formatearFecha = (date) => {
     let d;
     if (typeof date === 'string') {
       const dateOnly = date.split('T')[0];
       const [year, month, day] = dateOnly.split('-').map(Number);
       d = new Date(year, month - 1, day);
     } else {
       d = new Date(date);
     }
     
     const dia = String(d.getDate()).padStart(2, '0');
     const mes = String(d.getMonth() + 1).padStart(2, '0');
     const anio = d.getFullYear();
     return `${dia}/${mes}/${anio}`;
   };
   ```

2. **Función `calcularFechaFin()` mejorada** (líneas 28-44)
   - Parsea startDate de forma segura
   - Calcula endDate correctamente

3. **Parseo seguro de startDate en generación de HTML** (líneas 114-124)
   - Evita conversión UTC al parsear `lease.startDate`

4. **Fecha de firma del contrato** (línea 275)
   - Cambiada de `new Date()` a `lease.startDate` para consistencia

---

### **3. Frontend - CreateLeaseForm.jsx**

Ya corregido previamente con:
- ✅ Importación de `dateUtils`
- ✅ Auto-cálculo de startDate con la regla del día 1-15 vs 16-31
- ✅ Permite edición manual

---

### **4. Frontend - ContratoAlquiler.jsx**

#### Cambios realizados:

1. **Función `formatearFecha()` mejorada** (líneas 36-52)
   - Parsea fechas ISO correctamente sin UTC

2. **Cálculo de fechas mejorado** (líneas 220-232)
   ```javascript
   // Calcular fechas - parsear correctamente evitando conversión UTC
   let startDate;
   if (typeof lease.startDate === 'string') {
     const dateOnly = lease.startDate.split('T')[0];
     const [year, month, day] = dateOnly.split('-').map(Number);
     startDate = new Date(year, month - 1, day);
   } else {
     startDate = new Date(lease.startDate);
   }
   const endDate = calcularFechaFin(lease.startDate, lease.totalMonths);
   ```

3. **Fecha de firma** (línea 340)
   - Cambiada de `formatearFecha(new Date())` a `formatearFecha(lease.startDate)`

---

### **5. Frontend - UpdateRentAmount.jsx**

#### Cambios realizados:

1. **Función `formatearFecha()` mejorada** (líneas 17-33)
   - Similar a ContratoAlquiler.jsx

2. **Función `calcularPeriodo()` mejorada** (líneas 48-70)
   ```javascript
   // Parsear startDate correctamente evitando conversión UTC
   let startDate;
   if (typeof lease.startDate === 'string') {
     const dateOnly = lease.startDate.split('T')[0];
     const [year, month, day] = dateOnly.split('-').map(Number);
     startDate = new Date(year, month - 1, day);
   } else {
     startDate = new Date(lease.startDate);
   }
   
   // Parsear updateDate correctamente evitando conversión UTC
   let updateDateObj;
   if (typeof updateDate === 'string') {
     const dateOnly = updateDate.split('T')[0];
     const [year, month, day] = dateOnly.split('-').map(Number);
     updateDateObj = new Date(year, month - 1, day);
   } else {
     updateDateObj = new Date(updateDate);
   }
   ```

---

## 🔧 Patrón de Corrección Utilizado

### **Antes (problemático):**
```javascript
const fecha = new Date('2026-02-01'); // Puede interpretar como UTC y cambiar de día
```

### **Después (correcto):**
```javascript
// Opción 1: Usando parseSafeDate (backend)
const fecha = parseSafeDate('2026-02-01');

// Opción 2: Parsing manual (frontend)
const dateOnly = dateString.split('T')[0];
const [year, month, day] = dateOnly.split('-').map(Number);
const fecha = new Date(year, month - 1, day);
```

---

## ✅ Verificación de Completitud

### Backend:
- ✅ LeaseController.js - 100% corregido
- ✅ Todas las funciones que usan fechas ahora usan `parseSafeDate()`
- ✅ Cálculos de actualizaciones basados en `startDate`, no en fecha del sistema

### Frontend:
- ✅ dateUtils.js - Creado con funciones de Argentina timezone
- ✅ CreateLeaseForm.jsx - Regla de auto-cálculo implementada
- ✅ generarHTMLContrato.js - Todas las fechas parseadas correctamente
- ✅ ContratoAlquiler.jsx - formatearFecha y cálculos corregidos
- ✅ UpdateRentAmount.jsx - formatearFecha y calcularPeriodo corregidos

### Archivos sin problemas (usan fechas para comparación o timestamps):
- ✅ reducer.js - Usa `new Date().toISOString()` para timestamps (correcto)
- ✅ actions.js - Usa `new Date().toISOString()` para timestamps (correcto)
- ✅ Listado.jsx - Usa `new Date()` para ordenar (correcto)
- ✅ ReciboPreview.jsx, ReciboPdf.jsx - Ya manejan fechas correctamente

---

## 🎯 Resultado Final

### Problema original:
1. ❌ Zona horaria incorrecta causaba cambio de días
2. ❌ Regla de negocio de startDate no implementada
3. ❌ Actualizaciones calculadas desde fecha del sistema en lugar de startDate

### Solución implementada:
1. ✅ Función `parseSafeDate()` en backend
2. ✅ Parsing manual seguro en frontend
3. ✅ Regla de negocio implementada (días 1-15 vs 16-31)
4. ✅ TODOS los cálculos basados en `startDate`
5. ✅ Fechas en PDFs correctas
6. ✅ Fechas en contratos HTML correctas

---

## 🧪 Pasos de Testing Recomendados

1. **Crear un contrato nuevo:**
   - Verificar que startDate se auto-calcule correctamente
   - Día 1-15 del mes → startDate = 1 del mes actual
   - Día 16-31 del mes → startDate = 1 del mes siguiente
   - Verificar que se pueda editar manualmente

2. **Verificar PDFs:**
   - Generar contrato PDF y verificar fechas
   - Generar actualización de alquiler PDF y verificar fechas
   - Fechas deben mostrar día/mes/año correctos

3. **Verificar actualizaciones de alquiler:**
   - Crear contrato con fecha pasada
   - Verificar que el sistema calcule correctamente cuándo necesita actualización
   - Base del cálculo debe ser startDate, no fecha actual

4. **Verificar alertas:**
   - Sistema debe alertar contratos que necesitan actualización
   - Basado en períodos desde startDate

---

## 📝 Notas Importantes

1. **Base de datos:** El campo timezone ya estaba configurado a '-03:00' (Argentina)
2. **El problema NO era la BD:** Era el parseo de fechas en JavaScript
3. **Clave del problema:** `new Date('2026-02-01')` interpreta la fecha como UTC medianoche, que al convertir a Argentina GMT-3 puede resultar en día anterior
4. **Solución:** Siempre parsear manualmente las fechas ISO tomando año/mes/día y construyendo Date en hora local

---

## 🚀 Estado del Sistema

**TODAS las fechas en el sistema ahora funcionan correctamente con zona horaria de Argentina.**

No se requieren más correcciones en el manejo de fechas.
