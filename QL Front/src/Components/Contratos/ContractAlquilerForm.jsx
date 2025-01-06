import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createLease,
  getAllClients,
  getPropertiesByClient,
} from "../../redux/Actions/actions"; // Acción para guardar el contrato

const ContractAlquilerForm = () => {
  const dispatch = useDispatch();


  const initialState = {
    propertyId: "",
    idClient: "",
    startDate: "",
    paymentDate: "",
    rentAmount: "",
    totalMonths: "",
    period: "",
    inventory: "",
    installmentNumber: "",
    totalInstallments: "",
};

  const propertys = useSelector((state) => state.propertys);
  const clients = useSelector((state) => state.clients);
  const [formData, setFormData] = useState(initialState);
 
 useEffect(() => {
    // Obtener todos los clientes al cargar el formulario
    dispatch(getAllClients());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
};

const handleClientSelection = (e) => {
    const idClient = e.target.value;
    setFormData((prevState) => ({ ...prevState, idClient }));
    // Despachar para obtener las propiedades del cliente seleccionado
    dispatch(getPropertiesByClient(idClient));
};

const handleSubmit = (e) => {
    e.preventDefault();
    // Despachar acción para crear el contrato
    dispatch(createLease(formData));
};

return (
    <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Crear Contrato</h2>
        <form onSubmit={handleSubmit}>
            {/* Selección del cliente */}
            <label className="block mb-2 font-medium">Seleccionar Cliente:</label>
            <select
                name="idClient"
                value={formData.idClient}
                onChange={handleClientSelection}
                className="w-full p-2 mb-4 border rounded"
            >
                <option value="">Seleccione un cliente</option>
                {clients.map((client) => (
                    <option key={client.idClient} value={client.idClient}>
                        {client.name} - {client.email}
                    </option>
                ))}
            </select>

            {/* Selección de la propiedad */}
            {propertys.length > 0 && (
                <>
                    <label className="block mb-2 font-medium">Seleccionar Propiedad:</label>
                    <select
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border rounded"
                    >
                        <option value="">Seleccione una propiedad</option>
                        {propertys.map((property) => (
                            <option key={property.propertyId} value={property.propertyId}>
                                {property.address} - {property.type}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {/* Campos adicionales */}
            <label className="block mb-2 font-medium">Fecha de Inicio:</label>
            <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 font-medium">Fecha de Pago:</label>
            <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 font-medium">Monto del Alquiler:</label>
            <input
                type="number"
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 font-medium">Meses Totales:</label>
            <input
                type="number"
                name="totalMonths"
                value={formData.totalMonths}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 font-medium">Período:</label>
            <input
                type="text"
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 font-medium">Inventario:</label>
            <textarea
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 font-medium">Número de Cuotas:</label>
            <input
                type="number"
                name="installmentNumber"
                value={formData.installmentNumber}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
            />

            <label className="block mb-2 font-medium">Cuotas Totales:</label>
            <input
                type="number"
                name="totalInstallments"
                value={formData.totalInstallments}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
            />

            {/* Botón para guardar */}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Guardar Contrato
            </button>
        </form>
    </div>
);
};

export default ContractAlquilerForm;
