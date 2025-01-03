import  { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClient } from "../../redux/Actions/actions"; // Ajusta la ruta según tu estructura

const CreateClientForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    cuil: "",
    name: "",
    email: "",
    mobilePhone: "",
  });

  const { loading, error, success } = useSelector((state) => state.clientCreate); // Ajusta el estado si es diferente

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario antes de enviar:", formData); // Debug
    dispatch(createClient(formData));
  };

  return (
    <div className="max-w-md mx-auto  p-6 bg-white rounded-lg shadow-md mt-40">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Cliente</h1>

      {/* Mensajes de carga, error y éxito */}
      {loading && <p className="text-blue-500 mb-4">Creando cliente...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Cliente creado con éxito</p>}

      <form onSubmit={handleSubmit}>
        {/* Campo CUIL */}
        <div className="mb-4">
          <label
            htmlFor="cuil"
            className="block text-gray-700 font-medium mb-2"
          >
            CUIL
          </label>
          <input
            type="text"
            id="cuil"
            name="cuil"
            value={formData.cuil}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="XX-XXXXXXXX-X"
            required
          />
        </div>

        {/* Campo Nombre */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del cliente"
            required
          />
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@ejemplo.com"
          />
        </div>

        {/* Campo Teléfono Móvil */}
        <div className="mb-4">
          <label
            htmlFor="mobilePhone"
            className="block text-gray-700 font-medium mb-2"
          >
            Teléfono Móvil
          </label>
          <input
            type="text"
            id="mobilePhone"
            name="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="10 dígitos (sin espacios ni guiones)"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full text-white font-bold py-2 px-4 rounded-lg focus:outline-none ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Cliente"}
        </button>
      </form>
    </div>
  );
};

export default CreateClientForm;
