# 📄 Sistema de Autorización de Venta Editable

## 📅 Fecha: 30 de Enero 2026

## ✨ Funcionalidad Implementada

Se ha creado un **sistema completo de gestión de autorizaciones de venta** que permite:

✅ Editar y actualizar los datos de la autorización las veces que sea necesario  
✅ Guardar la información en la base de datos  
✅ Regenerar el PDF actualizado en cualquier momento  
✅ Actualizar la autorización cuando pase tiempo (ej: después de un año)

---

## 🗂️ Archivos Creados/Modificados

### Backend

#### 1. **Modelo Property** - `back/src/data/models/Property.js`
**Agregado:**
```javascript
saleAuthorizationData: {
  type: DataTypes.JSONB,
  allowNull: true,
  defaultValue: null,
  // Estructura: {ownerName, ownerCuil, ownerAddress, propertyDescription, 
  //              salePrice, commission, validityDays, createdDate, 
  //              lastUpdated, customText, socio}
}
```

#### 2. **Controlador** - `back/src/controllers/createSaleAuthorization.js`
**Funciones nuevas:**
- `createOrUpdateSaleAuthorization` - POST `/api/property/:propertyId/sale-authorization`
- `getSaleAuthorization` - GET `/api/property/:propertyId/sale-authorization`

#### 3. **Rutas** - `back/src/routes/property.js`
**Agregadas:**
```javascript
router.get("/:propertyId/sale-authorization", getSaleAuthorization);
router.post("/:propertyId/sale-authorization", createSaleAuthorization);
```

#### 4. **Migración SQL** - `back/migrations/add-sale-authorization-data.sql`
```sql
ALTER TABLE "Property" 
ADD COLUMN IF NOT EXISTS "saleAuthorizationData" JSONB DEFAULT NULL;
```

#### 5. **Scripts de migración**
- `ejecutar-migracion-sale-auth.sh` (Linux/Mac)
- `ejecutar-migracion-sale-auth.bat` (Windows)

---

### Frontend

#### 1. **Modal de Edición** - `QL Front/src/Components/Propiedades/EditSaleAuthorizationModal.jsx`
**Nuevo componente completo** con:
- Formulario para editar todos los datos de la autorización
- Validación de campos
- Carga automática de datos existentes
- Guardado en base de datos
- Interfaz moderna con Tailwind CSS

**Campos editables:**
- Nombre del propietario
- CUIL/CUIT
- Domicilio del propietario
- Socio (opcional)
- Descripción de la propiedad
- Precio de venta
- Comisión
- Días de validez (default: 360)
- Texto personalizado

#### 2. **Generador PDF** - `QL Front/src/Components/PdfTemplates/AutorizacionVentaPdf.jsx`
**Actualizado completamente:**
- Carga datos guardados desde la BD
- Genera PDF con información actualizada
- Botón "Editar" para abrir el modal
- Botón "Generar PDF" para descargar
- Formato mejorado según especificaciones

**Cambios en el formato del PDF:**
- Título: "AUTORIZACION DE VENTA" (mayúsculas con línea)
- Texto introductorio actualizado
- PRIMERO: Describe tipo de propiedad y superficie
- SEGUNDA: Precio con referencia al precio de referencia
- TERCERO: Autorización de publicidad (sin cambios)
- CUARTO: Validez y comisión fija del 4%
- Firmas: Propietario y Arq. Mariana Lobeto (Q+L Servicios)

#### 3. **Listado de Propiedades** - `QL Front/src/Components/Propiedades/Listado.jsx`
**Agregado:**
- Importación de componentes nuevos
- Estado para controlar el modal de autorización
- Botones de edición y generación solo para propiedades en **venta**
- Modal de autorización integrado

---

## 🚀 Cómo Usar

### 1. **Ejecutar la migración** (solo una vez)

**En Windows:**
```bash
ejecutar-migracion-sale-auth.bat
```

**En Linux/Mac:**
```bash
chmod +x ejecutar-migracion-sale-auth.sh
./ejecutar-migracion-sale-auth.sh
```

**O manualmente:**
```bash
psql "$DATABASE_URL" -f back/migrations/add-sale-authorization-data.sql
```

### 2. **Reiniciar el servidor backend**
```bash
cd back
npm start
```

### 3. **Desde el frontend**

#### En el listado de propiedades:
1. Busca una propiedad **en venta**
2. Verás dos nuevos botones:
   - 🔵 **Editar** - Abre el modal para editar/crear la autorización
   - 🟡 **Generar PDF** - Descarga el PDF con los datos guardados

#### Primera vez (sin datos guardados):
1. Click en **"Editar"**
2. Completa los datos del formulario
3. Click en **"Guardar Autorización"**
4. Ahora puedes generar el PDF

#### Actualizar después de un tiempo:
1. Click en **"Editar"** nuevamente
2. Modifica los datos necesarios (precio, fecha, etc.)
3. Click en **"Guardar Autorización"**
4. Genera el PDF actualizado

