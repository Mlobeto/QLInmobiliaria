# Sistema de Informe de Cuotas Mensuales

## 📋 Descripción General

Componente de React que permite gestionar y controlar las cuotas de alquiler del mes seleccionado, mostrando **TODOS los contratos activos** independientemente de si tienen pagos registrados. El sistema calcula automáticamente en qué mes de contrato se encuentra cada alquiler y determina si la cuota está pagada o pendiente. Incluye funcionalidad para generar mensajes de recordatorio personalizados que se pueden copiar y enviar por WhatsApp.

## ✨ Características Principales

### 1. **Control de Cuotas Mensuales**
- **Visualización completa**: Muestra TODOS los contratos activos del mes seleccionado
- **Cálculo automático**: Determina el número de cuota basándose en la fecha de inicio del contrato
- **Cross-reference inteligente**: Verifica si existe un pago registrado para cada contrato/mes
- Separación automática entre cuotas pagadas y pendientes
- Filtros por mes, año y estado (pagadas/pendientes/todas)
- Estadísticas en tiempo real con totales por categoría

### 2. **Lógica Avanzada de Contratos**
- **Cálculo de Meses Transcurridos**: 
  ```
  mesesDesdeInicio = (añoSeleccionado - añoInicio) * 12 + (mesSeleccionado - mesInicio)
  numeroCuota = mesesDesdeInicio + 1
  ```
- **Validación de Vigencia**: Excluye contratos que aún no comenzaron o ya terminaron
- **Integración con Redux**: Utiliza `getAllLeases()` y `getAllPayments()`
- **Estado Dinámico**: Determina pagado/pendiente mediante cross-reference con PaymentReceipt

### 2. **Mensajes de Recordatorio para WhatsApp**
- Generación automática de mensajes personalizados
- Incluye datos del cliente, propiedad, monto y fecha de vencimiento
- Botón de copiar mensaje con un solo clic
- Confirmación visual cuando el mensaje se copia

### 3. **Dashboard de Estadísticas**
- **Total Cuotas**: Cantidad total de cuotas del mes
- **Pagadas**: Cantidad y monto total pagado
- **Pendientes**: Cantidad y monto total pendiente
- **Total General**: Suma de todos los montos

## 🚀 Cómo Usar el Sistema

### Paso 1: Acceder al Informe
1. Desde el panel principal, ir a **"Informes y Reportes"**
2. Hacer clic en **"Cuotas Mensuales"**
3. El sistema cargará automáticamente el mes actual

### Paso 2: Filtrar Cuotas
1. **Seleccionar Mes**: Elige el mes que deseas consultar (por defecto: mes actual)
2. **Seleccionar Año**: Elige el año correspondiente
3. **Filtrar por Estado**: 
   - "Todas" - Muestra pagadas y pendientes
   - "Pagadas" - Solo cuotas abonadas
   - "Pendientes" - Solo cuotas sin pagar

### Paso 3: Ver Estadísticas
El dashboard superior muestra automáticamente:
- 📊 Total de cuotas detectadas
- ✅ Cuotas pagadas y monto acumulado
- ❌ Cuotas pendientes y monto pendiente
- 💰 Total general del mes

### Paso 4: Generar Recordatorios
Para las cuotas **pendientes**:

1. Cada cuota pendiente muestra un botón **"Copiar recordatorio"** con ícono de WhatsApp
2. Al hacer clic, el mensaje se copia automáticamente al portapapeles
3. El botón cambia a **"¡Copiado!"** con ícono de confirmación
4. Pegar el mensaje en WhatsApp y enviarlo al cliente

#### Ejemplo de Mensaje Generado:
```
Hola Juan Pérez,

Le recordamos que tiene pendiente el pago de la cuota de alquiler correspondiente a Marzo 2026 (Cuota 12/36).

📍 Propiedad: Av. Corrientes 1234
💰 Monto: $150.000,00
📅 Fecha de vencimiento: 10/03/2026

Por favor, gestione el pago a la brevedad para evitar recargos.

Quedamos a su disposición ante cualquier consulta.

Saludos cordiales,
QL Inmobiliaria
```

## 📂 Archivos Creados/Modificados

### Nuevos Archivos
1. **`InformeCuotasMensuales.jsx`** (`QL Front/src/Components/Pagos/`)
   - Componente principal del informe de cuotas
   - Manejo de filtros, estadísticas y mensajes
   - Integración con Redux para obtener pagos

### Archivos Modificados
1. **`PanelInformes.jsx`** (`QL Front/src/Components/Admin/`)
   - Agregada nueva opción "Cuotas Mensuales"
   - Ícono: IoCalendarOutline
   - Gradiente: purple-500 to purple-600

2. **`App.jsx`** (`QL Front/src/`)
   - Importación de InformeCuotasMensuales
   - Nueva ruta protegida: `/informeCuotasMensuales`
   - Solo accesible para usuarios con rol 'admin'

## 🎨 Interfaz Visual

### Header
- **Botón Volver**: Regresa al panel de informes
- **Título**: "Informe de Cuotas Mensuales"
- **Subtítulo**: "Control de pagos y recordatorios"

### Filtros
- **Selector de Mes**: Dropdown con los 12 meses del año
- **Selector de Año**: Dropdown con rango de 5 años (actual ± 2 años)
- **Filtro de Estado**: Todas / Pagadas / Pendientes

### Dashboard de Estadísticas (4 tarjetas)
1. **Total Cuotas** (Azul)
   - Cantidad total de cuotas del período

2. **Pagadas** (Verde)
   - Cantidad de cuotas pagadas
   - Monto total pagado en ARS

3. **Pendientes** (Rojo)
   - Cantidad de cuotas pendientes
   - Monto total pendiente en ARS

4. **Total General** (Púrpura)
   - Suma total de todos los montos

### Lista de Cuotas
Cada cuota muestra:
- **Estado visual**: Ícono verde (✓) para pagadas, rojo (✗) para pendientes
- **Nombre del cliente**
- **Dirección de la propiedad**
- **Monto en pesos argentinos**
- **Fecha de pago/vencimiento**
- **Período** (ej: "Marzo 2026")
- **Número de cuota** (ej: "Cuota 12/36")
- **Botón de WhatsApp** (solo para pendientes): Genera y copia el recordatorio

### Colores y Diseño
- **Fondo**: Gradiente slate-900 a slate-800
- **Cuotas Pagadas**: Borde y fondo verde (green-500/10)
- **Cuotas Pendientes**: Borde y fondo rojo (red-500/10)
- **Botón WhatsApp**: Gradiente green-400 a green-600
- **Estado Copiado**: Verde sólido con ícono de confirmación

## 💡 Casos de Uso

### 1. Seguimiento Mensual de Cobros
**Escenario**: A principios de cada mes, el administrador revisa qué cuotas se han cobrado.

**Pasos**:
1. Acceder al informe de cuotas mensuales
2. El mes actual se selecciona automáticamente
3. Ver las estadísticas del dashboard
4. Filtrar por "Pagadas" para revisar los cobros confirmados

### 2. Recordatorios Masivos de Pago
**Escenario**: El día 10 del mes, enviar recordatorios a todos los inquilinos con cuotas pendientes.

**Pasos**:
1. Acceder al informe
2. Filtrar por "Pendientes"
3. Para cada cuota pendiente:
   - Hacer clic en "Copiar recordatorio"
   - Abrir WhatsApp Web o la aplicación
   - Buscar el contacto del cliente
   - Pegar el mensaje y enviarlo

### 3. Control de Vencimientos
**Escenario**: Verificar qué inquilinos tienen cuotas vencidas o próximas a vencer.

**Pasos**:
1. Seleccionar el mes actual
2. Filtrar por "Pendientes"
3. Revisar las fechas de vencimiento
4. Enviar recordatorios a los que tienen fecha próxima o pasada

### 4. Análisis Histórico
**Escenario**: Revisar los pagos de meses anteriores.

**Pasos**:
1. Seleccionar mes y año anteriores
2. Ver estadísticas históricas
3. Filtrar por estado para análisis específico
4. Comparar con meses actuales

## 🔧 Detalles Técnicos

### Redux Actions Utilizadas
- `getAllPayments()`: Obtiene todos los pagos registrados en el sistema
- `getAllLeases()`: **CRÍTICO** - Obtiene todos los contratos de alquiler con información de Tenant y Property
- Los contratos activos se procesan para generar las cuotas del mes
- Los pagos se cruzan por `leaseId` + mes + año para determinar estado

### Estructura de Datos

#### Lease (Contrato):
```javascript
{
  id: number,
  startDate: Date,           // Fecha de inicio del contrato
  rentAmount: number,        // Monto de la cuota mensual
  totalMonths: number,       // Duración total del contrato
  status: 'active',          // Solo se procesan contratos activos
  tenantId: number,
  propertyId: number,
  Tenant: {
    id: number,
    name: string             // Nombre del inquilino
  },
  Property: {
    id: number,
    address: string          // Dirección de la propiedad
  }
}
```

