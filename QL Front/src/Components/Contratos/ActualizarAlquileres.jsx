import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import { getAllLeases, updateLeaseRentAmount } from "../../redux/Actions/actions";

// Helper para calcular si debe actualizarse
function debeActualizar(lease) {
  const hoy = new Date();
  const inicio = new Date(lease.startDate);
  const meses = {
    semestral: 6,
    cuatrimestral: 4,
    anual: 12,
  }[lease.updateFrequency] || 0;

  let actualizaciones = Math.floor(
    (hoy.getFullYear() - inicio.getFullYear()) * 12 +
      (hoy.getMonth() - inicio.getMonth())
  );
  actualizaciones = Math.floor(actualizaciones / meses) + 1;
  const proxActualizacion = new Date(inicio);
  proxActualizacion.setMonth(inicio.getMonth() + actualizaciones * meses);

  const diff = (proxActualizacion - hoy) / (1000 * 60 * 60 * 24);
  return diff <= 15 && diff >= -meses * 30;
}

const ActualizarAlquileres = () => {
  const dispatch = useDispatch();
  const { leases, loading } = useSelector((state) => state);
  const [indiceIPC, setIndiceIPC] = useState("");
  const [nuevoMonto, setNuevoMonto] = useState({});
  const [pdfGenerado, setPdfGenerado] = useState({});

  useEffect(() => {
    dispatch(getAllLeases());
  }, [dispatch]);

  const leasesParaActualizar = (leases || []).filter(debeActualizar);

  const handleGenerarPDF = (lease) => {
    const fechaHoy = new Date().toLocaleDateString();
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("QUINTERO+LOBETO PROPIEDADES", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`FECHA: ${fechaHoy}`, 20, 35);
    doc.text("IPC", 20, 45);
    doc.text("https://arquiler.com/", 20, 55);
    doc.setFontSize(14);
    doc.text(`${lease.Property?.name || "Propiedad"} ${lease.Property?.direccion || ""}`, 20, 65);
    doc.setFontSize(12);
    doc.text("El cálculo incluye el IPC", 20, 75);
    doc.text(
      `${lease.updateFrequency.toUpperCase()} (${fechaHoy})`,
      20,
      85
    );
    doc.setFontSize(20);
    doc.text(`$ ${nuevoMonto[lease.id] || lease.rentAmount}`, 105, 100, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Aumento ${indiceIPC}`, 105, 110, { align: "center" });

    const fileName = `Actualizacion_Alquiler_${lease.id}_${fechaHoy}.pdf`;
    const pdfBase64 = doc.output("datauristring");

    // Llama a la acción para actualizar el monto y guardar el PDF en el backend
    dispatch(
      updateLeaseRentAmount(
        lease.id,
        nuevoMonto[lease.id],
        fechaHoy,
        pdfBase64,
        fileName
      )
    );

    setPdfGenerado((prev) => ({ ...prev, [lease.id]: true }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contratos a Actualizar</h1>
      <div className="mb-4">
        <label>
          Índice IPC consultado (ej: 13,18%):
          <input
            type="text"
            value={indiceIPC}
            onChange={(e) => setIndiceIPC(e.target.value)}
            className="border border-gray-300 rounded p-2 ml-2"
            placeholder="Ej: 13,18%"
          />
        </label>
      </div>
      {loading ? (
        <p>Cargando contratos...</p>
      ) : leasesParaActualizar.length === 0 ? (
        <p>No hay contratos para actualizar este mes.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th>Propiedad</th>
              <th>Inquilino</th>
              <th>Frecuencia</th>
              <th>Monto Actual</th>
              <th>Nuevo Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leasesParaActualizar.map((lease) => (
              <tr key={lease.id}>
                <td>{lease.Property?.name || lease.propertyId}</td>
                <td>{lease.Tenant?.name || lease.tenantId}</td>
                <td>{lease.updateFrequency}</td>
                <td>${lease.rentAmount}</td>
                <td>
                  <input
                    type="number"
                    value={nuevoMonto[lease.id] || ""}
                    onChange={(e) =>
                      setNuevoMonto((prev) => ({
                        ...prev,
                        [lease.id]: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded p-1 w-24"
                    placeholder="Nuevo monto"
                  />
                </td>
                <td>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleGenerarPDF(lease)}
                    disabled={!nuevoMonto[lease.id] || pdfGenerado[lease.id]}
                  >
                    Generar y Actualizar PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActualizarAlquileres;