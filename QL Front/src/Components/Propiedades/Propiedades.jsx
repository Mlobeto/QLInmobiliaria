import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProperty,
  getAllClients,
  addPropertyToClientWithRole,
} from "../../redux/Actions/actions";
import {
  loadCloudinaryScript,
  openCloudinaryWidget,
} from "../../cloudinaryConfig";

const CreateProperty = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    address: "",
    neighborhood: "",
    city: "",
    type: "",
    typeProperty: "",
    price: "",
    rooms: "",
    bathrooms: "",
    comision: "",
    isAvailable: true,
    description: "",
    escritura: "",
    images: [], // Aquí almacenaremos las URLs de las imágenes subidas
    plantType: "", // Campo nuevo para el tipo de planta
    plantQuantity: "", // Campo nuevo para la cantidad de plantas
    highlights: "",
    idClient: "", // Nuevo campo para id del cliente
    role: "", // Nuevo campo para rol del cliente
  });

  const {
    loading,
    error: propertyError,
    success,
  } = useSelector((state) => state.propertyCreate);

  // Estado de los clientes
  const {
    clients,
    loading: clientsLoading,
    error: clientsError,
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(getAllClients()); // Cargar clientes cuando el componente se monte
  }, [dispatch]);

  const handleWidget = async () => {
    try {
      await loadCloudinaryScript();
      openCloudinaryWidget((uploadedImageUrl) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          images: [...prevFormData.images, uploadedImageUrl],
        }));
      });
    } catch (error) {
      console.error("Error al cargar el script de Cloudinary:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === "comision" ? Number(value) : value;
    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleClientSelect = (e) => {
    const selectedClient = clients?.find(
      (client) => client.idClient === Number(e.target.value)
    );
    console.log("Cliente seleccionado:", selectedClient);
    setFormData((prevData) => ({
      ...prevData,
      idClient: selectedClient ? selectedClient.idClient : "", // Establece el id del cliente
      role: selectedClient ? selectedClient.role : "", // Establece el rol del cliente
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  
    // 1. Crear la propiedad con la acción createProperty
 dispatch(createProperty(formData))
  .then((propertyCreated) => {
    console.log("propertyCreated:", propertyCreated);  // Verifica la respuesta de createProperty

    // Asegúrate de que la propiedad propertyId existe
    if (!propertyCreated || !propertyCreated.propertyId) {
      throw new Error("propertyId no está presente en la respuesta");
    }

    const propertyId = propertyCreated.propertyId;
   console.log("Respuesta de createProperty:", propertyCreated);
    console.log("Despachando addPropertyToClientWithRole con:", {
      propertyId,
      idClient: formData.idClient,
      role: formData.role,
    });
    console.log("Parámetros enviados:", { propertyId, idClient: formData.idClient, role: formData.role });

    dispatch(
      
      addPropertyToClientWithRole(
        propertyId,
        formData.idClient,
        formData.role
      )
    );
  })
  .catch((error) => {
    console.error("Error al crear la propiedad:", error);
  });

  };
 

  useEffect(() => {
    if (success) {
      setFormData({
        address: "",
        neighborhood: "",
        city: "",
        type: "",
        typeProperty: "",
        price: "",
        rooms: "",
        bathrooms: "",
        comision: "",
        isAvailable: true,
        description: "",
        escritura: "",
        images: [],
        plantQuantity: "",
        highlights: "",
      });
      setImages([]);
    }
  }, [success]);

  if (clientsLoading) {
    return <div>Cargando clientes...</div>;
  }

  if (clientsError) {
    return <div>Error al cargar clientes: {clientsError}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-600  shadow-md mt-20">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Crear Propiedad
      </h1>

      {success && (
        <p className="text-center text-green-600 font-medium mb-4">
          ¡Propiedad creada con éxito!
        </p>
      )}
      {propertyError && (
        <p className="text-center text-red-600 font-medium mb-4">
          Error: {propertyError}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div>
          <label htmlFor="client" className="block text-white font-medium mb-2">
            Cliente
          </label>
          <select
            id="client"
            name="client"
            onChange={handleClientSelect}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Seleccione un cliente</option>
            {clients?.map((client) => (
              <option key={client.idClient} value={client.idClient}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="role" className="block text-white font-medium mb-2">
            Seleccionar Rol
          </label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Seleccione un rol</option>
            <option value="propietario">Propietario (Para Alquiler )</option>
            <option value="vendedor">Vendedor (Para venta)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-white font-medium mb-2"
          >
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="neighborhood"
            className="block text-white font-medium mb-2"
          >
            Barrio
          </label>
          <input
            type="text"
            id="neighborhood"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-white font-medium mb-2">
            Ciudad
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-white font-medium mb-2">
            Tipo de Transaccion
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Seleccione</option>
            <option value="alquiler">Alquiler</option>
            <option value="venta">Venta</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="typeProperty"
            className="block text-white font-medium mb-2"
          >
            Tipo de Propiedad
          </label>
          <select
            id="typeProperty"
            name="typeProperty"
            value={formData.typeProperty}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Seleccione</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="duplex">Duplex</option>
            <option value="finca">Finca</option>
            <option value="local">Local Comercial</option>
            <option value="lote">Lote</option>
            <option value="oficina">Oficina</option>
            <option value="terreno">Terreno</option>
          </select>
        </div>
        {formData.typeProperty === "finca" && (
          <>
            <div>
              <label>Tipo de Planta:</label>
              <input
                type="text"
                name="plantType"
                value={formData.plantType}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Cantidad de Plantas:</label>
              <input
                type="number"
                name="plantQuantity"
                value={formData.plantQuantity}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label htmlFor="rooms" className="block text-white font-medium mb-2">
            Ambientes
          </label>
          <select
            id="rooms"
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Seleccione</option>
            <option value="1">Monoambiente</option>
            <option value="2"> 2 Ambientes</option>
            <option value="3">3 Ambientes</option>
            <option value="4">4 Ambientes</option>
            <option value="5">Mas de 4 Ambientes</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="bathrooms"
            className="block text-white font-medium mb-2"
          >
            Cuartos de baño
          </label>
          <select
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Seleccione</option>
            <option value="1">1 Baño</option>
            <option value="2"> 2 Baños</option>
            <option value="3">3 Baños</option>
            <option value="4">4 Baños</option>
            <option value="5">Mas de 4 Baños</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="comision"
            className="block text-white font-medium mb-2"
          >
            Comisión
          </label>
          <input
            type="number"
            id="comision"
            name="comision"
            value={formData.comision}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-white font-medium mb-2">
            Precio
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="escritura"
            className="block text-white font-medium mb-2"
          >
            Escritura
          </label>
          <select
            id="escritura"
            name="escritura"
            value={formData.escritura}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Seleccione</option>
            <option value="prescripcion en tramite">
              Prescripción en Trámite
            </option>
            <option value="escritura"> Escritura</option>
            <option value="prescripcion adjudicada">
              Prescripción Adjudicada
            </option>
            <option value="posesion">Posesión</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-white font-medium mb-2"
          >
            Descripción
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border-gray-300  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="highlights"
            className="block text-white font-medium mb-2"
          >
            Puntos a remarcar (Highlights)
          </label>
          <input
            type="text"
            id="highlights"
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            className="w-full border-gray-600  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Botón para abrir el widget */}
        <div className="ccol-span-full text-center mt-4">
          <button
            type="button"
            onClick={handleWidget}
            className="px-4 py-2 bg-blue-600 text-white  shadow hover:bg-blue-700 active:shadow-inner"
          >
            Subir Imágenes
          </button>
          {formData.images.length > 0 && (
            <div className="col-span-full text-center mt-4">
              {formData.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover  shadow"
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-span-full text-center mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white font-bold  shadow-md hover:bg-green-600 active:bg-green-700 focus:outline-none"
          >
            Guardar Propiedad
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
