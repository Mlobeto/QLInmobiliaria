import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClient } from "../../redux/Actions/actions";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = {
  cuil: "",
  name: "",
  email: "",
  direccion: "",
  ciudad: "",
  provincia: "Catamarca",
  mobilePhone: "",
};

const CreateClientForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);

  const { loading, error, success } = useSelector((state) => state.clientCreate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica en el front
    if (!/^\d{2}-\d{8}-\d$/.test(formData.cuil)) {
      toast.error("El CUIL debe tener el formato XX-XXXXXXXX-X");
      return;
    }
    if (!formData.name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (!formData.direccion.trim()) {
      toast.error("La dirección es obligatoria");
      return;
    }
    if (!formData.ciudad.trim()) {
      toast.error("La ciudad es obligatoria");
      return;
    }
    if (!formData.provincia.trim()) {
      toast.error("La provincia es obligatoria");
      return;
    }
    if (!/^\d{10}$/.test(formData.mobilePhone)) {
      toast.error("El teléfono móvil debe tener 10 dígitos");
      return;
    }

    try {
      await dispatch(createClient(formData));
      toast.success("Cliente creado con éxito");
      setFormData(initialState);
      navigate('/panelClientes');
    } catch (err) {
      // Si el error viene del backend y es un array, muestra cada mensaje
      if (Array.isArray(error)) {
        error.forEach(msg => toast.error(msg));
      } else if (error) {
        toast.error(error);
      } else {
        toast.error("Error al crear el cliente");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-40">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-500 hover:underline"
      >
        Volver
      </button>
      <h1 className="text-2xl font-bold mb-6 text-center">Crear Cliente</h1>
      <form onSubmit={handleSubmit}>
        {/* Campo CUIL */}
        <div className="mb-4">
          <label htmlFor="cuil" className="block text-gray-700 font-medium mb-2">
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
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
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
        {/* Campo Dirección */}
        <div className="mb-4">
          <label htmlFor="direccion" className="block text-gray-700 font-medium mb-2">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Campo Ciudad */}
        <div className="mb-4">
          <label htmlFor="ciudad" className="block text-gray-700 font-medium mb-2">
            Ciudad
          </label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Campo Provincia */}
        <div className="mb-4">
          <label htmlFor="provincia" className="block text-gray-700 font-medium mb-2">
            Provincia
          </label>
          <input
            type="text"
            id="provincia"
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
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
          <label htmlFor="mobilePhone" className="block text-gray-700 font-medium mb-2">
            Teléfono Móvil
          </label>
          <input
            type="text"
            id="mobilePhone"
            name="mobilePhone"
            value={formData.mobilePhone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="10 dígitos (sin 0 ni 15)"
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