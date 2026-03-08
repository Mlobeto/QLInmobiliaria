# Sistema de Cláusulas Personalizadas para Contratos

## 📋 Descripción General

Sistema mejorado de generación de contratos que permite seleccionar cláusulas específicas según el tipo de propiedad (Local Comercial, Vivienda, etc.) y agregar cláusulas opcionales adicionales.

## ✨ Características Principales

### 1. **Cláusulas Específicas por Tipo de Propiedad**

#### 🏢 Local Comercial / Oficina
- **Habilitaciones Comerciales**: Obligación de tramitar permisos y habilitaciones
- **Actividad Específica**: Define y limita el rubro comercial permitido
- **Horario de Atención**: Restricciones de horarios según ordenanzas
- **Reformas y Adaptaciones**: Permisos para adaptar el local
- **Cartelería y Publicidad**: Normas sobre señalización comercial
- **Expensas y Servicios Comerciales**: Responsabilidades sobre gastos
- **Transferencia de Fondo de Comercio**: Condiciones para cesión
- **Seguros Obligatorios**: Responsabilidad civil y cobertura
- **Disposición de Residuos**: Manejo de desechos comerciales

#### 🏠 Vivienda (Casa/Departamento/Duplex)
- **Destino Habitacional Exclusivo**: Prohibición de uso comercial
- **Convivencia y Ocupantes**: Control de residentes
- **Tenencia de Mascotas**: Permitidas o prohibidas
- **Reglamento de Copropiedad**: Cumplimiento de normas del edificio
- **Modificaciones al Inmueble**: Restricciones sobre reformas
- **Expensas Ordinarias**: Responsabilidades de pago
- **Conservación y Mantenimiento**: Obligaciones del locatario
- **Desocupación y Entrega**: Condiciones al finalizar el contrato

### 2. **Cláusulas Opcionales (para cualquier tipo)**

- **Anticipo de Alquileres**: Pago adelantado de meses
- **Garantía Extendida**: Garantías adicionales
- **Cláusula Penal por Incumplimiento**: Multas por violación del contrato
- **Servicios Especiales Incluidos**: Internet, cable, etc.
- **Renovación Automática**: Prórroga automática bajo condiciones
- **Opción de Compra**: Derecho a comprar el inmueble
- **Mediación Previa Obligatoria**: Resolución de conflictos
- **Cochera o Estacionamiento Incluido**: Espacios de parking

## 🚀 Cómo Usar el Sistema

### Paso 1: Crear o Editar un Contrato
1. Desde el panel de contratos, crea un nuevo contrato o edita uno existente
2. Completa los datos básicos (propiedad, inquilino, monto, etc.)
3. Haz clic en el botón **"Editar Contrato"** (ícono púrpura)

### Paso 2: Agregar Cláusulas Personalizadas
1. En el editor de contratos, haz clic en **"Agregar Cláusulas"** (botón morado)
2. El sistema detecta automáticamente el tipo de propiedad
3. Se muestra un modal con:
   - **Cláusulas específicas** según el tipo (Local Comercial o Vivienda)
   - **Cláusulas opcionales** aplicables a cualquier tipo

### 💡 Botón de Ayuda Integrado
El selector de cláusulas incluye un **botón de ayuda** (ícono ❓) en el header del modal que proporciona:

- **Explicación del sistema**: Qué son las cláusulas y para qué sirven
- **Tipos de cláusulas**: Diferencias entre específicas y opcionales
- **Guía paso a paso**: Cómo seleccionar y usar las cláusulas
- **Consejos importantes**: 
  - No es necesario seleccionar todas las cláusulas
  - Puedes combinar cláusulas específicas con opcionales
  - Las cláusulas con `[ESPECIFICAR]` requieren personalización
  - Todo es editable después de confirmar
  - El PDF respeta márgenes A4 estándar (20mm superior/inferior, 25mm laterales)

**Cómo acceder**: Haz clic en el ícono de interrogación (❓) en la esquina superior derecha del modal de cláusulas.

### Paso 3: Seleccionar Cláusulas
1. **Marca las cláusulas** que deseas incluir (haciendo clic en el checkbox)
2. Haz clic en **"Ver más"** para leer el contenido completo
3. Las cláusulas seleccionadas se destacan en azul
4. El contador muestra cuántas cláusulas has seleccionado

