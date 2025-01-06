import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';

const PanelPropiedades = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí agregarías tu lógica de logout
    navigate('/panel'); // Redirigir al login después del logout
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-80">
      {/* Header */}
      <div className="w-full bg-gray-800 p-2 shadow-md flex justify-between items-center ">
        <Link to="/" className="text-white text-xl font-semibold hover:underline">
          Panel
        </Link>
        <button
          onClick={handleLogout}
          className="text-white text-xl flex items-center space-x-2 hover:underline "
        >
          <span>Salir</span>
          <IoLogOutOutline className="w-6 h-6" />
        </button>
      </div>

      {/* Centro de la pantalla */}
      <div className="flex-grow flex flex-col justify-center items-center space-y-4 p-6">
        <div className="flex flex-row justify-center items-center space-x-2">
          <Link
            to="/cargarPropiedad"
            className="w-64 h-64 bg-lime-500 hover:bg-lime-600 text-black flex justify-center items-center rounded-lg shadow-lg text-2xl font-semibold transition duration-300 uppercase"
          >
            Alta Propiedades
          </Link>
       
          <Link
            to="/filtro"
            className="w-64 h-64 bg-yellow-500 text-white flex justify-center items-center rounded-lg shadow-lg text-2xl font-semibold hover:bg-yellow-600 transition duration-300 uppercase"
          >
            Filtro
          </Link>
          <Link
            to="/listadoDePropiedades"
            className="w-64 h-64 bg-lime-500 hover:bg-lime-600 text-black flex justify-center items-center rounded-lg shadow-lg text-2xl font-semibold transition duration-300 uppercase"
          >
            Listado
          </Link>
         
        </div>

       
       
      </div>
    </div>
  );
};

export default PanelPropiedades;