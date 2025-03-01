import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLease, getPropertiesById, addPropertyToClientWithRole, getAllClients } from '../../redux/Actions/actions';
import Listado from '../Propiedades/Listado';
import Swal from 'sweetalert2';
import ContratoAlquiler from '../PdfTemplates/ContratoAlquiler';

const CreateLeaseForm = () => {
  const dispatch = useDispatch();
  const property = useSelector(state => state.property);
  const clients = useSelector(state => state.clients);
  const { loading, success, error } = useSelector(state => state.leaseCreate);

  const [showClientList, setShowClientList] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [formData, setFormData] = useState({
    propertyId: '',
    locador: '',
    locatario: '',
    locatarioId: '',
    startDate: '',
    rentAmount: '',
    updateFrequency: '',
    commission: '',
    totalMonths: '',
    inventory: '',
  });

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  useEffect(() => {
    if (property) {
      const owner = property.Clients?.find(client => client.ClientProperty.role === 'propietario');
      setFormData(prevData => ({
        ...prevData,
        locador: owner?.name || '',
        rentAmount: property.price || '',
        commission: property.comision || '',
        inventory: property.inventory || ''
      }));
    }
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'propertyId') {
      // Disparamos la búsqueda solo cuando el valor tenga al menos 2 dígitos (y hasta 4 dígitos)
      if (value.length >= 2 && /^\d{1,4}$/.test(value)) {
        dispatch(getPropertiesById(value));
      }
    }

    if (name === 'locatario') {
      if (value.length > 0) {
        const filtered = clients.filter(client =>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.propertyId || !formData.locatarioId) {
        Swal.fire({
          title: "Error",
          text: "Se requiere seleccionar una propiedad y un inquilino",
          icon: "error",
        });
        return;
      }

      const landlordId = property.Clients?.find(
        client => client.ClientProperty.role === 'propietario'
      )?.idClient;

      if (!landlordId) {
        Swal.fire({
          title: "Error",
          text: "No se encontró el propietario de la propiedad",
          icon: "error",
        });
        return;
      }

      const roleResponse = await dispatch(addPropertyToClientWithRole({
        idClient: formData.locatarioId,
        propertyId: formData.propertyId,
        role: 'inquilino'
      }));
      console.log('Role assignment response:', roleResponse);

      const leaseData = {
        propertyId: parseInt(formData.propertyId),
        landlordId: parseInt(landlordId),
        tenantId: parseInt(formData.locatarioId),
        startDate: formData.startDate,
        rentAmount: formData.rentAmount,
        updateFrequency: formData.updateFrequency,
        commission: formData.commission,
        totalMonths: parseInt(formData.totalMonths),
        inventory: formData.inventory
      };

      const leaseResponse = await dispatch(createLease(leaseData));
      console.log('Lease creation response:', leaseResponse);

      Swal.fire({
        title: "¡Éxito!",
        text: "Contrato creado correctamente y rol de inquilino asignado",
        icon: "success",
      });

      setFormData({
        propertyId: '',
        locador: '',
        locatario: '',
        locatarioId: '',
        startDate: '',
        rentAmount: '',
        updateFrequency: '',
        commission: '',
        totalMonths: '',
        inventory: '',
      });
      setFilteredClients([]);
      setShowClientList(false);
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Error al crear el contrato",
        icon: "error",
      });
    }
  };

  const handleClientSelect = (client) => {
    setFormData(prevData => ({
      ...prevData,
      locatario: client.name,
      locatarioId: client.idClient
    }));
    setShowClientList(false);
  };

  const handlePropertySelect = (property) => {
    setFormData(prevData => ({
      ...prevData,
      propertyId: property.propertyId,
      locador: property.Clients?.find(client =>
        client.ClientProperty.role === 'propietario'
      )?.name || '',
      rentAmount: property.price,
      commission: property.comision,
      inventory: property.inventory
    }));
  };

  // Obtenemos al propietario mediante property.Clients
  const owner = property ? property.Clients?.find(client => client.ClientProperty.role === 'propietario') : null;

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="mb-8">
        <Listado onSelectProperty={handlePropertySelect} />
      </div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Crear Contrato de Alquiler
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Property ID */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    ID Propiedad:
                  </label>
                  <input
                    type="text"
                    name="propertyId"
                    value={formData.propertyId}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    required
                  />
                </div>

                {/* Dueño */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Dueño:
                  </label>
                  <input
                    type="text"
                    name="locador"
                    value={formData.locador}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    required
                  />
                </div>

                {/* Inquilino */}
                <div className="flex flex-col relative">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Inquilino:
                  </label>
                  <input
                    type="text"
                    name="locatario"
                    value={formData.locatario}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    required
                  />
                  {showClientList && filteredClients.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                      {filteredClients.map(client => (
                        <div
                          key={client.idClient}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleClientSelect(client)}
                        >
                          {client.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fecha de Inicio */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Inicio Contrato:
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    required
                  />
                </div>

                {/* Precio */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Precio:
                  </label>
                  <input
                    type="number"
                    name="rentAmount"
                    value={formData.rentAmount}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    required
                  />
                </div>

                {/* Plazo de Actualización */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Plazo de Actualización:
                  </label>
                  <select
                    name="updateFrequency"
                    value={formData.updateFrequency}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    required
                  >
                    <option value="">Seleccionar plazo</option>
                    <option value="semestral">Semestral</option>
                    <option value="cuatrimestral">Cuatrimestral</option>
                    <option value="anual">Anual</option>
                  </select>
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
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                  />
                </div>

                {/* Meses de Contrato */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Meses de contrato total:
                  </label>
                  <input
                    type="number"
                    name="totalMonths"
                    value={formData.totalMonths}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    required
                  />
                </div>

                {/* Inventario */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Inventario:
                  </label>
                  <textarea
                    name="inventory"
                    value={formData.inventory}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 h-32"
                    required
                  ></textarea>
                </div>
                </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 transition-colors duration-300"
                >
                  Crear Contrato
                </button>
              </div>
            </form>
            {loading && <p>Cargando...</p>}
            {success && (
              <div className="mt-4">
                
                {/* En lugar de llamar a handleDownloadPDF, rendereamos el componente ContratoAlquiler */}
                {owner && property && (
                  <ContratoAlquiler client={owner} property={property} />
                )}
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLeaseForm;