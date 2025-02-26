import React, { useState } from "react";
import { jsPDF } from "jspdf";

const ReceiptGenerator = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    domicilio: "",
    localidad: "",
    monto: "",
    concepto: "",
    cheque: "",
    banco: "",
    fecha: "",
  });

  // Manejo del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generar el PDF con los datos del formulario
  const generateReceipt = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("QUINTERO + LOBETO", 20, 20);
    doc.setFontSize(10);
    doc.text("PROPIEDADES", 20, 25);
    doc.text("de LOBETO MARIANA", 20, 30);
    doc.text("ARQUITECTA", 20, 35);
    doc.text("M.P. Nº 278", 20, 40);
    doc.text("AVDA. CUBA Nº 50 / Tel. 3835 - 461334", 20, 45);
    doc.text("C.P. 4750 - Belén - Catamarca", 20, 50);
    doc.text("arquitectalobetomariana@yahoo.com.ar", 20, 55);
    doc.text("IVA RESPONSABLE MONOTRIBUTO", 20, 60);

    // Número de recibo y fecha
    doc.text("Nº 00002 - 00000762", 150, 20);
    doc.setFontSize(12);
    doc.text("RECIBO", 150, 30);
    doc.setFontSize(10);
    doc.text("DOCUMENTO NO VALIDO COMO FACTURA", 130, 35);
    
    doc.text("Fecha:", 150, 45);
    doc.text(formData.fecha, 170, 45);

    // Datos del receptor
    doc.text("Señor(es):", 20, 70);
    doc.text(formData.nombre, 50, 70);
    doc.text("Tel:", 185, 70);
    doc.text(formData.telefono, 195, 70);

    doc.text("Domicilio:", 20, 80);
    doc.text(formData.domicilio, 50, 80);
    doc.text("Localidad:", 20, 90);
    doc.text(formData.localidad, 50, 90);

    // Datos del monto
    doc.text("Recibí la suma de Pesos:", 20, 120);
    doc.text(formData.monto, 70, 120);

    doc.text("En concepto de:", 20, 130);
    doc.text(formData.concepto, 50, 130);

    doc.text("Cheque Nº:", 20, 145);
    doc.text(formData.cheque, 50, 145);
    doc.text("Banco:", 140, 145);
    doc.text(formData.banco, 160, 145);

    doc.text("Son $:", 20, 160);
    doc.text(formData.monto, 50, 160);

    // Firma
    doc.text("Firma y aclaración", 150, 180);
    doc.line(130, 185, 200, 185);

    doc.save("Recibo.pdf");
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Generar Recibo</h2>
      <form className="grid gap-4">
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Domicilio:</label>
            <input
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Localidad:</label>
            <input
              type="text"
              name="localidad"
              value={formData.localidad}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </fieldset>

        <div>
          <label className="block text-sm font-semibold">Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Monto:</label>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Concepto:</label>
          <input
            type="text"
            name="concepto"
            value={formData.concepto}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Cheque Nº:</label>
            <input
              type="text"
              name="cheque"
              value={formData.cheque}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Banco:</label>
            <input
              type="text"
              name="banco"
              value={formData.banco}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </fieldset>

        <button
          type="button"
          onClick={generateReceipt}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Generar Recibo PDF
        </button>
      </form>
    </div>
  );
};

export default ReceiptGenerator;
