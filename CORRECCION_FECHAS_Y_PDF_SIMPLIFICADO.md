# Corrección de Fechas de Contratos y Simplificación de PDF

## Fecha: 8 de marzo de 2026

## Cambios Realizados

### 1. ✅ Corrección de Fecha de Inicio de Contratos

#### Problema Original
- La lógica anterior era: días 1-15 → inicio el 1° del mes actual | días 16-31 → inicio el 1° del mes siguiente

#### Nueva Regla de Negocio
- **El contrato SIEMPRE inicia el día 1 del mes siguiente al que se crea**
- **La primera cuota corresponde al mes de inicio del contrato**
- **Ejemplo**: Si hoy es 8 de marzo, el contrato inicia el 1 de abril y la primera cuota es abril
- **Lo que se paga antes son comisiones y adelantos (no son cuotas del contrato)**

#### Archivos Modificados

**1. `QL Front/src/utils/dateUtils.js`**
```javascript
/**
 * Calcula la fecha de inicio del contrato según las reglas del negocio:
 * - SIEMPRE el día 1 del mes siguiente al actual
 * - Ejemplo: si hoy es 8 de marzo, el contrato inicia el 1 de abril
 * - La primera cuota corresponde al mes de inicio (abril en el ejemplo)
 * 
 * @returns {Date} Fecha de inicio calculada (día 1 del mes siguiente)
 */
export const calculateLeaseStartDate = () => {
  const today = getArgentinaDate();
  
  // Crear fecha para el día 1 del mes siguiente
  const startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  
  return startDate;
};
```

**2. `QL Front/src/Components/Contratos/CreateLeaseForm.jsx`**
- Actualizado el texto de ayuda para reflejar la nueva regla:
```javascript
<p className="text-xs text-slate-400 italic">
  💡 Regla: El contrato siempre inicia el día 1 del mes siguiente. Puede modificarse manualmente si es necesario.
</p>
```

---

### 2. ✅ Sistema de Preview y Edición de PDF con Formato A4

#### Problema Original
- Necesidad de editar cláusulas antes de generar PDF (cada contrato puede tener variaciones)
- Primer enfoque eliminaba capacidad de edición

#### Solución Implementada
**Flujo de Preview/Edición Temporal:**
1. Click en "Descargar PDF" → Abre modal de preview/edición
2. Se genera HTML del contrato desde los datos guardados
3. Usuario edita en TinyMCE (cláusulas, textos, etc.)
4. Click en "Generar PDF (A4)" → Crea PDF con html2canvas + jsPDF
5. **Los cambios NO se guardan en la BD** (solo para esa generación)
6. **Formato A4 garantizado** (210mm x 297mm)

#### Archivos Creados/Modificados

**1. NUEVO: `QL Front/src/Components/PdfTemplates/ContratoPreviewEditor.jsx`**
- Modal de preview/edición con TinyMCE
- Genera HTML desde `generarHTMLContrato(lease)`
- Permite edición temporal antes de generar PDF
- Conversión a PDF con formato A4 exacto
- Usa html2canvas + jsPDF para mantener formato exacto

**Características:**
```javascript
// Garantía de formato A4
const pageContainer = document.createElement('div');
pageContainer.style.width = '210mm';  // A4 width
pageContainer.style.minHeight = '297mm';  // A4 height
pageContainer.style.padding = '25mm';  // Márgenes

// Creación de PDF A4
const pdf = new jsPDF('p', 'mm', 'a4');
const pdfWidth = 210;  // A4 width in mm
const pdfHeight = 297;  // A4 height in mm
```

**2. `QL Front/src/Components/Contratos/EstadoContratos.jsx`**
- Agregado import de `ContratoPreviewEditor`
- Agregado estado `previewLease`
- Modificado `handleDownloadPdf` para abrir modal de preview
- Agregado renderizado del modal

**3. `QL Front/src/Components/PdfTemplates/ContratoAlquiler.jsx`**
- Simplificado (eliminada lógica de customContent)
- Ahora solo usa pdfMake
- Se mantiene para generación rápida sin edición

**Beneficios:**
- ✅ Edición de cláusulas antes de generar PDF
- ✅ NO se guarda en BD (más limpio)
- ✅ **Formato A4 siempre garantizado**
- ✅ Cada generación puede tener ajustes diferentes
- ✅ Usa `generarHTMLContrato()` como base
- ✅ Texto justificado correctamente

---

### 3. 📋 Interfaz de Usuario

**Botones por contrato:**  
- ✏️ **Editar Datos** (amarillo) - Edita información del contrato en la BD
- 📥 **Descargar PDF** (azul) - Abre modal de preview/edición → genera PDF A4

