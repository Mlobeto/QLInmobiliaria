import React from 'react'

function Section1() {
  return (
    
    <section className="bg-gray-950 text-center text-white py-16 ">
    <h1 className="text-5xl font-bold mt-8">Impulsá tu carrera,<br/>aprendé online y 
      <span className="inline-flex items-center space-x-2">
        <br></br>
        <span>en vivo 🔴</span>
      </span>
    </h1>
    <div className="mt-8">
      <button className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-3 px-8 rounded-lg shadow-lg">
        Inscribirme ahora
      </button>
    </div>
    <p className="mt-4 text-lime-500">2 clases de prueba en tu primer curso</p>
  </section>
);
  
}

export default Section1