#### PaymentReceipt (Pago):
```javascript
{
  id: number,
  leaseId: number,           // Relación con el contrato
  amount: number,
  paymentDate: Date,
  period: string,
  type: 'installment',       // Solo se consideran cuotas, no initial_payment ni otros
  // ... otros campos
}
```

#### Cuota Generada (Estructura Calculada):
```javascript
{
  contratoId: number,
  pagoId: number | undefined,
  nombreCliente: string,
  direccionPropiedad: string,
  monto: number,
  fechaVencimiento: Date,    // Día 10 del mes seleccionado
  periodo: string,           // "Marzo 2026"
  numeroCuota: string,       // "(Cuota 12/36)"
  esPagada: boolean,         // !!pagoRegistrado
  fechaPago: Date | undefined,
  cliente: Tenant,           // Objeto completo del inquilino
  propiedad: Property,       // Objeto completo de la propiedad
  contrato: Lease            // Objeto completo del contrato
}
```

### Lógica de Determinación de Estado

**CAMBIO CRÍTICO**: El sistema ya NO filtra solo pagos registrados. Ahora:

1. **Obtiene TODOS los contratos activos** mediante `getAllLeases()`
2. **Calcula el número de cuota** para el mes seleccionado:
   ```javascript
   const fechaInicio = new Date(contrato.startDate);
   const mesesDesdeInicio = (añoSeleccionado - fechaInicio.getFullYear()) * 12 + 
                            (mesSeleccionado - (fechaInicio.getMonth() + 1));
   
   // Validaciones
   if (mesesDesdeInicio < 0) return null;  // Contrato aún no comenzó
   if (mesesDesdeInicio >= contrato.totalMonths) return null;  // Contrato terminó
   
   const numeroCuota = mesesDesdeInicio + 1;
   ```

3. **Cross-reference con pagos** para determinar si está pagada:
   ```javascript
   const pagoRegistrado = payments.find(pago => 
     pago.leaseId === contrato.id && 
     pago.type === 'installment' &&
     new Date(pago.paymentDate).getMonth() === mesSeleccionado - 1 &&
     new Date(pago.paymentDate).getFullYear() === añoSeleccionado
   );
   
   const esPagada = !!pagoRegistrado;
   ```

4. **Devuelve la cuota** con toda la información, tenga o no pago registrado

**Antes (INCORRECTO)**:
```javascript
// ❌ Solo mostraba pagos registrados
const cuotasDelMes = payments.filter(p => p.type === 'installment' && matchMonth);
```

**Ahora (CORRECTO)**:
```javascript
// ✅ Muestra todos los contratos activos, pagados o no
const cuotasDelMes = leases
  .filter(l => l.status === 'active')
  .map(contrato => {
    // Calcula cuota, verifica pago, retorna objeto completo
  })
  .filter(Boolean);
```

### Generación de Mensajes
La función `generarMensajeRecordatorio()` crea un mensaje personalizado con:
- Saludo con nombre del cliente
- Detalle del período y cuota
- Dirección de la propiedad
- Monto formateado en ARS
- Fecha de vencimiento
- Firma institucional

**Solo se genera para cuotas pendientes** (`!cuota.esPagada`)

## 📊 Mejoras Futuras Sugeridas

### Backend (Opcional)
1. **Endpoint específico para cuotas mensuales**
   ```javascript
   GET /api/payments/monthly/:year/:month
   ```
   - Filtrado en el servidor para mejor performance
   - Reduce carga de datos en el frontend

2. **Campo de estado en modelo Payment**
   ```javascript
   status: {
     type: Sequelize.ENUM('pending', 'paid', 'overdue'),
     defaultValue: 'pending'
   }
   ```

3. **Recordatorios automáticos**
   - Cron job que envía recordatorios automáticamente
   - Configuración de días antes del vencimiento

### Frontend
1. **Envío directo de WhatsApp**
   - Integrar con WhatsApp Business API
   - Envío automático sin copiar/pegar

2. **Exportación a Excel**
   - Botón para descargar informe en formato .xlsx

3. **Gráficos estadísticos**
   - Chart.js o Recharts para visualización
   - Tendencias de pagos por mes

4. **Notificaciones push**
   - Alertas cuando una cuota se marca como pagada
   - Recordatorios de cuotas próximas a vencer

## 🔒 Seguridad y Permisos

- **Acceso Restringido**: Solo usuarios con rol `admin` pueden acceder
- **Protección de Rutas**: Implementada con `RoleBasedRoute`
- **Validación de Permisos**: Verificación en el componente antes de renderizar
- **Datos Sensibles**: Los mensajes incluyen información confidencial, copiar con precaución

## 🎯 Ventajas del Sistema

✅ **Centralización**: Todo el control de cuotas en un solo lugar
✅ **Ahorro de Tiempo**: Mensajes predefinidos y personalizables
✅ **Trazabilidad**: Visualización clara de estado de pagos
✅ **Profesionalismo**: Mensajes consistentes y bien formateados
✅ **Filtrado Flexible**: Múltiples opciones de visualización
✅ **Estadísticas en Tiempo Real**: Dashboard actualizado automáticamente
✅ **Mobile Friendly**: Diseño responsive adaptable a dispositivos móviles

## 📱 Compatibilidad

- ✅ WhatsApp Web
- ✅ WhatsApp Desktop
- ✅ WhatsApp Mobile (copiar y pegar desde navegador móvil)
- ✅ Todos los navegadores modernos con soporte de Clipboard API

## 🐛 Solución de Problemas

### "No hay cuotas para el período seleccionado"
- **Verificar contratos activos**: Confirmar que existan contratos con `status: 'active'` en ese período
- **Revisar fechas de inicio**: El contrato debe haber comenzado antes o durante el mes seleccionado
- **Verificar duración**: El contrato no debe haber terminado (`mesesDesdeInicio < totalMonths`)
- **Comprobar Redux**: Asegurarse de que `getAllLeases()` se ejecutó correctamente

### "Faltan contratos en la lista" (PROBLEMA RESUELTO)
**Problema anterior**: El componente solo mostraba contratos con pagos registrados en la base de datos, omitiendo contratos activos sin pagos.

**Solución implementada**: 
- El sistema ahora obtiene TODOS los contratos activos mediante `getAllLeases()`
- Calcula el número de cuota para cada contrato basándose en su fecha de inicio
- Realiza cross-reference con `payments` para determinar estado
- **Resultado**: Se listan todos los contratos activos, tengan o no pagos registrados

**Indicadores del problema**:
- Muchos menos contratos de los esperados en el informe
- Solo aparecen contratos que tienen al menos un pago en el sistema
- Contratos nuevos o sin pagos no aparecen

**Validación de la corrección**:
```javascript
// ✅ Correcto: Se ven N contratos activos
const contratosActivos = leases.filter(l => l.status === 'active').length;

// ✅ Correcto: Algunos con pago, otros sin pago
const cuotasPagadas = cuotasDelMes.filter(c => c.esPagada).length;
const cuotasPendientes = cuotasDelMes.filter(c => !c.esPagada).length;
```

### "Fechas de vencimiento incorrectas"
- Las fechas de vencimiento se calculan como día 10 del mes seleccionado
- Para cambiar este comportamiento, modificar el cálculo en `cuotasDelMes`:
  ```javascript
  const fechaVencimiento = new Date(añoSeleccionado, mesSeleccionado - 1, 10);
  // Cambiar '10' por el día deseado
  ```

### "Número de cuota incorrecto"
- Verificar que `startDate` del contrato esté correctamente registrado
- La fórmula es: `numeroCuota = mesesDesdeInicio + 1`
- Ejemplo: Contrato inicia en Enero 2025, consulta Marzo 2025 → Cuota 3

### "No se puede copiar el mensaje de WhatsApp"
- **Permisos del navegador**: Algunos navegadores requieren permisos para la Clipboard API
- **HTTPS requerido**: La función `navigator.clipboard` solo funciona en contextos seguros
- **Alternativa**: Copiar manualmente el texto del mensaje si aparece un error

### "El botón de WhatsApp no aparece"
- Los botones solo se muestran para **cuotas pendientes** (`!cuota.esPagada`)
- Verificar que el filtro no esté en "Pagadas"
- Las cuotas con `esPagada: true` no muestran el botón de recordatorio

### El botón "Copiar recordatorio" no funciona
- Verificar permisos del navegador para acceder al portapapeles
- Usar HTTPS (la Clipboard API requiere conexión segura)
- Probar en otro navegador

### Las cuotas no se clasifican correctamente como pagadas/pendientes
- Revisar la fecha de los pagos en la base de datos
- Considerar implementar campo `status` en el modelo
- Verificar zona horaria del servidor y cliente

## 📞 Soporte

Para consultas sobre este componente:
1. Revisar esta documentación
2. Verificar logs de consola para errores
3. Revisar el estado de Redux con DevTools
4. Consultar con el equipo de desarrollo

---

**Última actualización**: Marzo 2026  
**Versión**: 1.0.0  
**Autor**: QL Inmobiliaria Development Team
