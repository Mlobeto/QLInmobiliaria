import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IoLogOutOutline } from 'react-icons/io5';
//import { uploadVideoToCloudinary } from '../../../redux/Actions/cloudinaryActions'; // Importa la acción para subir videos

const CargarCurso = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    type: '',
    duration: '',
    price: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar la carga de archivo de video
  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // Subir el curso y video a Cloudinary
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (videoFile) {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('upload_preset', 'tu_cloudinary_preset'); // Reemplaza con tu preset de Cloudinary
    //   dispatch(uploadVideoToCloudinary(formData)); // Enviar el video a Cloudinary
    }

    // Aquí puedes enviar los datos del curso a tu backend después de subir el video
    console.log('Datos del curso cargado:', courseData);

    // Redirigir o mostrar un mensaje de éxito
    navigate('/panel');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Navbar */}
      <div className="w-full bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <Link to="/panel" className="text-white text-xl font-semibold hover:underline">
          Panel
        </Link>
        
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-8 mt-8 text-lime-500 uppercase">Aquí podrás cargar cursos, videos y más</h1>
        
        {/* Formulario para cargar cursos */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Título del curso
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingresa el título del curso"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
              Tipo de curso
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={courseData.type}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Producto, Video, etc."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Descripción del curso"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
              Duración
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={courseData.duration}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="16 semanas, 2 clases semanales, etc."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Precio
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="780.000 ARS, 198.900 ARS, etc."
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoFile">
              Cargar Video del Curso
            </label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleFileChange}
              className="w-full text-gray-700 py-2 px-3 border rounded shadow focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Subir Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CargarCurso;