**Flujo completo:**
1. Usuario hace click en "Descargar PDF"
2. Se abre modal con el contrato generado desde los datos
3. TinyMCE permite editar cláusulas, textos, formato
4. Click en "Generar PDF (A4)" descarga el archivo
5. Los cambios NO se persisten en la base de datos

---

## Impacto en Base de Datos

### Campo `customContent`

⚠️ **Nota**: El campo `customContent` en la tabla `leases` todavía existe pero **ya no se usa**.

**Estado actual:**
- ✅ Los contratos se generan desde datos estructurados (lease, property, tenant, landlord, guarantors)
- ✅ La edición es temporal (solo para esa generación de PDF)
- ✅ No se guarda HTML editado en la BD
- ⚠️ El campo `customContent` puede eliminarse o dejarse (no afecta funcionamiento)
2. **Crear una migración** para eliminarlo si se desea limpiar la base de datos:

```sql
-- Si se desea eliminar el campo (opcional)
ALTER TABLE leases DROP COLUMN IF EXISTS customContent;
```

---

## Testing Requerido

### ✅ Fecha de Inicio de Contratos
- [ ] Crear un contrato cualquier día del mes
- [ ] Verificar que la fecha de inicio sea siempre el día 1 del mes siguiente
- [ ] Verificar que se pueda modificar manualmente si es necesario
- [ ] Verificar que la primera cuota corresponde al mes de inicio

### ✅ Preview y Edición de Contratos
- [ ] Click en "Descargar PDF" abre el modal de preview
- [ ] El contrato se muestra generado desde los datos
- [ ] Se puede editar el texto con TinyMCE
- [ ] Se pueden modificar cláusulas
- [ ] El botón "Generar PDF (A4)" descarga correctamente

### ✅ Generación de PDF con Formato A4
- [ ] Verificar que el PDF se genera en formato A4 (210mm x 297mm)
- [ ] Generar PDF de contrato sin garantes
- [ ] Generar PDF de contrato con 1 garante
- [ ] Generar PDF de contrato con múltiples garantes
- [ ] Generar PDF de contrato con seguro de caución
- [ ] Verificar que el texto esté justificado correctamente
- [ ] Verificar que las fechas se muestren correctamente
- [ ] Verificar que los montos estén formateados en ARS
- [ ] Verificar que los márgenes sean correctos (25mm)

### ✅ Interfaz de Usuario
- [ ] Verificar que aparecen 2 botones: "Editar Datos" y "Descargar PDF"
- [ ] Verificar que no hay errores en consola
- [ ] Verificar que el modal se cierra correctamente
- [ ] Verificar que mientras se genera el PDF aparece indicador de carga

---

## Dependencias Utilizadas

**Mantenidas (NO desinstalar):**
- ✅ `html2canvas` - Conversión HTML→imagen para PDF con formato exacto
- ✅ `jspdf` - Creación de PDF desde imagen con control total de dimensiones
- ✅ `pdfmake` - Generación rápida de PDF en otros componentes
- ✅ `@tinymce/tinymce-react` - Editor WYSIWYG para preview/edición de contratos

**Justificación:**
- Se usan en múltiples componentes (contratos, recibos, órdenes de venta)
- `html2canvas + jspdf` garantizan formato A4 exacto
- `pdfmake` es útil para PDFs simples sin edición
- El bundle size es aceptable para la funcionalidad que proveen

---

## Rollback (si es necesario)

Si se necesita volver atrás:

1. Restaurar los archivos desde Git:
```bash
git checkout HEAD -- "QL Front/src/utils/dateUtils.js"
git checkout HEAD -- "QL Front/src/Components/Contratos/CreateLeaseForm.jsx"
git checkout HEAD -- "QL Front/src/Components/Contratos/EstadoContratos.jsx"
```

2. Eliminar el nuevo archivo:
```bash
rm "QL Front/src/Components/PdfTemplates/ContratoPreviewEditor.jsx"
```

---

## Resumen de Beneficios

### ✅ Fechas de Contratos
- Regla de negocio clara y consistente
- Primera cuota siempre corresponde al mes de inicio
- Menos confusión para usuarios

### ✅ Preview y Edición de Contratos
- Edición de cláusulas antes de generar el PDF
- No se ensucia la base de datos con HTML
- Cada generación puede tener ajustes únicos
- **Formato A4 garantizado siempre**

### ✅ Interfaz de Usuario
- Flujo claro: Ver datos → Editar → Generar PDF
- Modal intuitivo con preview en tiempo real
- Indicador de carga durante generación
- Mejor experiencia de usuario

---

## Autor
GitHub Copilot - 8 de marzo de 2026

## Próximos Pasos
1. ✅ Probar creación de contratos con la nueva fecha
2. ✅ Probar el modal de preview/edición
3. ✅ Verificar formato A4 en diferentes contratos
4. ⚠️ El campo `customContent` puede eliminarse de la BD (opcional)
