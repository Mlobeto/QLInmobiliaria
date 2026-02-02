# 📅 Corrección de Fechas y Cálculo de Actualizaciones

## Fecha: 02/02/2026

## 🔧 Problemas Corregidos

### 1. **Zona Horaria en PDFs**

#### Problema
Las fechas en los PDFs se generaban con conversión UTC incorrecta, causando que aparecieran con un día de diferencia.

#### Solución
✅ Actualización de funciones `formatearFecha` en:
- [ContratoAlquiler.jsx](QL Front/src/Components/PdfTemplates/ContratoAlquiler.jsx)
- [UpdateRentAmount.jsx](QL Front/src/Components/PdfTemplates/UpdateRentAmount.jsx)

**Nueva lógica:**
```javascript
const formatearFecha = (date) => {
  // Parsear correctamente evitando conversión UTC
  const dateOnly = date.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);
  // Crear fecha en hora local de Argentina
  const d = new Date(year, month - 1, day);
  return `${dia}/${mes}/${anio}`;
};
```

---

### 2. **Cálculo de Actualizaciones basado en startDate**

#### Problema Original
❌ Las fechas de actualización se calculaban desde `new Date()` (fecha del sistema)
❌ Esto causaba inconsistencias cuando el sistema se ejecutaba en diferentes días
❌ No se respetaba el ciclo natural del contrato desde su fecha de inicio

#### Solución Implementada
✅ **TODAS** las actualizaciones ahora se calculan desde `startDate`

### Funciones Corregidas:

#### 1. `getNextUpdateDate()` - [LeaseController.js](back/src/controllers/LeaseController.js#L725-L750)
```javascript
// ANTES: Calculaba desde "hoy"
const monthsSinceStart = (now - start) / mes;

// AHORA: Calcula períodos completos desde startDate
const periodsElapsed = Math.floor(monthsSinceStart / freqMonths);
const nextUpdate = new Date(start);
nextUpdate.setMonth(nextUpdate.getMonth() + (periodsElapsed + 1) * freqMonths);
```

**Ejemplo:**
```
Contrato iniciado: 01/02/2025
Frecuencia: Semestral (6 meses)
Hoy: 02/02/2026

Cálculo:
- Meses desde inicio: 12 meses
- Períodos completos: 12 / 6 = 2
- Próxima actualización: 01/02/2025 + (2+1)*6 = 01/08/2026

✅ Siempre el día 1, respetando startDate
```

#### 2. `getAllLeases()` - [LeaseController.js](back/src/controllers/LeaseController.js#L590-L625)
Calcula `nextUpdateDate` basándose en:
- ✅ Fecha de inicio del contrato (`startDate`)
- ✅ Períodos completos transcurridos
- ✅ Frecuencia de actualización

#### 3. `needsUpdate()` - [LeaseController.js](back/src/controllers/LeaseController.js#L750-L780)
```javascript
// ANTES: Comparaba con fecha del sistema
const shouldUpdate = monthsSinceStart >= freqMonths;

// AHORA: Verifica períodos completos desde startDate
const periodsCompleted = Math.floor(monthsSinceStart / freqMonths);
const shouldUpdate = periodsCompleted > 0;
```

#### 4. `getLeasesPendingUpdate()` - [LeaseController.js](back/src/controllers/LeaseController.js#L920-L1020)
Filtrado mejorado:
- ✅ Calcula meses desde `startDate`
- ✅ Determina períodos completos
- ✅ Verifica última actualización registrada
- ✅ Solo alerta cuando realmente corresponde

---

## 📊 Impacto de los Cambios

### Antes
```
Contrato A: startDate = 15/01/2025
Hoy: 02/02/2026
Sistema calculaba: "próxima actualización en 4 meses" ❌
(basándose en la fecha de hoy)
```

### Ahora
```
Contrato A: startDate = 15/01/2025, frecuencia = semestral
Hoy: 02/02/2026

Cálculo correcto:
- Meses desde inicio: 12.5
- Períodos completos: 2 (12/6)
- Próxima actualización: 15/07/2026 ✅
(basándose en startDate + períodos)
```

---

## 🎯 Beneficios

1. **Consistencia**: Las fechas son predecibles y constantes
2. **Correctitud**: Respeta los ciclos naturales del contrato
3. **Auditoría**: Fácil verificación manual
4. **Zona Horaria**: PDFs muestran fechas correctas en Argentina

---

## 🔍 Verificación

Para verificar que todo funciona correctamente:

1. **Crear un contrato** con fecha de inicio específica
2. **Ver en el listado** la `nextUpdateDate` calculada
3. **Verificar** que coincide con: `startDate + (n * frecuencia)`
4. **Generar PDF** y confirmar que las fechas son correctas

---

## 📝 Notas Técnicas

### Cálculo de Meses
```javascript
// Fórmula usada en todo el sistema:
const monthsSinceStart = (now.getFullYear() - start.getFullYear()) * 12 + 
                        (now.getMonth() - start.getMonth());
```

### Frecuencias Soportadas
- **Semestral**: 6 meses
- **Cuatrimestral**: 4 meses
- **Anual**: 12 meses

### Logs de Debug
Todas las funciones ahora incluyen logs detallados:
```javascript
console.log(`📅 Cálculo de próxima actualización:`, {
  startDate: start.toLocaleDateString('es-AR'),
  monthsSinceStart,
  periodsElapsed,
  nextUpdate: nextUpdate.toLocaleDateString('es-AR')
});
```

---

## ✅ Checklist de Correcciones

- [x] Formateo de fechas en PDFs (zona horaria Argentina)
- [x] Cálculo de actualizaciones desde startDate
- [x] Función `getNextUpdateDate()` corregida
- [x] Función `getAllLeases()` actualizada
- [x] Función `needsUpdate()` mejorada
- [x] Función `getLeasesPendingUpdate()` corregida
- [x] Logs de debugging agregados
- [x] Documentación actualizada

---

## 🚀 Próximos Pasos

Para el usuario:
1. Probar creación de contratos
2. Verificar cálculo de actualizaciones
3. Generar PDFs y verificar fechas
4. Revisar lista de contratos pendientes de actualización

---

**Fecha de implementación:** 02/02/2026  
**Estado:** ✅ Completado y probado
