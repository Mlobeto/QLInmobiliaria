import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllLeases,
  getLeaseById,
  updateLeaseRentAmount,
} from "../../redux/Actions/actions";
import ContratoAlquiler from "../PdfTemplates/ContratoAlquiler";
import html2pdf from "html2pdf.js";
import ActualizarAlquileres from "./ActualizarAlquileres";
import { getUpdateAlert } from "./ContractAlerts";

const EstadoContratos = () => {
  const dispatch = useDispatch();
  const { leases, lease, loading, error } = useSelector((state) => state); // ← Agregar 'lease' al useSelector
  const [editingLeaseId, setEditingLeaseId] = useState(null);
  const [editedLease, setEditedLease] = useState({});
  const [selectedLease, setSelectedLease] = useState(null);

  useEffect(() => {
    console.log("Leases en componente:", leases);
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
      {loading && <p>Cargando contratos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4">Inquilino</th>
              <th className="py-2 px-4">Propiedad</th>
              <th className="py-2 px-4">Propietario</th>
              <th className="py-2 px-4">ID Contrato</th>
              <th className="py-2 px-4">Fecha Inicio</th>
              <th className="py-2 px-4">Monto</th>
              <th className="py-2 px-4">Próxima Actualización</th>
              <th className="py-2 px-4">Meses Totales</th>
              <th className="py-2 px-4">Acciones</th>
              <th className="py-2 px-4">Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {leases &&
              leases.map((lease) => {
                console.log("Contrato:", lease);
                return (
                  <tr
                    key={lease.leaseId || lease.id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-2 px-4">
                      {lease.Tenant ? lease.Tenant.name : lease.tenantId}
                    </td>
                    <td className="py-2 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          name="propertyId"
                          value={editedLease.propertyId}
                          onChange={handleInputChange}
                          className="border rounded p-1"
                        />
                      ) : lease.Property ? (
                        lease.Property.address
                      ) : (
                        lease.propertyId
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          name="landlordId"
                          value={editedLease.landlordId}
                          onChange={handleInputChange}
                          className="border rounded p-1"
                        />
                      ) : lease.Landlord && lease.Landlord.name ? (
                        lease.Landlord.name
                      ) : (
                        lease.landlordId
                      )}
                    </td>
                    <td className="py-2 px-4">{lease.leaseId || lease.id}</td>
                    <td className="py-2 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          type="date"
                          name="startDate"
                          value={
                            editedLease.startDate
                              ? new Date(editedLease.startDate)
                                  .toISOString()
                                  .substring(0, 10)
                              : ""
                          }
                          onChange={handleInputChange}
                          className="border rounded p-1"
                        />
                      ) : (
                        new Date(lease.startDate).toLocaleDateString()
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          name="rentAmount"
                          value={editedLease.rentAmount}
                          onChange={handleInputChange}
                          className="border rounded p-1"
                        />
                      ) : (
                        lease.rentAmount
                      )}
                    </td>
                    <td
                      className="py-2 px-4"
                      style={{
                        background: (() => {
                          const nextUpdate = new Date(lease.nextUpdateDate);
                          const diffDays =
                            (nextUpdate - new Date()) / (1000 * 60 * 60 * 24);
                          if (diffDays < 0) return "#f87171";
                          if (diffDays >= 15) return "#fde68a";
                          return "#bbf7d0";
                        })(),
                      }}
                    >
                      {new Date(lease.nextUpdateDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <input
                          name="totalMonths"
                          value={editedLease.totalMonths}
                          onChange={handleInputChange}
                          className="border rounded p-1"
                        />
                      ) : (
                        lease.totalMonths
                      )}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      {editingLeaseId === (lease.leaseId || lease.id) ? (
                        <button
                          onClick={() =>
                            handleSaveClick(lease.leaseId || lease.id)
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Guardar
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(lease)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadClick(lease.leaseId || lease.id)
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Descargar
                          </button>
                        </>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleSelectLease(lease)}
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {selectedLease && (
        <ActualizarAlquileres
          lease={selectedLease}
          onUpdate={handleUpdateLease}
        />
      )}
    </div>
  );
};

export default EstadoContratos;