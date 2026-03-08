# Sistema de Informe de Cuotas Mensuales

## 📋 Descripción General

Componente de React que permite gestionar y controlar las cuotas de alquiler del mes actual (o cualquier mes seleccionado), mostrando cuáles están pagadas y cuáles pendientes. Incluye funcionalidad para generar mensajes de recordatorio personalizados que se pueden copiar y enviar por WhatsApp.

## ✨ Características Principales

### 1. **Control de Cuotas Mensuales**
- Visualización de todas las cuotas de alquiler del mes seleccionado
- Separación automática entre cuotas pagadas y pendientes
- Filtros por mes, año y estado (pagadas/pendientes/todas)
- Estadísticas en tiempo real con totales por categoría

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
- Los pagos se filtran en el frontend por tipo (`installment`), mes y año

### Estructura de Datos
Cada pago (cuota) incluye:
```javascript
{
  id: number,
  amount: number,
  paymentDate: Date,
  period: string,
  type: 'installment',
  installmentNumber: number,
  totalInstallments: number,
  Client: {
    id: number,
    name: string
  },
  Lease: {
    id: number,
    Property: {
      address: string
    }
  }
}
```

### Lógica de Determinación de Estado
```javascript
// Simplificación actual
const fechaPago = new Date(payment.paymentDate);
const hoy = new Date();
const esPagada = fechaPago <= hoy;
```

**Nota**: Esta lógica podría mejorarse agregando un campo `status` en el modelo de pagos para diferenciar explícitamente:
- "pending" - Pendiente de pago
- "paid" - Pagado
- "overdue" - Vencido

### Generación de Mensajes
La función `generarMensajeRecordatorio()` crea un mensaje personalizado con:
- Saludo con nombre del cliente
- Detalle del período y cuota
- Dirección de la propiedad
- Monto formateado en ARS
- Fecha de vencimiento
- Firma institucional

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
- Verificar que existan contratos activos en ese período
- Confirmar que los pagos estén registrados correctamente
- Revisar que el tipo de pago sea `installment`

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
