

import  { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProperty, getAllClients } from "../../redux/Actions/actions"; 
import { loadCloudinaryScript, openCloudinaryWidget } from "../../cloudinaryConfig";

const CreateProperty = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
 
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
      cuil: "",
    });

    const { loading: propertyLoading, error: propertyError, success } = useSelector((state) => state.propertyCreate);
  
    // Estado de los clientes
    const { clients, loading: clientsLoading, error: clientsError } = useSelector((state) => state);

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
    const processedValue = name === "comision" || name === "escritura" ? Number(value) : value;
    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleClientSelect = (e) => {
    const selectedClient = clients?.find(client => client.idClient === Number(e.target.value)); // Usar optional chaining (?.)
    console.log("Cliente seleccionado:", selectedClient);
    setFormData((prevData) => ({
      ...prevData,
      cuil: selectedClient ? selectedClient.cuil : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    dispatch(createProperty(formData));
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-40">
    <h1 className="text-2xl font-bold mb-6 text-center">Cargar Propiedad</h1>


      {/* Mensajes de carga, error y éxito */}
      
      {success && <p className="text-green-500 mb-4">Propiedad creada con éxito</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campo CUIL */}

        <div>
        <label>Seleccionar Cliente:</label>
        <select name="client" onChange={handleClientSelect}>
      <option value="">Seleccione un cliente</option>
      {clients && clients.length > 0 ? (
        clients.map((client) => (
          <option key={client.idClient} value={client.idClient}>
            {client.name} {/* Ajusta según los datos del cliente */}
          </option>
        ))
      ) : (
        <option disabled>Cargando clientes...</option>
      )}
    </select>
      </div>
      
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-4">
    <label htmlFor="neighborhood" className="block text-gray-700 font-medium mb-2">
      Barrio
    </label>
    <input
      type="text"
      id="neighborhood"
      name="neighborhood"
      value={formData.neighborhood}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      required
    />
  </div>
  <div className="mb-4">
    <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
      Ciudad
    </label>
    <input
      type="text"
      id="city"
      name="city"
      value={formData.city}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      required
    />
  </div>
  <div className="mb-4">
    <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
      Tipo de Transaccion
    </label>
    <select
      id="type"
      name="type"
      value={formData.type}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
    >
      <option value="">Seleccione</option>
      <option value="alquiler">Alquiler</option>
      <option value="venta">Venta</option>
    </select>
  </div>

  

  <div className="mb-4">
    <label htmlFor="typeProperty" className="block text-gray-700 font-medium mb-2">
      Tipo de Propiedad
    </label>
    <select
      id="typeProperty"
      name="typeProperty"
      value={formData.typeProperty}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
    <label htmlFor="rooms" className="block text-gray-700 font-medium mb-2">
      Ambientes
    </label>
    <select
      id="rooms"
      name="rooms"
      value={formData.rooms}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
    <label htmlFor="bathrooms" className="block text-gray-700 font-medium mb-2">
      Cuartos de baño
    </label>
    <select
      id="bathrooms"
      name="bathrooms"
      value={formData.bathrooms}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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
    <label htmlFor="comision" className="block text-gray-700 font-medium mb-2">
      Comisión
    </label>
    <input
      type="number"
      id="comision"
      name="comision"
      value={formData.comision}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      required
    />
    
  </div>


  <div className="mb-4">
    <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
      Precio
    </label>
    <input
      type="number"
      id="price"
      name="price"
      value={formData.price}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      required
    />
    </div>
  <div className="mb-4">
    <label htmlFor="escritura" className="block text-gray-700 font-medium mb-2">
      Escritura
    </label>
    <select
      id="escritura"
      name="escritura"
      value={formData.escritura}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
    >
      <option value="">Seleccione</option>
      <option value="prescripcion en tramite">Prescripción en Trámite</option>
      <option value="escritura"> Escritura</option>
      <option value="prescripcion adjudicada">Prescripción Adjudicada</option>
      <option value="posesion">Posesión</option>
      
    </select>
  </div>

  <div className="mb-4">
    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
      Descripción
    </label>
    <input
      type="text"
      id="description"
      name="description"
      value={formData.description}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      required
    />
  </div>
  <div className="mb-4">
    <label htmlFor="highlights" className="block text-gray-700 font-medium mb-2">
      Puntos a remarcar (Highlights)
    </label>
    <input
      type="text"
      id="highlights"
      name="highlights"
      value={formData.highlights}
      onChange={handleChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      required
    />
  </div>


        {/* Botón para abrir el widget */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleWidget}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Subir Imágenes
          </button>
        </div>

        {/* Mostrar las imágenes seleccionadas */}
        {formData.images.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-gray-700 mb-2">Imágenes seleccionadas:</p>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={propertyLoading}>
        {propertyLoading ? "Creando..." : "Crear Propiedad"}
      </button>

      {propertyError && <div>Error: {propertyError}</div>}
    </form>
    </div>
  );
};

export default CreateProperty;