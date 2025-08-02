/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // 🆕 Agregar navegación
import {
  createLease,
  getPropertiesById,
  addPropertyToClientWithRole,
  getAllClients,
  createClient,
 
  getLeasesPendingUpdate,
  getUpdateStatistics
} from "../../redux/Actions/actions";
import Listado from "../Propiedades/Listado";
import Swal from "sweetalert2";
// 🔧 Remover la importación directa de ContratoAlquiler ya que usaremos navegación
// import ContratoAlquiler from "../PdfTemplates/ContratoAlquiler";

// 🆕 Componente de validación visual
// eslint-disable-next-line react/prop-types
const ValidationStatus = ({ isValid, message }) => (
  <div className={`text-xs mt-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
    {isValid ? '✅' : '❌'} {message}
  </div>
);

// 🆕 Componente de estadísticas rápidas
const QuickStats = ({ stats, pendingLeases }) => {
  if (!stats && (!pendingLeases || !Array.isArray(pendingLeases))) return null;
  
  // 🔧 Asegurar que pendingLeases sea un array
  const validPendingLeases = Array.isArray(pendingLeases) ? pendingLeases : [];
  
  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
      <h3 className="text-sm font-semibold text-blue-800 mb-2">📊 Estado del Sistema</h3>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-blue-600">Contratos Activos:</span>
          <span className="ml-2 font-semibold">{stats?.general?.totalActiveLeases || 0}</span>
        </div>
        <div>
          <span className="text-orange-600">Pendientes Actualización:</span>
          <span className="ml-2 font-semibold text-orange-600">{stats?.general?.pendingUpdates || 0}</span>
        </div>
        <div>
          <span className="text-red-600">Requieren Atención:</span>
          <span className="ml-2 font-semibold text-red-600">{validPendingLeases.length || 0}</span>
        </div>
      </div>
      
      {/* 🔧 Mostrar alertas solo si hay contratos pendientes válidos */}
      {validPendingLeases.length > 0 && (
        <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="text-yellow-800">
              Hay {validPendingLeases.length} contrato(s) que requieren actualización de alquiler.
            </span>
            <button
              onClick={() => window.location.href = '/updateAlquiler'}
              className="ml-auto text-yellow-700 underline hover:text-yellow-900 transition-colors"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PendingUpdatesAlert = ({ pendingLeases, onNavigateToUpdates, onNavigateToAlerts }) => {
  // 🔧 Validar que pendingLeases sea un array válido
  if (!pendingLeases || !Array.isArray(pendingLeases) || pendingLeases.length === 0) {
    return null;
  }

  // Categorizar por urgencia con validación adicional
  const urgentLeases = pendingLeases.filter(lease => {
    if (!lease || !lease.nextUpdateDate) return false;
    try {
      const daysOverdue = Math.floor((new Date() - new Date(lease.nextUpdateDate)) / (1000 * 60 * 60 * 24));
      return daysOverdue > 0;
    } catch (error) {
      console.warn('Error calculando días vencidos:', error);
      return false;
    }
  });

  const soonLeases = pendingLeases.filter(lease => {
    if (!lease || !lease.nextUpdateDate) return false;
    try {
      const daysUntilUpdate = Math.floor((new Date(lease.nextUpdateDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilUpdate <= 7 && daysUntilUpdate >= 0;
    } catch (error) {
      console.warn('Error calculando días restantes:', error);
      return false;
    }
  });

  return (
    <div className="mb-6 max-w-4xl mx-auto px-4">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 p-4 rounded-lg shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Contratos Requieren Atención
            </h3>
            
            <div className="space-y-2 text-sm">
              {urgentLeases.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                    URGENTE
                  </span>
                  <span className="text-red-700">
                    {urgentLeases.length} contrato(s) con actualizaciones vencidas
                  </span>
                </div>
              )}
              
              {soonLeases.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                    PRÓXIMO
                  </span>
                  <span className="text-yellow-700">
                    {soonLeases.length} contrato(s) vencen en los próximos 7 días
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-3 flex space-x-3">
              <button
                onClick={onNavigateToUpdates}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                🔄 Actualizar Alquileres
              </button>
              
              <button
                onClick={onNavigateToAlerts}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                📋 Ver Todas las Alertas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateLeaseForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 🆕 Hook de navegación
  
  // 🔧 Uso mejorado del state con selectores específicos
  const {
  property,
  clients,
  leaseCreate,
  updateStatistics,
  pendingLeases
} = useSelector((state) => ({
  property: state.property,
  clients: state.clients || [],
  leaseCreate: state.leaseCreate || { loading: false },
  updateStatistics: state.updateStatistics?.data || null,
  pendingLeases: Array.isArray(state.pendingUpdates?.data) ? state.pendingUpdates.data : [] // 🔧 Asegurar array
}));

  const [isLoading, setIsLoading] = useState(false);
  const [leaseCreated, setLeaseCreated] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showClientList, setShowClientList] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // 🆕 Estados de validación en tiempo real
  const [validationState, setValidationState] = useState({
    propertyId: { isValid: false, message: '' },
    tenant: { isValid: false, message: '' },
    guarantor1: { isValid: false, message: '' },
    dates: { isValid: false, message: '' }
  });

  const [formData, setFormData] = useState({
    propertyId: "",
    locador: "",
    locatario: "",
    locatarioId: "",
    startDate: "",
    rentAmount: "",
    updateFrequency: "",
    commission: "",
    totalMonths: "",
    inventory: "",
    guarantor1Name: "",
    guarantor1Cuil: "",
    guarantor1Direccion: "",
    guarantor1Description: "",
    guarantor1CertificationEntity: "",
    guarantor2Name: "",
    guarantor2Cuil: "",
    guarantor2Direccion: "",
    guarantor2Description: "",
    guarantor2CertificationEntity: "",
  });

  // 🆕 Cargar estadísticas al montar el componente
 useEffect(() => {
  const loadInitialData = async () => {
    try {
      // 🔧 Cargar uno por uno para evitar que un error cancele todo
      const promises = [
        dispatch(getAllClients()).catch(err => {
          console.warn('Error cargando clientes:', err);
          return [];
        }),
        dispatch(getUpdateStatistics()).catch(err => {
          console.warn('Error cargando estadísticas:', err);
          return null;
        }),
        dispatch(getLeasesPendingUpdate()).catch(err => {
          console.warn('Error cargando contratos pendientes:', err);
          return [];
        })
      ];

      await Promise.allSettled(promises);
      
    } catch (error) {
      console.error('Error general cargando datos iniciales:', error);
    }
  };

  loadInitialData();
}, [dispatch]);

  // 🆕 Validación en tiempo real de la propiedad
  useEffect(() => {
    if (property) {
      const hasActiveContract = property.Leases?.some((lease) => {
        const endDate = new Date(lease.startDate);
        endDate.setMonth(endDate.getMonth() + lease.totalMonths);
        return endDate > new Date();
      });

      if (hasActiveContract) {
        setValidationState(prev => ({
          ...prev,
          propertyId: { 
            isValid: false, 
            message: 'Propiedad con contrato activo' 
          }
        }));
        
        Swal.fire({
          title: "Propiedad No Disponible",
          text: "Esta propiedad ya tiene un contrato activo",
          icon: "warning",
        });
        
        resetPropertyFields();
        return;
      }

      // Propiedad válida
      setValidationState(prev => ({
        ...prev,
        propertyId: { 
          isValid: true, 
          message: 'Propiedad disponible' 
        }
      }));

      const owner = property.Clients?.find(
        (client) => client.ClientProperty.role === "propietario"
      );
      
      setFormData((prevData) => ({
        ...prevData,
        locador: owner?.name || "",
        rentAmount: property.price || "",
        commission: property.comision || "",
        inventory: property.inventory || "",
      }));
    }
  }, [property]);

  // 🆕 Función helper para resetear campos de propiedad
  const resetPropertyFields = () => {
    setFormData((prevData) => ({
      ...prevData,
      propertyId: "",
      locador: "",
      rentAmount: "",
      commission: "",
      inventory: "",
    }));
  };


  // 🆕 Validación mejorada en tiempo real
   const validateField = (name, value) => {
    switch (name) {
      case 'locatario': {
        const isValidTenant = value.length >= 3;
        setValidationState(prev => ({
          ...prev,
          tenant: {
            isValid: isValidTenant,
            message: isValidTenant ? 'Inquilino válido' : 'Mínimo 3 caracteres'
          }
        }));
        break;
      }
        
      case 'guarantor1Name':
      case 'guarantor1Cuil': {
        const isValidGuarantor = formData.guarantor1Name && formData.guarantor1Cuil && value;
        setValidationState(prev => ({
          ...prev,
          guarantor1: {
            isValid: isValidGuarantor,
            message: isValidGuarantor ? 'Garante 1 completo' : 'Faltan datos del garante'
          }
        }));
        break;
      }
        
      case 'startDate':
      case 'totalMonths': {
        const startDate = name === 'startDate' ? value : formData.startDate;
        const totalMonths = name === 'totalMonths' ? value : formData.totalMonths;
        
        if (startDate && totalMonths) {
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + parseInt(totalMonths));
          const isValidDates = endDate > new Date();
          
          setValidationState(prev => ({
            ...prev,
            dates: {
              isValid: isValidDates,
              message: isValidDates 
                ? `Vence: ${endDate.toLocaleDateString()}` 
                : 'Fecha de finalización inválida'
            }
          }));
        }
        break;
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // 🆕 Validación en tiempo real
    validateField(name, value);

    // Filtrar clientes por nombre (mejorado)
    if (name === "locatario") {
      if (value.length > 2) {
        const filtered = clients.filter((client) =>
          client.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredClients(filtered);
        setShowClientList(true);
      } else {
        setFilteredClients([]);
        setShowClientList(false);
      }
    }
  };

  const handlePropertyIdBlur = async (e) => {
    const value = e.target.value;
    if (value) {
      setIsLoading(true);
      try {
        const propertyResponse = await dispatch(getPropertiesById(value));
        if (propertyResponse && !propertyResponse.isAvailable) {
          setValidationState(prev => ({
            ...prev,
            propertyId: { 
              isValid: false, 
              message: 'Propiedad no disponible' 
            }
          }));
          
          await Swal.fire({
            title: "Propiedad No Disponible",
            text: "Esta propiedad no está disponible para alquilar",
            icon: "warning",
          });
          resetPropertyFields();
        }
      } catch (error) {
        console.error("Error al verificar la propiedad:", error);
        setValidationState(prev => ({
          ...prev,
          propertyId: { 
            isValid: false, 
            message: 'Error al verificar propiedad' 
          }
        }));
        
        await Swal.fire({
          title: "Error",
          text: "Error al verificar la disponibilidad de la propiedad",
          icon: "error",
        });
        resetPropertyFields();
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 🆕 Función mejorada de selección de cliente
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setFormData((prevData) => ({
      ...prevData,
      locatario: client.name,
      locatarioId: client.idClient,
    }));
    setShowClientList(false);
    
    // Validar inmediatamente
    setValidationState(prev => ({
      ...prev,
      tenant: { 
        isValid: true, 
        message: 'Cliente existente seleccionado' 
      }
    }));
  };

  const handlePropertySelect = (property) => {
    if (!property.isAvailable) {
      Swal.fire({
        title: "Propiedad No Disponible",
        text: "Esta propiedad no está disponible para alquilar",
        icon: "warning",
      });
      return;
    }
    
    setFormData((prevData) => ({
      ...prevData,
      propertyId: property.propertyId,
      locador:
        property.Clients?.find(
          (client) => client.ClientProperty.role === "propietario"
        )?.name || "",
      rentAmount: property.price,
      commission: property.comision,
      inventory: property.inventory,
    }));
  };

  // 🆕 Función mejorada para crear cliente
 const ensureTenantExists = async () => {
    let tenantId = formData.locatarioId;
    let tenantName = formData.locatario;

    if (!tenantId && tenantName) {
      const existingClient = clients.find(
        (client) => client.name.toLowerCase() === tenantName.toLowerCase()
      );
      
      if (existingClient) {
        tenantId = existingClient.idClient;
        setSelectedClient(existingClient);
      } else {
        // Modal mejorado para crear cliente
        const { value: clientData } = await Swal.fire({
          title: "Registrar Nuevo Cliente",
          html: `
            <div style="text-align: left;">
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Nombre completo *</label>
                <input id="swal-input-name" class="swal2-input" placeholder="Nombre completo" required>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">CUIL/CUIT *</label>
                <input id="swal-input-cuil" class="swal2-input" placeholder="XX-XXXXXXXX-X" required>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Email</label>
                <input id="swal-input-email" class="swal2-input" type="email" placeholder="email@ejemplo.com">
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Dirección *</label>
                <input id="swal-input-direccion" class="swal2-input" placeholder="Dirección completa" required>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Ciudad *</label>
                <input id="swal-input-ciudad" class="swal2-input" placeholder="Ciudad" required>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Provincia *</label>
                <input id="swal-input-provincia" class="swal2-input" placeholder="Provincia" required>
              </div>
              <div class="mb-3">
                <label class="block text-sm font-medium mb-1">Teléfono *</label>
                <input id="swal-input-mobile" class="swal2-input" placeholder="Número de teléfono" required>
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">
                Los campos marcados con * son obligatorios
              </p>
            </div>
          `,
          width: 500,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: 'Crear Cliente',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const name = document.getElementById("swal-input-name").value;
            const cuil = document.getElementById("swal-input-cuil").value;
            const email = document.getElementById("swal-input-email").value;
            const direccion = document.getElementById("swal-input-direccion").value;
            const ciudad = document.getElementById("swal-input-ciudad").value;
            const provincia = document.getElementById("swal-input-provincia").value;
            const mobilePhone = document.getElementById("swal-input-mobile").value;

            if (!name || !cuil || !direccion || !ciudad || !provincia || !mobilePhone) {
              Swal.showValidationMessage('Todos los campos marcados con * son obligatorios');
              return false;
            }

            return {
              name, cuil, email, direccion, ciudad, provincia, mobilePhone
            };
          },
        });

        if (clientData) {
          try {
            const newClient = await dispatch(createClient(clientData));
            tenantId = newClient?.idClient || null;
            
            // Crear objeto cliente completo para usar en el PDF
            const fullClient = {
              idClient: tenantId,
              name: clientData.name,
              cuil: clientData.cuil,
              email: clientData.email,
              direccion: clientData.direccion,
              ciudad: clientData.ciudad,
              provincia: clientData.provincia,
              mobilePhone: clientData.mobilePhone
            };
            
            setSelectedClient(fullClient);
            
            setFormData((prevData) => ({
              ...prevData,
              locatario: clientData.name,
              locatarioId: tenantId,
            }));

            // Recargar lista de clientes
            dispatch(getAllClients());
            
            await Swal.fire({
              title: "Cliente Creado",
              text: `${clientData.name} ha sido registrado exitosamente.`,
              icon: "success",
              timer: 2000
            });
          } catch (error) {
            await Swal.fire({
              title: "Error",
              text: "No se pudo crear el cliente. Intenta nuevamente.",
              icon: "error",
            });
            return null;
          }
        } else {
          return null;
        }
      }
    }
    return tenantId;
  };

  // 🆕 Validación completa del formulario
 const validateForm = () => {
    const errors = [];
    
    if (!formData.propertyId) errors.push("Debe seleccionar una propiedad");
    if (!formData.locatario) errors.push("Debe especificar un inquilino");
    if (!formData.startDate) errors.push("Debe especificar fecha de inicio");
    if (!formData.rentAmount) errors.push("Debe especificar el monto del alquiler");
    if (!formData.updateFrequency) errors.push("Debe seleccionar frecuencia de actualización");
    if (!formData.totalMonths) errors.push("Debe especificar duración del contrato");
    if (!formData.guarantor1Name || !formData.guarantor1Cuil) {
      errors.push("El primer garante es obligatorio (nombre y CUIL)");
    }
    
    return errors;
  };

  // 🆕 Función para navegar al PDF con datos completos
  const navigateToPDF = () => {
    const owner = property?.Clients?.find(
      (client) => client.ClientProperty.role === "propietario"
    );

    navigate('/pdf', {
      state: {
        lease: leaseCreated,
        property: property,
        tenant: selectedClient,
        owner: owner,
        guarantors: leaseCreated.Garantors || []
      }
    });
  };

  // 🆕 Función de envío mejorada con mejor manejo de errores
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación previa
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      await Swal.fire({
        title: "Formulario Incompleto",
        html: `
          <div style="text-align: left;">
            <p style="margin-bottom: 10px;">Corrige los siguientes errores:</p>
            <ul style="padding-left: 20px;">
              ${validationErrors.map(error => `<li style="margin-bottom: 5px;">${error}</li>`).join('')}
            </ul>
          </div>
        `,
        icon: "warning",
        confirmButtonText: "Entendido"
      });
      return;
    }

    try {
      // Mostrar loading
      Swal.fire({
        title: 'Creando Contrato...',
        text: 'Por favor espera mientras procesamos la información',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Validar y obtener tenantId
      const tenantId = await ensureTenantExists();
      if (!tenantId) {
        Swal.close();
        return;
      }

      // Verificar disponibilidad final de la propiedad
      const propertyResponse = await dispatch(getPropertiesById(formData.propertyId));
      if (!propertyResponse || !propertyResponse.isAvailable) {
        await Swal.fire({
          title: "Propiedad No Disponible",
          text: "Esta propiedad ya no está disponible para alquilar",
          icon: "warning",
        });
        return;
      }

      // Obtener landlordId
      const landlordId = property.Clients?.find(
        (client) => client.ClientProperty.role === "propietario"
      )?.idClient;

      if (!landlordId) {
        await Swal.fire({
          title: "Error",
          text: "No se encontró el propietario de la propiedad",
          icon: "error",
        });
        return;
      }

      // Crear contrato
      const leaseResult = await dispatch(
        createLease({
          propertyId: parseInt(formData.propertyId),
          landlordId: parseInt(landlordId),
          tenantId: parseInt(tenantId),
          startDate: formData.startDate,
          rentAmount: parseFloat(formData.rentAmount),
          updateFrequency: formData.updateFrequency,
          commission: parseFloat(formData.commission) || 0,
          totalMonths: parseInt(formData.totalMonths),
          inventory: formData.inventory,
        })
      );

      if (leaseResult.success) {
        // Asignar rol de inquilino
        try {
          await dispatch(
            addPropertyToClientWithRole({
              idClient: tenantId,
              propertyId: formData.propertyId,
              role: "inquilino",
            })
          );
        } catch (roleError) {
          console.warn("Error al asignar rol:", roleError);
        }

        setLeaseCreated(leaseResult.data);

        // 🆕 Actualizar estadísticas Y contratos pendientes después de crear el contrato
        await Promise.all([
          dispatch(getUpdateStatistics()),
          dispatch(getLeasesPendingUpdate()) // 🆕 Recargar contratos pendientes
        ]);

        await Swal.fire({
          title: "¡Contrato Creado!",
          html: `
            <div style="text-align: left;">
              <p>✅ <strong>Contrato creado exitosamente</strong></p>
              <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <p style="margin: 0; font-size: 14px;"><strong>Propiedad:</strong> ${property.address}</p>
                <p style="margin: 0; font-size: 14px;"><strong>Inquilino:</strong> ${formData.locatario}</p>
                <p style="margin: 0; font-size: 14px;"><strong>Monto:</strong> $${parseInt(formData.rentAmount).toLocaleString()}</p>
                <p style="margin: 0; font-size: 14px;"><strong>Duración:</strong> ${formData.totalMonths} meses</p>
              </div>
            </div>
          `,
          icon: "success",
          timer: 4000,
          showConfirmButton: true,
          confirmButtonText: "Continuar"
        });
      } else {
        // Manejo de errores mejorado
        const errorMessage = leaseResult.serverError || leaseResult.error || "Error desconocido";
        await Swal.fire({
          title: "Error al Crear Contrato",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Intentar Nuevamente"
        });
      }

    } catch (error) {
      console.error("Error en handleSubmit:", error);
      await Swal.fire({
        title: "Error Inesperado",
        text: "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido"
      });
    }
  };

  // 🆕 Función para resetear formulario
  const resetForm = () => {
    setFormData({
      propertyId: "",
      locador: "",
      locatario: "",
      locatarioId: "",
      startDate: "",
      rentAmount: "",
      updateFrequency: "",
      commission: "",
      totalMonths: "",
      inventory: "",
      guarantor1Name: "",
      guarantor1Cuil: "",
      guarantor1Direccion: "",
      guarantor1Description: "",
      guarantor1CertificationEntity: "",
      guarantor2Name: "",
      guarantor2Cuil: "",
      guarantor2Direccion: "",
      guarantor2Description: "",
      guarantor2CertificationEntity: "",
    });
    setLeaseCreated(null);
    setSelectedClient(null);
    setFilteredClients([]);
    setShowClientList(false);
    setValidationState({
      propertyId: { isValid: false, message: '' },
      tenant: { isValid: false, message: '' },
      guarantor1: { isValid: false, message: '' },
      dates: { isValid: false, message: '' }
    });
  };

 return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      {/* 🆕 Alerta inteligente para contratos pendientes */}
      <PendingUpdatesAlert 
        pendingLeases={pendingLeases} 
        onNavigateToUpdates={() => navigate('/updateAlquiler')}
        onNavigateToAlerts={() => navigate('/alertas')}
      />

      {/* 🆕 Estadísticas mejoradas del sistema */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <QuickStats stats={updateStatistics} pendingLeases={pendingLeases} />
      </div>

      <div className="mb-8">
        <Listado onSelectProperty={handlePropertySelect} />
      </div>
      
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  Crear Contrato de Alquiler
                </h2>
                
                {/* Indicador de estado del formulario */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-2">Estado del formulario:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <ValidationStatus 
                      isValid={validationState.propertyId.isValid} 
                      message={validationState.propertyId.message || 'Propiedad'} 
                    />
                    <ValidationStatus 
                      isValid={validationState.tenant.isValid} 
                      message={validationState.tenant.message || 'Inquilino'} 
                    />
                    <ValidationStatus 
                      isValid={validationState.guarantor1.isValid} 
                      message={validationState.guarantor1.message || 'Garante 1'} 
                    />
                    <ValidationStatus 
                      isValid={validationState.dates.isValid} 
                      message={validationState.dates.message || 'Fechas'} 
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Property ID */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        ID Propiedad: *
                      </label>
                      <input
                        type="text"
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleInputChange}
                        onBlur={handlePropertyIdBlur}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        required
                      />
                      {isLoading && (
                        <span className="text-xs text-blue-600 mt-1">🔍 Verificando...</span>
                      )}
                      <ValidationStatus 
                        isValid={validationState.propertyId.isValid} 
                        message={validationState.propertyId.message} 
                      />
                    </div>

                    {/* Dueño */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Propietario:
                      </label>
                      <input
                        type="text"
                        name="locador"
                        value={formData.locador}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 bg-gray-50"
                        readOnly
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Se completa automáticamente al seleccionar la propiedad
                      </div>
                    </div>

                    {/* Inquilino */}
                    <div className="flex flex-col relative">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Inquilino: *
                      </label>
                      <input
                        type="text"
                        name="locatario"
                        value={formData.locatario}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        placeholder="Escriba para buscar o crear nuevo..."
                        required
                      />
                      <ValidationStatus 
                        isValid={validationState.tenant.isValid} 
                        message={validationState.tenant.message} 
                      />
                      
                      {showClientList && filteredClients.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {filteredClients.map((client) => (
                            <div
                              key={client.idClient}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleClientSelect(client)}
                            >
                              <div className="font-medium">{client.name}</div>
                              <div className="text-xs text-gray-500">{client.cuil}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Fecha de Inicio */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Inicio Contrato: *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        required
                      />
                    </div>

                    {/* Precio */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Monto Mensual: *
                      </label>
                      <input
                        type="number"
                        name="rentAmount"
                        value={formData.rentAmount}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        required
                      />
                      {formData.rentAmount && (
                        <div className="text-xs text-green-600 mt-1">
                          ${parseInt(formData.rentAmount).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Plazo de Actualización */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Frecuencia de Actualización: *
                      </label>
                      <select
                        name="updateFrequency"
                        value={formData.updateFrequency}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        required
                      >
                        <option value="">Seleccionar frecuencia</option>
                        <option value="cuatrimestral">Cuatrimestral (4 meses)</option>
                        <option value="semestral">Semestral (6 meses)</option>
                        <option value="anual">Anual (12 meses)</option>
                      </select>
                    </div>

                    {/* Duración del contrato */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Duración Total (meses): *
                      </label>
                      <input
                        type="number"
                        name="totalMonths"
                        value={formData.totalMonths}
                        onChange={handleInputChange}
                        min="1"
                        max="120"
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        required
                      />
                      <ValidationStatus 
                        isValid={validationState.dates.isValid} 
                        message={validationState.dates.message} 
                      />
                    </div>

                    {/* Comisión */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Comisión:
                      </label>
                      <input
                        type="number"
                        name="commission"
                        value={formData.commission}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      />
                    </div>

                    {/* Inventario */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-1">
                        Inventario: *
                      </label>
                      <textarea
                        name="inventory"
                        value={formData.inventory}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 h-32"
                        placeholder="Detalle del inventario de la propiedad..."
                        required
                      />
                    </div>

                    {/* Garante 1 - Simplificado y mejorado */}
                    <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                      <label className="text-sm font-medium text-blue-800 mb-3">
                        🛡️ Garante 1 (Obligatorio):
                      </label>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <input
                          type="text"
                          name="guarantor1Name"
                          value={formData.guarantor1Name}
                          onChange={handleInputChange}
                          placeholder="Nombre completo del garante"
                          className="px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        
                        <input
                          type="text"
                          name="guarantor1Cuil"
                          value={formData.guarantor1Cuil}
                          onChange={handleInputChange}
                          placeholder="CUIL (XX-XXXXXXXX-X)"
                          className="px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        
                        <input
                          type="text"
                          name="guarantor1Direccion"
                          value={formData.guarantor1Direccion}
                          onChange={handleInputChange}
                          placeholder="Domicilio completo"
                          className="px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        
                        <select
                          name="guarantor1Description"
                          value={formData.guarantor1Description}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Tipo de respaldo económico</option>
                          <option value="recibos">Recibos de sueldo</option>
                          <option value="certificacion">Certificación de ingresos</option>
                          <option value="escritura">Escritura de propiedad</option>
                        </select>
                        
                        {formData.guarantor1Description === "certificacion" && (
                          <input
                            type="text"
                            name="guarantor1CertificationEntity"
                            value={formData.guarantor1CertificationEntity}
                            onChange={handleInputChange}
                            placeholder="Ente certificador (ej: Consejo Prof. de Ciencias Económicas)"
                            className="px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        )}
                      </div>
                      
                      <ValidationStatus 
                        isValid={validationState.guarantor1.isValid} 
                        message={validationState.guarantor1.message} 
                      />
                    </div>

                    {/* Garante 2 - Opcional pero mejorado */}
                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                      <label className="text-sm font-medium text-gray-700 mb-3">
                        🛡️ Garante 2 (Opcional):
                      </label>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <input
                          type="text"
                          name="guarantor2Name"
                          value={formData.guarantor2Name}
                          onChange={handleInputChange}
                          placeholder="Nombre completo del segundo garante"
                          className="px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                        
                        <input
                          type="text"
                          name="guarantor2Cuil"
                          value={formData.guarantor2Cuil}
                          onChange={handleInputChange}
                          placeholder="CUIL (XX-XXXXXXXX-X)"
                          className="px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                        
                        <input
                          type="text"
                          name="guarantor2Direccion"
                          value={formData.guarantor2Direccion}
                          onChange={handleInputChange}
                          placeholder="Domicilio completo"
                          className="px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                        
                        <select
                          name="guarantor2Description"
                          value={formData.guarantor2Description}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        >
                          <option value="">Tipo de respaldo económico</option>
                          <option value="recibos">Recibos de sueldo</option>
                          <option value="certificacion">Certificación de ingresos</option>
                          <option value="escritura">Escritura de propiedad</option>
                        </select>
                        
                        {formData.guarantor2Description === "certificacion" && (
                          <input
                            type="text"
                            name="guarantor2CertificationEntity"
                            value={formData.guarantor2CertificationEntity}
                            onChange={handleInputChange}
                            placeholder="Ente certificador"
                            className="px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                   {/* Botones de acción */}
                  <div className="pt-6 space-y-3">
                    <button
                      type="submit"
                      disabled={leaseCreate.loading}
                      className="w-full px-4 py-3 bg-lime-500 text-white rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {leaseCreate.loading ? "Creando Contrato..." : "🏠 Crear Contrato"}
                    </button>
                    
                    {formData.propertyId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
                      >
                        🔄 Limpiar Formulario
                      </button>
                    )}
                  </div>

                  {/* Resultado exitoso */}
                  {leaseCreated && (
                    <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          ✅ ¡Contrato Creado Exitosamente!
                        </h3>
                        <div className="text-sm text-green-700 space-y-1">
                          <p><strong>ID:</strong> {leaseCreated.id}</p>
                          <p><strong>Propiedad:</strong> {property?.address}</p>
                          <p><strong>Inquilino:</strong> {formData.locatario}</p>
                          <p><strong>Monto:</strong> ${parseInt(formData.rentAmount).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Botones actualizados */}
                      <div className="mt-4 flex space-x-3">
                        <button
                          type="button"
                          onClick={navigateToPDF}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          📄 Generar PDF
                        </button>
                        
                        <button
                          type="button"
                          onClick={resetForm}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                          🆕 Crear Nuevo Contrato
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => navigate('/leaseList')}
                          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          📋 Ver Contratos
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaseForm;