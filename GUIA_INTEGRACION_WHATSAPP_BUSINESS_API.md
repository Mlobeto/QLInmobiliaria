# Guía de Integración WhatsApp Business Cloud API (Meta)

## 📋 Descripción General

Esta guía detalla paso a paso cómo integrar la **WhatsApp Business Cloud API de Meta** en la aplicación QL Inmobiliaria para enviar recordatorios automáticos de cuotas directamente desde el sistema, sin necesidad de copiar y pegar mensajes manualmente.

## ✨ Ventajas de esta Solución

- ✅ **Oficial de Meta/Facebook** - Cumple 100% con términos de servicio
- ✅ **Gratuita hasta 1000 conversaciones/mes** - Ideal para inmobiliarias pequeñas/medianas
- ✅ **No requiere teléfono físico activo** - Funciona con número empresarial
- ✅ **Envíos programados y automatizados** - Desde el backend
- ✅ **Plantillas aprobadas** - Mensajes profesionales y consistentes
- ✅ **Trazabilidad completa** - Historial de todos los envíos
- ✅ **Escalable** - Crece con tu negocio

## 💰 Costos

- **Gratis**: Primeras 1000 conversaciones por mes
- **Después**: ~$0.005-$0.01 USD por mensaje (muy económico)
- **Sin suscripción mensual**: Solo pagas por uso

---

## 🚀 PASO 1: Crear y Configurar Cuenta de Meta Business

### 1.1. Crear Cuenta de Meta Business
1. Ir a [business.facebook.com](https://business.facebook.com)
2. Hacer clic en **"Crear cuenta"**
3. Ingresar:
   - Nombre del negocio: "QL Inmobiliaria"
   - Tu nombre
   - Email empresarial
4. Confirmar email y completar configuración

### 1.2. Configurar Información del Negocio
1. En Meta Business Suite, ir a **"Configuración del negocio"**
2. Completar:
   - Dirección de la inmobiliaria
   - Sitio web (si existe)
   - Descripción del negocio
3. Guardar cambios

**⏱️ Tiempo estimado:** 15-20 minutos

---

## 🚀 PASO 2: Crear Aplicación en Meta for Developers

### 2.1. Acceder a Meta for Developers
1. Ir a [developers.facebook.com](https://developers.facebook.com)
2. Iniciar sesión con la cuenta de Meta Business
3. Hacer clic en **"Mis aplicaciones"** → **"Crear app"**

### 2.2. Configurar la Aplicación
1. Seleccionar tipo: **"Empresa"**
2. Completar información:
   - **Nombre de la app**: "QL Inmobiliaria WhatsApp"
   - **Email de contacto**: Tu email empresarial
   - **Cuenta de empresa**: Seleccionar "QL Inmobiliaria"
3. Hacer clic en **"Crear app"**

### 2.3. Agregar Producto WhatsApp
1. En el panel de la app, buscar **"WhatsApp"**
2. Hacer clic en **"Configurar"**
3. Aceptar términos y condiciones

**⏱️ Tiempo estimado:** 10 minutos

---

## 🚀 PASO 3: Configurar Número de Teléfono

### 3.1. Opciones de Número

**Opción A - Usar Número de Prueba (para desarrollo):**
- Meta proporciona un número temporal
- Puedes enviar mensajes solo a 5 números pre-autorizados
- **Ideal para testing inicial**

**Opción B - Registrar Número Real (para producción):**
1. Necesitas un número que **no esté** registrado en WhatsApp personal
2. Puede ser:
   - Un número nuevo
   - Un número empresarial existente sin WhatsApp
3. **NO** puede ser un número que ya use WhatsApp personal

### 3.2. Registrar Número de Producción

1. En el panel de WhatsApp, ir a **"Empezar"** → **"Agregar número de teléfono"**
2. Seleccionar **"Registrar tu número de teléfono"**
3. Ingresar:
   - **Código de país**: +54 (Argentina)
   - **Número de teléfono**: 11 XXXX XXXX
   - **Nombre para mostrar**: "QL Inmobiliaria"
4. Verificar el número:
   - Elegir método: SMS o llamada telefónica
   - Ingresar código de verificación de 6 dígitos
5. Confirmar y guardar

### 3.3. Obtener Credenciales

Después de configurar el número, necesitarás:

1. **Phone Number ID:**
   - Se encuentra en la sección "Phone Numbers"
   - Ejemplo: `102458629123456`
   - Copiar y guardar en lugar seguro

2. **WhatsApp Business Account ID:**
   - Se encuentra en la barra lateral
   - Ejemplo: `123456789012345`
   - Copiar y guardar

3. **Access Token (Temporal):**
   - En "API Setup", hay un token de 24 horas
   - **Solo para testing inicial**
   - Luego crearemos uno permanente

**⏱️ Tiempo estimado:** 20-30 minutos

---

## 🚀 PASO 4: Crear Token de Acceso Permanente

### 4.1. Crear System User

1. Ir a **Meta Business Suite** → **"Configuración del negocio"**
2. En el menú lateral, seleccionar **"Usuarios del sistema"**
3. Hacer clic en **"Agregar"**
4. Configurar:
   - **Nombre**: "QL WhatsApp API"
   - **Rol**: Administrador
5. Hacer clic en **"Crear usuario del sistema"**

### 4.2. Generar Token Permanente

1. Seleccionar el system user creado
2. Hacer clic en **"Generar nuevo token"**
3. Seleccionar la app: "QL Inmobiliaria WhatsApp"
4. Permisos necesarios:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
5. Seleccionar duración: **"Nunca caduca"** (o 60 días si prefieres rotación)
6. Hacer clic en **"Generar token"**
7. **IMPORTANTE**: Copiar el token y guardarlo de forma segura
   - No se volverá a mostrar
   - Guardarlo en un gestor de contraseñas o archivo .env

**⏱️ Tiempo estimado:** 10 minutos

---

## 🚀 PASO 5: Crear y Aprobar Plantillas de Mensajes

### 5.1. ¿Por qué Plantillas?

WhatsApp Business API **requiere** que todos los mensajes iniciados por la empresa usen plantillas pre-aprobadas por Meta. Esto asegura que no se envíe spam.

### 5.2. Crear Plantilla de Recordatorio de Cuota

1. En el panel de WhatsApp, ir a **"Message Templates"**
2. Hacer clic en **"Create Template"**
3. Configurar:

**Información Básica:**
- **Nombre de la plantilla**: `recordatorio_cuota_alquiler`
- **Categoría**: `UTILITY` (servicios/utilidades)
- **Idiomas**: Español (es)

**Contenido del Mensaje:**

```
Hola {{1}},

Le recordamos que tiene pendiente el pago de la cuota de alquiler correspondiente a {{2}}.

📍 Propiedad: {{3}}
💰 Monto: {{4}}
📅 Fecha de vencimiento: {{5}}

Por favor, gestione el pago a la brevedad para evitar recargos.

Quedamos a su disposición ante cualquier consulta.

Saludos cordiales,
QL Inmobiliaria
```

**Variables (5 parámetros):**
1. `{{1}}` - Nombre del cliente
2. `{{2}}` - Período (ej: "Marzo 2026")
3. `{{3}}` - Dirección de la propiedad
4. `{{4}}` - Monto formateado
5. `{{5}}` - Fecha de vencimiento

4. Hacer clic en **"Submit"**

### 5.3. Esperar Aprobación

- **Tiempo de aprobación**: Generalmente 1-24 horas
- **Notificación**: Recibirás email cuando sea aprobada
- **Estado**: Puedes revisar en "Message Templates"

### 5.4. Plantillas Adicionales (Opcionales)

Puedes crear más plantillas para:

**Confirmación de Pago:**
```
Hola {{1}},

Confirmamos la recepción del pago de la cuota de alquiler de {{2}}.

✅ Monto: {{3}}
📅 Fecha: {{4}}

Gracias por su puntualidad.

QL Inmobiliaria
```

**Aviso de Vencimiento Próximo (3 días antes):**
```
Hola {{1}},

Le recordamos que el {{2}} vence la cuota de alquiler de {{3}}.

💰 Monto: {{4}}

Puede realizar el pago para evitar recargos.

QL Inmobiliaria
```

**⏱️ Tiempo estimado:** 15 minutos + 1-24 horas de aprobación

---

## 🚀 PASO 6: Implementación en el Backend

### 6.1. Instalar Dependencia

```bash
cd back
npm install axios
```

### 6.2. Configurar Variables de Entorno

Editar `back/.env`:

```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=102458629123456
WHATSAPP_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
WHATSAPP_API_VERSION=v18.0
```

### 6.3. Crear Servicio de WhatsApp

Crear archivo `back/src/services/whatsappService.js`:

```javascript
const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.token = process.env.WHATSAPP_TOKEN;
    this.apiVersion = process.env.WHATSAPP_API_VERSION || 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}`;
  }

  /**
   * Enviar recordatorio de cuota usando plantilla aprobada
   */
  async enviarRecordatorioCuota({ telefono, nombreCliente, periodo, direccion, monto, fechaVencimiento }) {
    try {
      // Validar formato de teléfono (debe incluir código de país sin +)
      const telefonoFormateado = this.formatearTelefono(telefono);
      
      // Formatear monto
      const montoFormateado = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(monto);

      // Formatear fecha
      const fechaFormateada = new Date(fechaVencimiento).toLocaleDateString('es-AR');

      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          messaging_product: "whatsapp",
          to: telefonoFormateado,
          type: "template",
          template: {
            name: "recordatorio_cuota_alquiler",
            language: {
              code: "es"
            },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: nombreCliente },
                  { type: "text", text: periodo },
                  { type: "text", text: direccion },
                  { type: "text", text: montoFormateado },
                  { type: "text", text: fechaFormateada }
                ]
              }
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        whatsappId: response.data.contacts[0].wa_id
      };

    } catch (error) {
      console.error('Error al enviar WhatsApp:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  /**
   * Formatear teléfono al formato requerido por WhatsApp
   * Ejemplo: +54 911 1234 5678 → 5491112345678
   */
  formatearTelefono(telefono) {
    // Remover todos los caracteres no numéricos
    let numero = telefono.replace(/\D/g, '');
    
    // Si comienza con 0, removerlo (número argentino sin código internacional)
    if (numero.startsWith('0')) {
      numero = numero.substring(1);
    }
    
    // Si no comienza con 54, agregarlo (código de Argentina)
    if (!numero.startsWith('54')) {
      numero = '54' + numero;
    }
    
    return numero;
  }

  /**
   * Verificar estado de la API de WhatsApp
   */
  async verificarConexion() {
    try {
      const response = await axios.get(
        `${this.baseUrl}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
}

module.exports = new WhatsAppService();
```

### 6.4. Crear Controlador

Crear archivo `back/src/controllers/whatsappController.js`:

```javascript
const whatsappService = require('../services/whatsappService');
const { Lease, Tenant, Property } = require('../db');

const enviarRecordatorioCuota = async (req, res) => {
  try {
    const { contratoId, cuotaInfo } = req.body;

    // Validar permisos (solo admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para enviar mensajes' 
      });
    }

    // Obtener información del contrato
    const contrato = await Lease.findByPk(contratoId, {
      include: [
        { model: Tenant, attributes: ['id', 'name', 'phone'] },
        { model: Property, attributes: ['id', 'address'] }
      ]
    });

    if (!contrato) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contrato no encontrado' 
      });
    }

    // Verificar que el tenant tenga teléfono
    if (!contrato.Tenant.phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'El cliente no tiene número de teléfono registrado' 
      });
    }

    // Enviar mensaje de WhatsApp
    const resultado = await whatsappService.enviarRecordatorioCuota({
      telefono: contrato.Tenant.phone,
      nombreCliente: contrato.Tenant.name,
      periodo: cuotaInfo.periodo,
      direccion: contrato.Property.address,
      monto: cuotaInfo.monto,
      fechaVencimiento: cuotaInfo.fechaVencimiento
    });

    if (resultado.success) {
      // TODO: Guardar registro del mensaje en base de datos
      // await WhatsAppMessage.create({
      //   leaseId: contratoId,
      //   tenantId: contrato.tenantId,
      //   messageId: resultado.messageId,
      //   tipo: 'recordatorio_cuota',
      //   status: 'sent'
      // });

      return res.json({
        success: true,
        message: 'Recordatorio enviado exitosamente',
        data: resultado
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el mensaje',
        error: resultado.error
      });
    }

  } catch (error) {
    console.error('Error en enviarRecordatorioCuota:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error del servidor',
      error: error.message 
    });
  }
};

const verificarEstado = async (req, res) => {
  try {
    const resultado = await whatsappService.verificarConexion();
    
    return res.json({
      success: resultado.success,
      message: resultado.success ? 'Conexión exitosa' : 'Error de conexión',
      data: resultado.data,
      error: resultado.error
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error al verificar estado',
      error: error.message 
    });
  }
};

module.exports = {
  enviarRecordatorioCuota,
  verificarEstado
};
```

### 6.5. Crear Rutas

Crear archivo `back/src/routes/whatsapp.routes.js`:

```javascript
const express = require('express');
const router = express.Router();
const { enviarRecordatorioCuota, verificarEstado } = require('../controllers/whatsappController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /api/whatsapp/enviar-recordatorio
router.post('/enviar-recordatorio', enviarRecordatorioCuota);

// GET /api/whatsapp/verificar-estado
router.get('/verificar-estado', verificarEstado);

module.exports = router;
```

### 6.6. Registrar Rutas en index.js

Editar `back/index.js`:

```javascript
// ... otros imports
const whatsappRoutes = require('./src/routes/whatsapp.routes');

// ... después de otras rutas
app.use('/api/whatsapp', whatsappRoutes);
```

**⏱️ Tiempo estimado:** 1-2 horas

---

## 🚀 PASO 7: Implementación en el Frontend

### 7.1. Crear Acción de Redux

Editar `QL Front/src/redux/Actions/actions.js`:

```javascript
// Agregar al final del archivo

export const enviarWhatsAppRecordatorio = (datos) => async (dispatch) => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await axios.post(
      `/api/whatsapp/enviar-recordatorio`,
      {
        contratoId: datos.contratoId,
        cuotaInfo: {
          periodo: datos.periodo,
          monto: datos.monto,
          fechaVencimiento: datos.fechaVencimiento
        }
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    dispatch({ type: 'SET_LOADING', payload: false });

    return response.data;

  } catch (error) {
    dispatch({ type: 'SET_LOADING', payload: false });
    console.error('Error al enviar WhatsApp:', error);
    throw error;
  }
};
```

### 7.2. Modificar InformeCuotasMensuales.jsx

Agregar import al inicio del archivo:

```javascript
import { enviarWhatsAppRecordatorio } from '../../redux/Actions/actions';
```

Agregar estados para el modal de confirmación:

```javascript
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [cuotaSeleccionada, setCuotaSeleccionada] = useState(null);
const [enviandoWhatsApp, setEnviandoWhatsApp] = useState(false);
```

Agregar función para enviar mensaje:

```javascript
// Función para abrir modal de confirmación
const confirmarEnvio = (cuota) => {
  setCuotaSeleccionada(cuota);
  setShowConfirmModal(true);
};

// Función para enviar recordatorio por WhatsApp
const enviarRecordatorio = async () => {
  if (!cuotaSeleccionada) return;

  try {
    setEnviandoWhatsApp(true);

    const resultado = await dispatch(enviarWhatsAppRecordatorio({
      contratoId: cuotaSeleccionada.contratoId,
      periodo: cuotaSeleccionada.periodo,
      monto: cuotaSeleccionada.monto,
      fechaVencimiento: cuotaSeleccionada.fechaVencimiento
    }));

    if (resultado.success) {
      alert('✅ Recordatorio enviado exitosamente por WhatsApp');
      setShowConfirmModal(false);
      setCuotaSeleccionada(null);
    } else {
      alert('❌ Error al enviar el recordatorio: ' + (resultado.message || 'Error desconocido'));
    }

  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error al enviar el recordatorio. Por favor, intenta nuevamente.');
  } finally {
    setEnviandoWhatsApp(false);
  }
};
```

Reemplazar el botón de "Copiar recordatorio" con botón de "Enviar por WhatsApp":

Buscar esta sección:
```javascript
{!cuota.esPagada && mensaje && (
  <div className="flex items-center gap-2">
    <button
      onClick={() => copiarMensaje(mensaje, index)}
      className={...}
    >
      {/* Contenido del botón copiar */}
    </button>
  </div>
)}
```

Reemplazar con:
```javascript
{!cuota.esPagada && (
  <div className="flex items-center gap-2">
    {/* Botón para copiar (mantener como backup) */}
    <button
      onClick={() => copiarMensaje(generarMensajeRecordatorio(cuota), index)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
        copiedIndex === index
          ? 'bg-blue-500 text-white'
          : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/30'
      }`}
      title="Copiar mensaje"
    >
      {copiedIndex === index ? (
        <IoCheckmarkCircleOutline className="w-5 h-5" />
      ) : (
        <IoCopyOutline className="w-5 h-5" />
      )}
    </button>

    {/* Botón para enviar por WhatsApp */}
    <button
      onClick={() => confirmarEnvio(cuota)}
      disabled={!cuota.cliente?.phone}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        !cuota.cliente?.phone
          ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700'
      }`}
      title={!cuota.cliente?.phone ? 'Cliente sin teléfono registrado' : 'Enviar por WhatsApp'}
    >
      <IoLogoWhatsapp className="w-5 h-5" />
      <span className="hidden sm:inline">Enviar WhatsApp</span>
    </button>
  </div>
)}
```

Agregar modal de confirmación antes del cierre del componente (antes del último `</div>`):

```javascript
{/* Modal de Confirmación */}
{showConfirmModal && cuotaSeleccionada && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800 rounded-2xl border border-white/10 p-6 max-w-md w-full">
      <h3 className="text-xl font-bold text-white mb-4">
        Confirmar Envío de Recordatorio
      </h3>
      
      <div className="space-y-3 mb-6">
        <p className="text-slate-300">
          <span className="font-semibold">Cliente:</span> {cuotaSeleccionada.nombreCliente}
        </p>
        <p className="text-slate-300">
          <span className="font-semibold">Propiedad:</span> {cuotaSeleccionada.direccionPropiedad}
        </p>
        <p className="text-slate-300">
          <span className="font-semibold">Monto:</span>{' '}
          {Number(cuotaSeleccionada.monto).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS'
          })}
        </p>
        <p className="text-slate-300">
          <span className="font-semibold">Período:</span> {cuotaSeleccionada.periodo}
        </p>
        {cuotaSeleccionada.cliente?.phone && (
          <p className="text-slate-300">
            <span className="font-semibold">Teléfono:</span> {cuotaSeleccionada.cliente.phone}
          </p>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 mb-6">
        <p className="text-blue-300 text-sm">
          <IoLogoWhatsapp className="inline w-4 h-4 mr-1" />
          Se enviará un recordatorio de pago por WhatsApp al cliente.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowConfirmModal(false);
            setCuotaSeleccionada(null);
          }}
          disabled={enviandoWhatsApp}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={enviarRecordatorio}
          disabled={enviandoWhatsApp}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {enviandoWhatsApp ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <IoLogoWhatsapp className="w-5 h-5" />
              <span>Enviar</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}
```

**⏱️ Tiempo estimado:** 1-2 horas

---

## 🚀 PASO 8: Testing y Validación

### 8.1. Probar con Número de Prueba (Desarrollo)

1. En el panel de WhatsApp Business API, agregar tu número personal a la lista de números de prueba
2. Probar el envío desde el componente
3. Verificar que el mensaje llegue correctamente

### 8.2. Probar con Número Real (Producción)

1. Asegurarse de que las plantillas estén aprobadas
2. Verificar que el número esté activo
3. Probar con un cliente real (con permiso)
4. Confirmar recepción del mensaje

### 8.3. Checklist de Validación

- [ ] Las variables de entorno están configuradas
- [ ] El token de acceso es permanente
- [ ] Las plantillas están aprobadas por Meta
- [ ] El servicio responde correctamente
- [ ] Los mensajes llegan al destinatario
- [ ] El formato del teléfono es correcto (+54...)
- [ ] El modal de confirmación funciona
- [ ] El botón muestra "Enviando..." durante el proceso
- [ ] Los errores se manejan correctamente
- [ ] Solo usuarios admin pueden enviar mensajes

**⏱️ Tiempo estimado:** 2-3 horas

---

## 📊 Monitoreo y Logs

### 9.1. Crear Tabla de Historial (Opcional)

Para mantener un registro de todos los mensajes enviados:

```sql
-- Migración: create-whatsapp-messages-table.sql
CREATE TABLE whatsapp_messages (
  id SERIAL PRIMARY KEY,
  lease_id INTEGER REFERENCES leases(id),
  tenant_id INTEGER REFERENCES tenants(id),
  message_id VARCHAR(255),
  tipo VARCHAR(50),
  status VARCHAR(50),
  telefono VARCHAR(50),
  contenido TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 9.2. Implementar Modelo

```javascript
// back/src/models/WhatsAppMessage.js
module.exports = (sequelize, DataTypes) => {
  const WhatsAppMessage = sequelize.define('WhatsAppMessage', {
    leaseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    messageId: {
      type: DataTypes.STRING,
      comment: 'ID del mensaje de WhatsApp'
    },
    tipo: {
      type: DataTypes.STRING,
      defaultValue: 'recordatorio_cuota'
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read', 'failed'),
      defaultValue: 'sent'
    },
    telefono: DataTypes.STRING,
    contenido: DataTypes.TEXT,
    errorMessage: DataTypes.TEXT
  }, {
    tableName: 'whatsapp_messages',
    timestamps: true,
    underscored: true
  });

  return WhatsAppMessage;
};
```

---

## 🛡️ Seguridad y Buenas Prácticas

### Protección del Token
```javascript
// NUNCA hacer esto:
const token = "EAAxxxxxxx"; // ❌

// SIEMPRE usar variables de entorno:
const token = process.env.WHATSAPP_TOKEN; // ✅
```

### Validación de Teléfonos
- Validar formato antes de enviar
- Manejar números con y sin código de país
- Registrar errores de formato

### Rate Limiting
- WhatsApp permite ~80 mensajes por segundo
- Para inmobiliaria pequeña, no es problema
- Implementar retry logic si falla

### Manejo de Errores
```javascript
// Errores comunes y soluciones:
// - 131031: Número no está en WhatsApp → Verificar número
// - 130429: Rate limit excedido → Esperar y reintentar
// - 131009: Parámetros inválidos → Revisar plantilla
```

---

## 📝 Resumen de Credenciales Necesarias

Al finalizar, deberás tener:

```env
# .env del backend
WHATSAPP_PHONE_NUMBER_ID=102458629123456
WHATSAPP_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789012345
WHATSAPP_API_VERSION=v18.0
```

---

## 🎯 Resultado Final

Una vez implementado, los administradores podrán:

1. ✅ Ver todas las cuotas pendientes del mes
2. ✅ Hacer clic en "Enviar WhatsApp" 
3. ✅ Confirmar el envío en un modal
4. ✅ El mensaje se envía automáticamente desde el sistema
5. ✅ El cliente recibe un mensaje profesional en WhatsApp
6. ✅ Se registra el envío para trazabilidad

**Sin necesidad de:**
- ❌ Copiar y pegar mensajes
- ❌ Abrir WhatsApp Web manualmente
- ❌ Buscar el contacto del cliente
- ❌ Formatear el mensaje cada vez

---

## 📞 Soporte y Recursos

- **Documentación oficial**: [developers.facebook.com/docs/whatsapp](https://developers.facebook.com/docs/whatsapp)
- **Foro de desarrolladores**: [Facebook Developer Community](https://developers.facebook.com/community/)
- **Status API**: [status.fb.com](https://status.fb.com/)

---

## ⏱️ Tiempo Total Estimado

| Fase | Tiempo | Espera |
|------|--------|--------|
| **1. Crear cuenta Meta Business** | 20 min | - |
| **2. Crear aplicación** | 10 min | - |
| **3. Configurar número** | 30 min | - |
| **4. Token permanente** | 10 min | - |
| **5. Crear plantillas** | 15 min | 1-24 horas |
| **6. Implementar backend** | 2 horas | - |
| **7. Implementar frontend** | 2 horas | - |
| **8. Testing** | 3 horas | - |
| **TOTAL** | **~8 horas** | **+1-24 horas aprobación** |

---

## ✅ Checklist Final

- [ ] Cuenta de Meta Business creada
- [ ] Aplicación creada en Meta for Developers
- [ ] Número de teléfono verificado
- [ ] Token permanente generado y guardado
- [ ] Plantillas creadas y aprobadas
- [ ] Variables de entorno configuradas
- [ ] Servicio de WhatsApp implementado
- [ ] Controlador y rutas creados
- [ ] Acción de Redux implementada
- [ ] Frontend actualizado con botón de envío
- [ ] Testing completado exitosamente
- [ ] Mensajes llegando correctamente

---

**¡Listo!** Con esta guía podrás integrar WhatsApp Business API de forma oficial y profesional en la aplicación QL Inmobiliaria. 🚀📱
