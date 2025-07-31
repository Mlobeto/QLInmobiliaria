import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllLeases,
  getLeaseById,
  updateLeaseRentAmount,
} from "../../redux/Actions/actions";
import ContratoAlquiler from "../PdfTemplates/ContratoAlquiler"; // Asegúrate de que la ruta sea correcta
import html2pdf from "html2pdf.js"; // Instala esta biblioteca si no la tienes
import ActualizarAlquileres from "./ActualizarAlquileres";
import { getUpdateAlert } from "./ContractAlerts";

const EstadoContratos = () => {
  const dispatch = useDispatch();
  const { leases, loading, error } = useSelector((state) => state);
  const [editingLeaseId, setEditingLeaseId] = useState(null);
  const [editedLease, setEditedLease] = useState({});
  const [selectedLease, setSelectedLease] = useState(null); // Nuevo estado

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
    // Aquí podrías despachar una acción para actualizar el contrato
    console.log("Guardando contrato", leaseId, editedLease);
    dispatch(updateLeaseRentAmount(leaseId, editedLease.rentAmount));
    // Luego de salvar, salen del modo edición:
    setEditingLeaseId(null);
  };

  const handleDownloadClick = async (leaseId) => {
    await dispatch(getLeaseById(leaseId)); // Obtener el contrato actualizado
    const lease = store.getState().lease; // Asegúrate de acceder al estado correcto

    const element = document.createElement("div");
    document.body.appendChild(element);

    const root = ReactDOM.createRoot(element);
    root.render(<ContratoAlquiler lease={lease} />);

    html2pdf()
      .from(element)
      .save(`Contrato_${leaseId}.pdf`)
      .then(() => {
        root.unmount();
        document.body.removeChild(element);
      });
  };

  const handleSelectLease = (lease) => {
    setSelectedLease(lease);
  };

  const handleUpdateLease = async (id, rentAmount, pdfData, fileName) => {
    // Aquí llamas a tu acción de Redux para actualizar el contrato
    // Asegúrate de que tu acción pueda manejar la subida del PDF
    console.log("Actualizando contrato", id, rentAmount, pdfData, fileName);
    // await dispatch(updateLease(id, rentAmount, pdfData, fileName));
    setSelectedLease(null); // Limpiar selección después de actualizar
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
              {/* Ahora la primera columna muestra el nombre del inquilino */}
              <th className="py-2 px-4">Inquilino</th>
              <th className="py-2 px-4">Propiedad</th>
              <th className="py-2 px-4">Propietario</th>
              <th className="py-2 px-4">ID Contrato</th>
              <th className="py-2 px-4">Fecha Inicio</th>
              <th className="py-2 px-4">Monto</th>
              <th className="py-2 px-4">Próxima Actualización</th>
              <th className="py-2 px-4">Meses Totales</th>
              <th className="py-2 px-4">Acciones</th>
              <th className="py-2 px-4">Seleccionar</th> {/* Nueva columna */}
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
                    {/* Mostrar el nombre del inquilino obtenido de Tenant */}
                    <td className="py-2 px-4">
                      {lease.Tenant ? lease.Tenant.name : lease.tenantId}
                    </td>
                    {/* Mostrar la dirección de la propiedad */}
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
                    {/* Se añade una columna extra para mostrar el id del contrato */}
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
                          if (diffDays < 0) return "#f87171"; // rojo: vencida
                          if (diffDays >= 15) return "#fde68a"; // amarillo: próxima
                          return "#bbf7d0"; // verde: lejos
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
                    </td>{" "}
                    {/* Nueva celda */}
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
