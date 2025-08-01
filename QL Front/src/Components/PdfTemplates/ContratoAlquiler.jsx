import PropTypes from 'prop-types';
import jsPDF from 'jspdf';

const ContratoAlquiler = ({ lease, autoGenerate = false }) => {
  const generatePdf = () => {
    const doc = new jsPDF();
    const maxWidth = 160; // Reducir para mejor formato
    let currentY = 20;
    const lineHeight = 6;
    const bottomMargin = 20;

    // Configurar fuente para mejor soporte de caracteres latinos
    doc.setFont("helvetica");

    // Función helper para agregar texto con salto de línea automático
    const addText = (text, y, fontSize = 11, isBold = false) => {
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      doc.setFontSize(fontSize);
      
      // Limpiar caracteres problemáticos
      const cleanText = text
        .replace(/\\n/g, '\n') // Convertir \\n literal a salto de línea real
        .replace(/[ó]/g, 'o')
        .replace(/[á]/g, 'a')
        .replace(/[é]/g, 'e')
        .replace(/[í]/g, 'i')
        .replace(/[ú]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[Ó]/g, 'O')
        .replace(/[Á]/g, 'A')
        .replace(/[É]/g, 'E')
        .replace(/[Í]/g, 'I')
        .replace(/[Ú]/g, 'U')
        .replace(/[Ñ]/g, 'N');

      const lines = doc.splitTextToSize(cleanText, maxWidth);
      doc.text(lines, 25, y);
      return y + (lines.length * lineHeight);
    };

    // Helper function para verificar si necesita nueva página
    const isPageBreakNeeded = (contentHeight) => {
      return currentY + contentHeight + bottomMargin > doc.internal.pageSize.getHeight();
    };

    // Helper function para agregar nueva página si es necesario
    const addPageIfNecessary = (contentHeight) => {
      if (isPageBreakNeeded(contentHeight)) {
        doc.addPage();
        currentY = 20;
      }
    };

    // Helper function para formatear fecha en español
    const formatearFecha = (fecha) => {
      const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      const f = new Date(fecha);
      return `${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`;
    };

    // Helper function para calcular fecha fin
    const calcularFechaFin = (fechaInicio, meses) => {
      const fecha = new Date(fechaInicio);
      fecha.setMonth(fecha.getMonth() + meses);
      return fecha;
    };

    const getUsoPropiedad = (typeProperty) => {
      const usoComercial = ["oficina", "local", "finca"];
      const usoVivienda = ["casa", "departamento", "duplex"];
      const usoTerreno = ["lote", "terreno"];

      if (usoComercial.includes(typeProperty)) return "comercial";
      if (usoVivienda.includes(typeProperty)) return "vivienda particular";
      if (usoTerreno.includes(typeProperty)) return "terreno";
      return "vivienda particular";
    };

    const numeroALetras = (numero) => {
      const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
      const decenas = ["", "diez", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
      const centenas = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

      if (numero === 0) return "cero";
      if (numero === 100) return "cien";
      if (numero === 1000) return "mil";

      let texto = "";

      if (numero >= 1000) {
        const millar = Math.floor(numero / 1000);
        if (millar === 1) {
          texto += "mil ";
        } else {
          texto += numeroALetras(millar) + " mil ";
        }
        numero %= 1000;
      }

      if (numero >= 100) {
        const centena = Math.floor(numero / 100);
        texto += centenas[centena] + " ";
        numero %= 100;
      }

      if (numero > 0) {
        if (numero < 10) {
          texto += unidades[numero];
        } else {
          const decena = Math.floor(numero / 10);
          const unidad = numero % 10;
          texto += decenas[decena];
          if (unidad > 0) {
            texto += " y " + unidades[unidad];
          }
        }
      }

      return texto.trim();
    };

    const formatearMonto = (monto) => {
      const numero = Number(monto);
      return `${numeroALetras(numero).toUpperCase()} PESOS ($${new Intl.NumberFormat("es-AR").format(numero)},00)`;
    };

    // Extraer datos del lease con valores por defecto
    const property = lease.Property || {};
    const tenant = lease.Tenant || {};
    const landlord = lease.Landlord || {};
    const guarantors = lease.Garantors || [];

    // === GENERAR PDF ===

   doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CONTRATO DE LOCACION", 105, currentY, { align: "center" });
    currentY += 15;

    // Encabezado con fecha
    const fechaInicio = formatearFecha(lease.startDate);
    addPageIfNecessary(15);
    currentY = addText(`En Belen, Provincia de Buenos Aires, a los ${fechaInicio}`, currentY, 11, false);
    currentY += 8;


    // Datos de las partes
    const partesText = property.socio
      ? `Entre el Sr/Sra. ${landlord.name || 'N/A'}, CUIL ${landlord.cuil || 'N/A'}, con domicilio en ${landlord.direccion || 'N/A'}, de la ciudad de ${landlord.ciudad || 'N/A'}, en caracter de propietario junto con ${property.socio}, en adelante denominados "LOS LOCADORES", por una parte, y por la otra el Sr/Sra ${tenant.name || 'N/A'}, CUIL ${tenant.cuil || 'N/A'}, con domicilio en ${tenant.direccion || 'N/A'}, ${tenant.ciudad || 'N/A'}, ${tenant.provincia || 'N/A'}, en adelante denominado "LOCATARIO", convienen en celebrar el presente contrato de locacion, sujeto a las siguientes clausulas y condiciones:`
      : `Entre el Sr/Sra. ${landlord.name || 'N/A'}, CUIL ${landlord.cuil || 'N/A'}, con domicilio en ${landlord.direccion || 'N/A'}, de la ciudad de ${landlord.ciudad || 'N/A'}, en adelante denominado "EL LOCADOR", por una parte, y por la otra el Sr/Sra ${tenant.name || 'N/A'}, CUIL ${tenant.cuil || 'N/A'}, con domicilio en ${tenant.direccion || 'N/A'}, ${tenant.ciudad || 'N/A'}, ${tenant.provincia || 'N/A'}, en adelante denominado "EL LOCATARIO", convienen en celebrar el presente contrato de locacion, sujeto a las siguientes clausulas y condiciones:`;

    addPageIfNecessary(50);
    currentY = addText(partesText, currentY);
    currentY += 10;

    // Primera cláusula - Objeto
    const objetoText = `PRIMERA: Objeto. El locador da en locacion al locatario y el locatario acepta de conformidad el inmueble sito en ${property.address || 'N/A'}, ${property.city || 'N/A'}, en adelante denominado el "INMUEBLE LOCADO" para ser destinado a ${getUsoPropiedad(property.typeProperty)}; no pudiendose cambiar el destino de uso. Superficie cubierta: ${property.superficieCubierta || 'N/A'}, Superficie total: ${property.superficieTotal || 'N/A'}. ${property.typeProperty !== "lote" && property.typeProperty !== "terreno" && property.rooms ? `El inmueble cuenta con ${property.rooms} ambientes y ${property.bathrooms || 0} banos.` : ""}`;

    addPageIfNecessary(40);
    currentY = addText(objetoText, currentY);
    currentY += 10;

    // Segunda cláusula - Manifestación
    const manifestacionText = `SEGUNDA: Manifestacion. Las personas anteriormente mencionadas manifiestan no tener capacidad restringida para este acto y convienen en celebrar el presente CONTRATO DE LOCACION DE VIVIENDA, en adelante denominado "CONTRATO", a regirse por el Codigo civil y Comercial de la Nacion, leyes aplicables y las clausulas siguientes.`;

    addPageIfNecessary(30);
    currentY = addText(manifestacionText, currentY);
    currentY += 10;

    // Tercera cláusula - Descripción
    const descripcionText = `TERCERA: Descripcion. El locatario declara conocer y aceptar el inmueble en el estado en que se encuentra, prestando conformidad por haberlo visitado e inspeccionado antes de ahora, la propiedad cuenta con: ${property.description || 'Sin descripcion'} y todas las demas especificaciones contenidas en clausula anexa al presente contrato de locacion.`;

    addPageIfNecessary(35);
    currentY = addText(descripcionText, currentY);
    currentY += 10;

    // Cuarta cláusula - Plazo del contrato
    const startDate = new Date(lease.startDate);
    const endDate = calcularFechaFin(startDate, lease.totalMonths);

    const cuartaClausulaText = `CUARTA: Plazo del contrato. El plazo de la locacion sera de ${numeroALetras(lease.totalMonths)} (${lease.totalMonths}) meses, los mismos se computaran a partir del ${formatearFecha(startDate)}, y hasta el dia ${formatearFecha(endDate)}, recibiendo del locatario la tenencia del inmueble en el dia de la fecha. Es obligacion del locatario restituir al termino de la locacion el inmueble desocupado y en buen estado conforme a los art.1206 y 1207 del CCCN. Si ello no fuere cumplido se cobrara una multa equivalente al 0.4% diario sobre el ultimo alquiler hasta la entrega efectiva del inmueble locado y en las condiciones que le fue entregado.`;

    addPageIfNecessary(60);
    currentY = addText(cuartaClausulaText, currentY);
    currentY += 10;

    // Quinta cláusula - Precio
    const quintaClausulaText = `QUINTA: Precio: El precio del alquiler se fija de comun acuerdo entre las partes por la suma de ${formatearMonto(lease.rentAmount)} para el ${lease.updateFrequency === "semestral" ? "primer semestre" : lease.updateFrequency === "anual" ? "primer ano" : "primer cuatrimestre"} de locacion. Para los ${lease.updateFrequency === "semestral" ? "siguientes semestres" : lease.updateFrequency === "anual" ? "siguientes anos" : "siguientes cuatrimestres"} el precio sera actualizado conforme al Indice de precios al consumidor (IPC) que confecciona y publica el Instituto Nacional de Estadisticas y Censos (INDEC).`;

    addPageIfNecessary(45);
    currentY = addText(quintaClausulaText, currentY);
    currentY += 15;

    // Inventario
    let inventarioLimpio = (lease.inventory || 'Sin inventario especificado')
      .replace(/\\n/g, '\n')
      .replace(/\n-/g, '\n• ');

    const inventarioText = `INVENTARIO:\n${inventarioLimpio}`;
    addPageIfNecessary(30);
    currentY = addText(inventarioText, currentY, 11, true);
    currentY += 15;

    // Garantes
    if (guarantors.length > 0) {
      guarantors.forEach((guarantor, index) => {
        const guarantorText = `DECIMO QUINTO${index > 0 ? ` (${index + 1})` : ''}: Fianza. El Sr/Sra ${guarantor.name}, CUIL ${guarantor.cuil}, con domicilio en ${guarantor.address}, se constituye en fiador solidario, liso, llano y principal pagador de todas y cada una de las obligaciones contraidas por el LOCATARIO en el presente contrato.`;
        
        addPageIfNecessary(25);
        currentY = addText(guarantorText, currentY);
        currentY += 10;
      });
    }

    // Firmas
    addPageIfNecessary(50);
    currentY += 20;
    
    // Líneas de firma
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.line(25, currentY, 85, currentY); // Línea izquierda
    doc.line(110, currentY, 170, currentY); // Línea derecha
    
    currentY += 8;
    doc.text("Firma del LOCADOR", 55, currentY, { align: "center" });
    doc.text("Firma del LOCATARIO", 140, currentY, { align: "center" });

    // Guardar el PDF
    const fechaArchivo = new Date(lease.startDate).toLocaleDateString("es-AR").replace(/\//g, '_');
    doc.save(`Contrato_${lease.id}_${fechaArchivo}.pdf`);
  };

  // Si autoGenerate es true, generar automáticamente
  if (autoGenerate) {
    setTimeout(() => generatePdf(), 100);
    return null;
  }

  return (
    <div className="mt-4">
      <button
        onClick={generatePdf}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generar Contrato PDF
      </button>
    </div>
  );
};

ContratoAlquiler.propTypes = {
  lease: PropTypes.object.isRequired,
  autoGenerate: PropTypes.bool,
};

export default ContratoAlquiler;