### Paso 4: Confirmar y Editar
1. Haz clic en **"Confirmar y Continuar"**
2. Las cláusulas se insertan automáticamente en el contrato
3. Aparecen destacadas con fondo azul claro
4. Puedes editar manualmente cualquier cláusula en el editor TinyMCE
5. Las cláusulas con texto **[ESPECIFICAR]** requieren completar datos

### Paso 5: Guardar y Generar PDF
1. Realiza ajustes finales en el editor si es necesario
2. Haz clic en **"Guardar Cambios"** para guardar en la base de datos
3. Descarga el PDF desde el listado de contratos

## 📂 Archivos Creados/Modificados

### Nuevos Archivos
1. **`clausulasContratos.js`** (`QL Front/src/utils/`)
   - Banco de cláusulas predefinidas
   - Funciones para obtener cláusulas según tipo de propiedad
   - Exporta: `clausulasLocalComercial`, `clausulasVivienda`, `clausulasOpcionales`, `obtenerClausulasSegunTipo`

2. **`ClausulasSelector.jsx`** (`QL Front/src/Components/Contratos/`)
   - Modal interactivo para seleccionar cláusulas
   - Interfaz con checkboxes, detalles expandibles
   - **Sistema de ayuda integrado** con modal explicativo completo
   - Botón de ayuda (❓) en el header
   - Contador de cláusulas seleccionadas
   - Props: `tipoPropiedad`, `onClausulasSelected`, `onClose`

### Archivos Modificados
1. **`generarHTMLContrato.js`** (`QL Front/src/utils/`)
   - Modificado para aceptar parámetro `clausulasAdicionales`
   - Inserta cláusulas adicionales antes de las finales
   - Destacado visual con borde azul para cláusulas adicionales

2. **`ContratoEditor.jsx`** (`QL Front/src/Components/Contratos/`)
   - Agregado estado para cláusulas seleccionadas
   - Botón "Agregar Cláusulas" en el footer
   - Integración con modal ClausulasSelector
   - Regenera HTML al seleccionar cláusulas

## 🎨 Interfaz Visual

### Modal Selector de Cláusulas
- **Header**: 
  - Muestra tipo de propiedad con ícono (🏢 Comercial / 🏠 Vivienda)
  - **Botón de ayuda** (❓): Abre modal con guía completa del sistema
  - Botón de cerrar (✕)
- **Secciones**:
  - Cláusulas específicas (según tipo)
  - Cláusulas opcionales (para todos)
- **Cláusulas individuales**:
  - Checkbox para seleccionar/deseleccionar
  - Botón "Ver más/menos" para expandir contenido
  - Resaltado azul cuando está seleccionada
- **Info box**: Información sobre cómo usar las cláusulas
- **Footer**: Contador + botones Cancelar/Confirmar

### Modal de Ayuda
- **Acceso**: Botón ❓ en el header del selector de cláusulas
- **Contenido**:
  - ¿Qué son las cláusulas del contrato?
  - Tipos de cláusulas (Comercial, Vivienda, Opcionales)
  - Guía paso a paso de uso (4 pasos)
  - Consejos importantes y mejores prácticas
- **Diseño**: Modal superpuesto con gradiente azul, organizado en secciones visuales
- **Interacción**: Se cierra con botón "Entendido, cerrar ayuda" o botón ✕

### Editor de Contratos
- **Botón "Agregar Cláusulas"**: Color púrpura, con contador de cláusulas
- **Cláusulas insertadas**: Fondo azul claro en el HTML generado
- **Edición completa**: TinyMCE permite modificar todo el contenido

## 💡 Casos de Uso

### Caso 1: Contrato de Local Comercial
```
1. Usuario crea contrato para propiedad tipo "local"
2. Abre editor → clic "Agregar Cláusulas"
3. Sistema muestra 9 cláusulas específicas para locales comerciales
4. Selecciona: Habilitaciones, Actividad, Seguros, Cartelería
5. Agrega cláusula opcional: Opción de Compra
6. Total: 5 cláusulas adicionales
7. Confirma → se insertan en el contrato
8. Edita texto [ESPECIFICAR ACTIVIDAD COMERCIAL] → "Venta de ropa deportiva"
9. Guarda y genera PDF
```

### Caso 2: Contrato de Vivienda con Mascotas
```
1. Usuario crea contrato para propiedad tipo "departamento"
2. Abre editor → clic "Agregar Cláusulas"
3. Sistema muestra 8 cláusulas específicas para vivienda
4. Selecciona: Tenencia de Mascotas (opción PERMITIDAS)
5. Agrega cláusulas opcionales: Cochera + Renovación Automática
6. Confirma → se insertan
7. Edita sección de mascotas para especificar tamaño permitido
8. Guarda cambios
```