---

## 📊 Estructura de Datos

### Objeto `saleAuthorizationData` (JSON en PostgreSQL)

```javascript
{
  ownerName: "Juan Pérez",
  ownerCuil: "20-12345678-9",
  ownerAddress: "Av. Siempre Viva 123",
  socio: "María González", // opcional
  propertyDescription: "Casa de 3 dormitorios...",
  salePrice: 150000,
  commission: 4,
  validityDays: 360,
  createdDate: "2026-01-30T12:00:00.000Z",
  lastUpdated: "2026-01-30T12:00:00.000Z",
  customText: "Texto adicional opcional"
}
```

---

## 🎯 Casos de Uso

### Caso 1: Primera autorización
1. Cliente trae una propiedad para vender
2. Cargas la propiedad en el sistema
3. Editas la autorización desde el listado
4. Guardas los datos
5. Generas el PDF para que firme el cliente

### Caso 2: Actualización después de un año
1. La propiedad no se vendió en 360 días
2. Necesitas renovar la autorización
3. Abres "Editar" en la misma propiedad
4. Actualizas el precio (si cambió)
5. Los campos ya están pre-cargados
6. Guardas y generas nuevo PDF con fecha actualizada

### Caso 3: Cambio de precio
1. El propietario decide bajar el precio
2. Editas la autorización
3. Cambias solo el campo "salePrice"
4. Guardas y regeneras PDF

---

## 🔧 API Endpoints

### GET `/api/property/:propertyId/sale-authorization`
**Obtiene los datos de la autorización**

**Response:**
```json
{
  "success": true,
  "property": {
    "propertyId": 123,
    "address": "Av. Cuba 50",
    "city": "Belén",
    ...
  },
  "authorization": {
    "ownerName": "Juan Pérez",
    "ownerCuil": "20-12345678-9",
    ...
  },
  "client": {
    "name": "Juan Pérez",
    "cuil": "20-12345678-9",
    "address": "..."
  }
}
```

### POST `/api/property/:propertyId/sale-authorization`
**Crea o actualiza la autorización**

**Body:**
```json
{
  "ownerName": "Juan Pérez",
  "ownerCuil": "20-12345678-9",
  "ownerAddress": "Av. Siempre Viva 123",
  "propertyDescription": "Casa de 3 dormitorios",
  "salePrice": 150000,
  "commission": 4,
  "validityDays": 360,
  "customText": "Observaciones adicionales",
  "socio": "María González"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Autorización de venta guardada/actualizada correctamente",
  "data": { /* datos guardados */ }
}
```

---

## ✅ Ventajas del Sistema

1. **✨ Editable**: Los datos se pueden modificar infinitas veces
2. **💾 Persistente**: Todo se guarda en la base de datos
3. **🔄 Actualizable**: Perfecto para renovar autorizaciones vencidas
4. **📋 Pre-cargado**: Al editar, muestra los datos existentes
5. **🎯 Específico**: Solo aparece en propiedades en venta
6. **📄 Profesional**: PDF con formato mejorado y consistente
7. **⏰ Trazable**: Guarda fechas de creación y última modificación

---

## 🧪 Testing Recomendado

1. ✅ Crear autorización para una propiedad nueva
2. ✅ Editar autorización existente
3. ✅ Generar PDF antes de guardar datos (debe usar defaults)
4. ✅ Generar PDF después de guardar datos
5. ✅ Actualizar solo un campo y regenerar PDF
6. ✅ Verificar que solo aparece en propiedades "venta"
7. ✅ Verificar formato del PDF generado

---

## 📝 Notas Importantes

- El campo `saleAuthorizationData` es **opcional** (nullable)
- Si no hay datos guardados, el PDF usa información de la propiedad y cliente
- La comisión en el PDF está fija en **4%** según especificaciones
- El campo `socio` es opcional y se puede dejar vacío
- La fecha del PDF es la fecha de creación original (no la actual)
- Los botones solo aparecen cuando `property.type === 'venta'`

---

## 🎨 Interfaz

### Botones en la Card de Propiedad (solo venta):
```
┌────────────────────────────────────┐
│  🔵 Editar  🟡 Generar PDF        │
└────────────────────────────────────┘
```

### Modal de Edición:
- Header color ámbar/naranja con ícono de documento
- Secciones organizadas por categoría
- Campos pre-cargados con datos existentes
- Validación de campos requeridos
- Mensajes de éxito/error
- Diseño responsive

---

## 🚀 Próximos Pasos (Opcional)

- [ ] Agregar historial de versiones de la autorización
- [ ] Notificación automática cuando faltan 30 días para vencer
- [ ] Exportar autorización a Word para edición manual
- [ ] Firma digital integrada
- [ ] Email automático con el PDF al cliente

---

**¡Sistema completamente funcional y listo para usar! 🎉**
