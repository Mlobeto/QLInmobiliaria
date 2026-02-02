# Sistema de Control de Roles

## Resumen
Se implementó un sistema de control de acceso basado en roles para restringir el acceso a ciertas rutas según el rol del usuario (admin vs. usuario regular).

## Cambios Realizados

### 1. Backend

#### Middleware de Roles
**Archivo creado:** `back/src/middlewares/roleMiddleware.js`

Middleware que verifica si el usuario tiene el rol requerido para acceder a un endpoint:

```javascript
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.role; // Viene del authMiddleware
    
    if (!userRole) {
      return res.status(401).json({ 
        message: 'No se pudo verificar el rol del usuario' 
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  };
};
```

#### Rutas Protegidas
**Archivo modificado:** `back/src/routes/payment.js`

Se protegió la ruta `GET /payment/` para que solo usuarios con rol `admin` puedan obtener todos los pagos:

```javascript
const authMiddleware = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/roleMiddleware');

// Solo admins pueden ver todos los pagos
router.get('/', authMiddleware, checkRole('admin'), getAllPayments);
```

### 2. Frontend

#### Componente de Ruta Basada en Roles
**Archivo creado:** `QL Front/src/utils/RoleBasedRoute.jsx`

Componente wrapper que verifica el rol del usuario antes de renderizar una ruta:

```javascript
const RoleBasedRoute = ({ children, allowedRoles = ['admin'] }) => {
  const adminInfo = useSelector((state) => state.adminInfo);

  // Si no hay información del admin, redirigir al login
  if (!adminInfo || !adminInfo.token) {
    return <Navigate to="/" />;
  }

  // Si el rol no está permitido, redirigir al panel
  if (!adminInfo.role || !allowedRoles.includes(adminInfo.role)) {
    return <Navigate to="/panel" />;
  }

  return children;
};
```

#### Rutas Protegidas en App
**Archivo modificado:** `QL Front/src/App.jsx`

Se protegieron las rutas `/paymentList` y `/reportes` usando el componente `RoleBasedRoute`:

```javascript
import RoleBasedRoute from "./utils/RoleBasedRoute";

<Route
  path="/paymentList"
  element={
    <RoleBasedRoute allowedRoles={['admin']}>
      <PaymentList />
    </RoleBasedRoute>
  }
/>

<Route
  path="/reportes"
  element={
    <RoleBasedRoute allowedRoles={['admin']}>
      <PaymentReport />
    </RoleBasedRoute>
  }
/>
```

#### Panel de Informes con Filtro de Roles
**Archivo modificado:** `QL Front/src/Components/Admin/PanelInformes.jsx`

Se modificó para ocultar los enlaces a reportes restringidos según el rol:

```javascript
import { useSelector } from 'react-redux';

const PanelInformes = () => {
  const adminInfo = useSelector((state) => state.adminInfo);

  const informeActions = [
    {
      title: 'Informes',
      path: '/reportes',
      // ... otros campos
      requiredRole: 'admin'
    },
    {
      title: 'Pagos por Contrato',
      path: '/paymentList',
      // ... otros campos
      requiredRole: 'admin'
    }
  ];

  // Filtrar acciones según el rol
  const filteredActions = informeActions.filter(action => {
    if (!action.requiredRole) return true;
    return adminInfo?.role === action.requiredRole;
  });

  return (
    // Renderizar solo las acciones filtradas
    {filteredActions.map((action) => ...)}
  );
};
```

## Funcionamiento

### Flujo de Autenticación y Autorización

1. **Login:** El usuario inicia sesión y el backend devuelve:
   ```json
   {
     "token": "jwt_token",
     "admin": {
       "adminId": 1,
       "username": "usuario",
       "role": "admin"
     }
   }
   ```

2. **Redux:** La información del admin (incluyendo el rol) se guarda en el estado de Redux.

3. **Protección de Rutas Backend:**
   - El `authMiddleware` verifica el token JWT y extrae el rol: `req.role = verified.role`
   - El `roleMiddleware` verifica que el rol del usuario esté en la lista de roles permitidos
   - Si no tiene permiso, devuelve error 403

4. **Protección de Rutas Frontend:**
   - El componente `RoleBasedRoute` verifica el rol del usuario desde Redux
   - Si no tiene permiso, redirige a `/panel`
   - Si no está autenticado, redirige a `/`

5. **Ocultación de UI:**
   - Los componentes leen el rol desde Redux
   - Ocultan enlaces y botones de funcionalidades restringidas

## Rutas Restringidas

### Solo Admin
- `GET /payment/` - Ver todos los pagos (backend)
- `/paymentList` - Lista de pagos (frontend)
- `/reportes` - Informes de pagos (frontend)

## Modelo de Datos

El modelo `Admin` ya tenía el campo `role`:

```javascript
role: {
  type: DataTypes.STRING,
  defaultValue: "admin"
}
```

## Códigos de Error

- **401 Unauthorized:** No se pudo verificar el rol del usuario
- **403 Forbidden:** El usuario no tiene permisos para acceder al recurso

## Notas Importantes

1. **Token JWT:** Ya incluía el rol en el payload, no fue necesario modificar la generación del token.

2. **Compatibilidad:** El sistema es compatible con usuarios existentes que tienen `role: "admin"` por defecto.

3. **Extensibilidad:** Para agregar más roles en el futuro:
   - Agregar el nuevo rol al modelo `Admin`
   - Actualizar `allowedRoles` en `RoleBasedRoute` y `checkRole`
   - Agregar `requiredRole` en las acciones de navegación

4. **Seguridad:** La protección está implementada tanto en frontend (UX) como en backend (seguridad real).

## Pruebas Recomendadas

1. **Usuario Admin:**
   - Puede acceder a `/paymentList` ✓
   - Puede acceder a `/reportes` ✓
   - Ve los botones en `/PanelInformes` ✓

2. **Usuario No-Admin:**
   - Es redirigido al intentar acceder a `/paymentList` ✓
   - Es redirigido al intentar acceder a `/reportes` ✓
   - No ve los botones en `/PanelInformes` ✓
   - El backend devuelve 403 si intenta llamar a las APIs protegidas ✓

## Próximos Pasos (Opcional)

Si necesitas crear usuarios con diferentes roles:

1. Modificar el formulario de registro para permitir seleccionar el rol
2. Agregar validación en el backend para que solo admins puedan crear otros admins
3. Crear una interfaz de gestión de usuarios