### Caso 3: Contrato General con Garantía Extendida
```
1. Usuario crea contrato para tipo "terreno" (no tiene cláusulas específicas)
2. Abre editor → clic "Agregar Cláusulas"
3. Sistema solo muestra cláusulas opcionales
4. Selecciona: Garantía Extendida + Mediación Previa
5. Confirma → se agregan al contrato
6. Completa [MONTO] de la garantía extendida
7. Guarda y descarga
```

## 🔧 Personalización

### Agregar Nuevas Cláusulas
Edita `clausulasContratos.js`:

```javascript
// Para local comercial
export const clausulasLocalComercial = {
  // ... existentes ...
  nuevaClausula: {
    titulo: "Título de la Nueva Cláusula",
    contenido: `Texto completo de la cláusula...`
  }
};

// Para vivienda
export const clausulasVivienda = {
  // ... existentes ...
  nuevaClausula: {
    titulo: "Título de la Nueva Cláusula",
    contenido: `Texto completo...`
  }
};

// Opcionales
export const clausulasOpcionales = {
  // ... existentes ...
  nuevaClausula: {
    titulo: "Título",
    contenido: `Texto...`
  }
};
```

### Agregar Nuevo Tipo de Propiedad
Modifica la función `obtenerClausulasSegunTipo` en `clausulasContratos.js`:

```javascript
export const obtenerClausulasSegunTipo = (tipoPropiedad) => {
  const tiposComerciales = ['local', 'oficina'];
  const tiposVivienda = ['casa', 'departamento', 'duplex'];
  const tiposIndustriales = ['galpon', 'fabrica']; // NUEVO

  if (tiposIndustriales.includes(tipoPropiedad?.toLowerCase())) {
    return {
      tipo: 'industrial',
      clausulas: clausulasIndustriales, // Crear este objeto
      descripcion: 'Cláusulas para Uso Industrial'
    };
  }
  // ... resto del código
};
```

## 📊 Ventajas del Sistema

✅ **Flexibilidad**: Cláusulas adaptadas al tipo de propiedad
✅ **Rapidez**: Evita escribir cláusulas desde cero
✅ **Consistencia**: Cláusulas estandarizadas y profesionales
✅ **Personalización**: Edición completa en TinyMCE
✅ **Claridad**: Preview del contenido antes de agregar
✅ **Organización**: Cláusulas categorizadas por tipo
✅ **Escalabilidad**: Fácil agregar nuevas cláusulas

## 🐛 Solución de Problemas

### Problema: No aparecen cláusulas específicas
**Causa**: El tipo de propiedad no está reconocido
**Solución**: Verifica que el tipo sea 'local', 'oficina' (comercial) o 'casa', 'departamento', 'duplex' (vivienda)

### Problema: Las cláusulas no se guardan al cerrar el editor
**Causa**: No se hizo clic en "Guardar Cambios"
**Solución**: Siempre guarda antes de cerrar el editor

### Problema: El PDF no muestra las cláusulas adicionales
**Causa**: El contrato no fue guardado con customContent
**Solución**: Abre el editor, agrega cláusulas, guarda cambios, y luego genera el PDF

### Problema: Cláusulas con [ESPECIFICAR] en el PDF
**Causa**: No se completaron los campos personalizables
**Solución**: Edita el texto en TinyMCE antes de guardar y reemplaza [ESPECIFICAR] con los datos reales

## 📝 Notas Importantes

- Las cláusulas adicionales se insertan **antes** de las cláusulas finales (DECIMA TERCERA en adelante)
- El texto **[ESPECIFICAR]** indica que debes completar información personalizada
- Puedes agregar/remover cláusulas múltiples veces antes de guardar
- El botón "Restaurar Original" elimina todas las cláusulas adicionales
- Las cláusulas seleccionadas se muestran con fondo azul en el PDF

## 🎯 Próximas Mejoras Sugeridas

[ ] Plantillas completas de contratos (además de cláusulas individuales)
[ ] Exportar/importar sets de cláusulas favoritas
[ ] Historial de cláusulas usadas por usuario
[ ] Sugerencias automáticas según el caso
[ ] Cláusulas con campos dinámicos (formulario antes de insertar)
[ ] Versiones múltiples de una misma cláusula
[ ] Búsqueda de cláusulas por palabra clave

---

**Fecha de implementación**: Marzo 2026
**Versión**: 1.0
