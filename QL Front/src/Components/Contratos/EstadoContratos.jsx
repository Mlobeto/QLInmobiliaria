import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllLeases,
  getLeaseById,
  updateLeaseRentAmount,
} from "../../redux/Actions/actions";
import ContratoAlquiler from "../PdfTemplates/ContratoAlquiler";
import ActualizarAlquileres from "./ActualizarAlquileres";

const calculateNextUpdateDate = (lease) => {
  try {
    if (!lease.startDate || !lease.updateFrequency) {
      return null;
    }

    const startDate = new Date(lease.startDate);
    if (isNaN(startDate.getTime())) {
      return null;
    }

    let nextUpdate = new Date(startDate);
    
    // Calcular la próxima actualización basada en la frecuencia
    switch (lease.updateFrequency) {
      case 'mensual':
        nextUpdate.setMonth(nextUpdate.getMonth() + 1);
        break;
      case 'trimestral':
        nextUpdate.setMonth(nextUpdate.getMonth() + 3);
        break;
      case 'semestral':
        nextUpdate.setMonth(nextUpdate.getMonth() + 6);
        break;
      case 'anual':
        nextUpdate.setFullYear(nextUpdate.getFullYear() + 1);
        break;
      case 'bimestral':
        nextUpdate.setMonth(nextUpdate.getMonth() + 2);
        break;
      default:
        // Si no hay frecuencia específica, asumir anual
        nextUpdate.setFullYear(nextUpdate.getFullYear() + 1);
        break;
    }

    return nextUpdate;
  } catch (error) {
    console.error('Error calculando próxima actualización:', error);
    return null;
  }
};

