import React from 'react';

const Modalities = () => {
  return (
    <div className="bg-gray-950 text-white py-8 px-4">
      {/* Contenedor principal: lado izquierdo y derecho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Lado izquierdo: texto descriptivo */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Nuestras modalidades de cursada</h2>
          <p className="text-gray-400">
            Elige tu cursada con la modalidad que mejor se ajuste a tus necesidades.<br></br> La modalidad seleccionada aplicará para todos los cursos de la carrera,<br></br> salvo que alguno no se encuentre en esa modalidad.
          </p>
        </div>

        {/* Lado derecho: recuadros de modalidades */}
        <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recuadro 1: Modalidad Flex */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-yellow-300 text-2xl font-bold mb-4">Modalidad Flex</h3>
            <p className="text-lime-500 font-bold mb-2">Incluye CourseBecas</p>
            <ul className="list-disc ml-6 text-gray-400 mb-4">
              <li>Contenido pregrabado disponible</li>
              <li>1 clase online en vivo (2 h. semanales)</li>
              <li>Grabación de las clases en vivo</li>
              <li>Preentregas y Proyecto Final</li>
              <li>Profesores y adjuntos disponibles</li>
              <li>70% de asistencia en vivo</li>
              <li>Cumplir con entregables en tiempo y forma</li>
              <li>Ante el incumplimiento de los anteriores, podrás continuar pero se inhabilitará la entrega del Proyecto Final, debiendo abonar una reactivación</li>
            </ul>
            <button className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-2 px-4 rounded-lg mt-2">
              Inscríbete ahora
            </button>
          </div>

          {/* Recuadro 2: Modalidad 100% en vivo */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-yellow-300 text-2xl font-bold mb-4">Modalidad 100% 🔴</h3>
            <p className="text-lime-500 font-bold mb-2">Incluye CourseBecas</p>
            <ul className="list-disc ml-6 text-gray-400 mb-4">
              <li>2 clases online en vivo (4 h. semanales)</li>
              <li>Grabación de las clases en vivo</li>
              <li>Preentregas y Proyecto Final</li>
              <li>Profesores y adjuntos disponibles</li>
              <li>70% de asistencia en vivo</li>
              <li>Cumplir con entregables en tiempo y forma</li>
              <li>Ante el incumplimiento de los anteriores, podrás continuar pero se inhabilitará la entrega del Proyecto Final, debiendo abonar una reactivación</li>
            </ul>
            <button className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-2 px-4 rounded-lg mt-14">
              Inscríbete ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modalities;