// 🔧 Función helper para calcular días restantes
const calculateDaysUntilUpdate = (nextUpdateDate) => {
  try {
    if (!nextUpdateDate || isNaN(nextUpdateDate.getTime())) {
      return { days: null, status: 'Sin fecha' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a medianoche
    
    const updateDate = new Date(nextUpdateDate);
    updateDate.setHours(0, 0, 0, 0); // Normalizar a medianoche
    
    const diffTime = updateDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let status = '';
    if (diffDays < 0) {
      status = `${Math.abs(diffDays)} días vencido`;
    } else if (diffDays === 0) {
      status = '¡Vence hoy!';
    } else if (diffDays <= 7) {
      status = `¡${diffDays} días restantes!`;
    } else if (diffDays <= 15) {
      status = `${diffDays} días restantes`;
    } else if (diffDays <= 30) {
      status = `${diffDays} días restantes`;
    } else {
      status = `${diffDays} días restantes`;
    }
    
    return { days: diffDays, status };
  } catch (error) {
    console.error('Error calculando días restantes:', error);
    return { days: null, status: 'Error en cálculo' };
  }
};

// 🔧 Función helper para obtener colores basados en días restantes
const getUpdateColors = (days) => {
  if (days === null) {
    return {
      bgColor: '#f3f4f6', // Gris claro
      textColor: '#6b7280' // Gris
    };
  }
  
  if (days < 0) {
    return {
      bgColor: '#fee2e2', // Rojo claro
      textColor: '#991b1b' // Rojo oscuro
    };
  } else if (days <= 7) {
    return {
      bgColor: '#fef3c7', // Amarillo claro
      textColor: '#92400e' // Amarillo oscuro
    };
  } else if (days <= 15) {
    return {
      bgColor: '#fde68a', // Amarillo
      textColor: '#92400e'
    };
  } else if (days <= 30) {
    return {
      bgColor: '#fed7aa', // Naranja claro
      textColor: '#9a3412'
    };
  } else {
    return {
      bgColor: '#bbf7d0', // Verde claro
      textColor: '#065f46' // Verde oscuro
    };
  }
};

const EstadoContratos = () => {
  const dispatch = useDispatch();
  const { leases, lease, loading, error } = useSelector((state) => state);
  const [editingLeaseId, setEditingLeaseId] = useState(null);
  const [editedLease, setEditedLease] = useState({});
  const [selectedLease, setSelectedLease] = useState(null);

  useEffect(() => {
    console.log("Leases en componente:", leases);
    // 🔧 Debug mejorado: mostrar cálculo de fechas para cada contrato
    if (leases && leases.length > 0) {
      leases.forEach(lease => {
        console.log(`=== Contrato ${lease.id || lease.leaseId} ===`);
        console.log(`  - Fecha inicio: ${lease.startDate}`);
        console.log(`  - Frecuencia: ${lease.updateFrequency}`);
        console.log(`  - NextUpdateDate original: ${lease.nextUpdateDate}`);
        
        const calculatedNext = calculateNextUpdateDate(lease);
        console.log(`  - NextUpdateDate calculada: ${calculatedNext}`);
        
        const { days, status } = calculateDaysUntilUpdate(calculatedNext);
        console.log(`  - Días restantes: ${days}`);
        console.log(`  - Status: ${status}`);
      });
    }
  }, [leases]);

  useEffect(() => {
    dispatch(getAllLeases());
  }, [dispatch]);

  const handleEditClick = (lease) => {
    setEditingLeaseId(lease.leaseId || lease.id);
    setEditedLease(lease);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLease((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = (leaseId) => {
    console.log("Guardando contrato", leaseId, editedLease);
    dispatch(updateLeaseRentAmount(leaseId, editedLease.rentAmount));
    setEditingLeaseId(null);
  };

  const handleDownloadClick = async (leaseId) => {
    try {
      await dispatch(getLeaseById(leaseId));
      
      setTimeout(() => {
        const currentLease = lease;
        
        if (!currentLease) {
          console.error('No se pudo obtener el contrato');
          return;
        }

        console.log('Generando PDF para contrato:', currentLease);

        // Crear el componente y generar automáticamente
        const element = document.createElement("div");
        document.body.appendChild(element);

        const root = ReactDOM.createRoot(element);
        root.render(<ContratoAlquiler lease={currentLease} autoGenerate={true} />);

        // Limpiar después de un momento
        setTimeout(() => {
          root.unmount();
          document.body.removeChild(element);
        }, 1000);
        
      }, 100);
      
    } catch (error) {
      console.error('Error obteniendo contrato:', error);
    }
  };

  const handleSelectLease = (lease) => {
    setSelectedLease(lease);
  };

  const handleUpdateLease = async (id, rentAmount, pdfData, fileName) => {
    console.log("Actualizando contrato", id, rentAmount, pdfData, fileName);
    // await dispatch(updateLease(id, rentAmount, pdfData, fileName));
    setSelectedLease(null);
  };

    return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estado de Contratos</h1>
      
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-blue-600">Cargando contratos...</div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {/* Debug info mejorado */}
      {leases && leases.length > 0 && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <strong>Debug Info:</strong> {leases.length} contrato(s) cargado(s). 
          Fecha actual: {new Date().toLocaleDateString()}
        </div>
      )}

      {/* Tabla de contratos */}
      {leases && leases.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Inquilino</th>
                <th className="py-3 px-4 text-left">Propiedad</th>
                <th className="py-3 px-4 text-left">Propietario</th>
                <th className="py-3 px-4 text-left">ID Contrato</th>
                <th className="py-3 px-4 text-left">Fecha Inicio</th>
                <th className="py-3 px-4 text-left">Monto</th>
                <th className="py-3 px-4 text-left">Próxima Actualización</th>
                <th className="py-3 px-4 text-left">Meses Totales</th>
                <th className="py-3 px-4 text-center">Acciones</th>
                <th className="py-3 px-4 text-center">Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {leases.map((lease) => {
                console.log("Procesando contrato:", lease);
                
                // 🔧 Cálculo mejorado de la próxima actualización
                const nextUpdateDate = lease.nextUpdateDate 
                  ? new Date(lease.nextUpdateDate)
                  : calculateNextUpdateDate(lease);
                
                const { days, status } = calculateDaysUntilUpdate(nextUpdateDate);
                const { bgColor, textColor } = getUpdateColors(days);
                
                return (
                  <tr
                    key={lease.leaseId || lease.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                   <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {lease.Tenant ? lease.Tenant.name : `ID: ${lease.tenantId}`}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          name="propertyId"
                          value={editedLease.propertyId || ""}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full"
                          placeholder="ID Propiedad"
                        />
                      ) : (
                        <div>
                          {lease.Property ? (
                            <div>
                              <div className="font-medium">{lease.Property.address}</div>
                              <div className="text-sm text-gray-500">
                                {lease.Property.neighborhood}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500">ID: {lease.propertyId}</span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="py-3 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          name="landlordId"
                          value={editedLease.landlordId || ""}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full"
                          placeholder="ID Propietario"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">
                          {lease.Landlord && lease.Landlord.name ? 
                            lease.Landlord.name : 
                            `ID: ${lease.landlordId}`
                          }
                        </div>
                      )}
                    </td>
                    
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {lease.leaseId || lease.id}
                      </span>
                    </td>
                    
                    <td className="py-3 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          type="date"
                          name="startDate"
                          value={
                            editedLease.startDate
                              ? new Date(editedLease.startDate).toISOString().substring(0, 10)
                              : ""
                          }
                          onChange={handleInputChange}
                          className="border rounded p-2"
                        />
                      ) : (
                        <div>
                          <div className="font-medium">
                            {lease.startDate ? new Date(lease.startDate).toLocaleDateString() : 'Sin fecha'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lease.updateFrequency || 'Sin frecuencia'}
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="py-3 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          name="rentAmount"
                          value={editedLease.rentAmount || ""}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full"
                          placeholder="Monto"
                        />
                      ) : (
                        <div className="font-bold text-green-600">
                          ${new Intl.NumberFormat("es-AR").format(lease.rentAmount || 0)}
                        </div>
                      )}
                    </td>
                    
                    {/* 🔧 Columna de próxima actualización mejorada */}
                    <td 
                      className="py-3 px-4"
                      style={{ backgroundColor: bgColor, color: textColor }}
                    >
                      <div className="font-medium">
                        {nextUpdateDate && !isNaN(nextUpdateDate.getTime()) 
                          ? nextUpdateDate.toLocaleDateString()
                          : 'Fecha no disponible'
                        }
                      </div>
                      <div className="text-xs font-semibold mt-1">
                        {status}
                      </div>
                      {/* 🔧 Debug info temporal */}
                      <div className="text-xs opacity-70 mt-1">
                        Debug: {days !== null ? `${days}d` : 'N/A'}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          name="totalMonths"
                          value={editedLease.totalMonths || ""}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full"
                          placeholder="Meses"
                        />
                      ) : (
                        <div className="text-center">
                          <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {lease.totalMonths || 0} meses
                          </span>
                        </div>
                      )}
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-center">
                        {editingLeaseId === (lease.leaseId || lease.id) ? (
                          <>
                            <button
                              onClick={() => handleSaveClick(lease.leaseId || lease.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingLeaseId(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(lease)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              title="Editar contrato"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDownloadClick(lease.leaseId || lease.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              title="Descargar PDF"
                            >
                              PDF
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4 text-center">
  <button
    onClick={() => handleSelectLease(lease)}
    className={`px-3 py-1 rounded text-sm transition-colors ${
      days !== null && days < 0 
        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' // 🔧 Botón rojo pulsante para vencidos
        : days !== null && days <= 7
        ? 'bg-orange-500 hover:bg-orange-600 text-white' // 🔧 Botón naranja para próximos a vencer
        : 'bg-purple-500 hover:bg-purple-600 text-white' // 🔧 Botón normal
    }`}
    title={
      days !== null && days < 0 
        ? `¡URGENTE! Actualización vencida hace ${Math.abs(days)} días`
        : days !== null && days <= 7
        ? `Vence en ${days} días - Actualizar pronto`
        : "Actualizar alquiler"
    }
  >
    {days !== null && days < 0 ? '🚨 URGENTE' : 'Actualizar'}
  </button>
</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No hay contratos registrados
            </div>
            <div className="text-sm text-gray-400">
              Los contratos aparecerán aquí una vez que sean creados
            </div>
          </div>
        )
      )}

      {/* Componente de actualización de alquileres */}
      {selectedLease && (
        <div className="mt-6">
          <ActualizarAlquileres
            lease={selectedLease}
            onUpdate={handleUpdateLease}
          />
        </div>
      )}
    </div>
  );
};

export default EstadoContratos;