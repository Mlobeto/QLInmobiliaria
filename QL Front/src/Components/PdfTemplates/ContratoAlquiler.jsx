import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ContratoAlquiler = ({ lease, autoGenerate = false }) => {
  const generatePdf = async () => {
    // Si existe customContent (contrato editado), generar PDF desde HTML
    if (lease.customContent) {
      try {
        // Crear un contenedor temporal para el HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = lease.customContent;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '210mm'; // A4 width
        tempDiv.style.padding = '20mm';
        tempDiv.style.backgroundColor = 'white';
        document.body.appendChild(tempDiv);

        // Convertir HTML a canvas
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: tempDiv.scrollWidth,
          height: tempDiv.scrollHeight
        });

        // Remover el elemento temporal
        document.body.removeChild(tempDiv);

        // Crear PDF desde el canvas
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Agregar la primera página
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Agregar páginas adicionales si es necesario
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`Contrato_${lease.Tenant?.name || 'Sin_Nombre'}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
        return;
      } catch (error) {
        console.error('Error generando PDF desde HTML:', error);
        alert('Error al generar el PDF del contrato editado. Se generará el PDF estándar.');
        // Continuar con la generación normal si falla
      }
    }

    // Generación estándar del PDF (código original)
    const maxWidth = 160; // Reducir para mejor formato
    let currentY = 20;
    const lineHeight = 3; // Reducido para fuente más pequeña
    const bottomMargin = 20;
    const doc = new jsPDF();

    // Configurar fuente para mejor soporte de caracteres latinos
    doc.setFont("helvetica");
    const doc = new jsPDF();
    const maxWidth = 160; // Reducir para mejor formato
    let currentY = 20;
    const lineHeight = 3; // Reducido para fuente más pequeña
    const bottomMargin = 20;

    // Configurar fuente para mejor soporte de caracteres latinos
    doc.setFont("helvetica");

    // Función helper para agregar texto con salto de línea automático
    const addText = (text, y, fontSize = 7, isBold = false) => {
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

    // Función mejorada para agregar texto largo con saltos de página automáticos
    const addLongText = (text, y, fontSize = 7, isBold = false) => {
      if (isBold) {
        doc.setFont("helvetica", "bold");
      } else {
        doc.setFont("helvetica", "normal");
      }
      doc.setFontSize(fontSize);
      
      // Limpiar caracteres problemáticos
      const cleanText = text
        .replace(/\\n/g, '\n')
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
      let currentLineY = y;
      
      lines.forEach(line => {
        // Verificar si necesita nueva página antes de cada línea
        if (currentLineY + lineHeight + bottomMargin > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          currentLineY = 20;
        }
        doc.text(line, 25, currentLineY);
        currentLineY += lineHeight;
      });
      
      return currentLineY;
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

    // Determinar el tipo de contrato según typeProperty
    const getTituloContrato = (typeProperty) => {
      const comercial = ["oficina", "local", "finca"];
      const vivienda = ["casa", "departamento", "duplex"];
      
      if (comercial.includes(typeProperty)) {
        return "CONTRATO DE LOCACION DE LOCAL COMERCIAL";
      }
      if (vivienda.includes(typeProperty)) {
        return "CONTRATO DE LOCACION DE INMUEBLE CON DESTINO VIVIENDA";
      }
      // Para lote o terreno
      return "CONTRATO DE LOCACION DE INMUEBLE";
    };

    // === GENERAR PDF ===

   doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(getTituloContrato(property.typeProperty), 105, currentY, { align: "center" });
    currentY += 8;

    // Encabezado con fecha
    const fechaInicio = formatearFecha(lease.startDate);
    addPageIfNecessary(15);
    currentY = addText(`En Belen, Provincia de Buenos Aires, a los ${fechaInicio}`, currentY, 7, false);
    currentY += 4;


    // Datos de las partes - con nombres en negrita
    addPageIfNecessary(50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    
    let partesY = currentY;
    const leftMargin = 25;
    
    if (property.socio) {
      doc.text("Entre el Sr/Sra. ", leftMargin, partesY);
      const afterEntre = doc.getTextWidth("Entre el Sr/Sra. ");
      doc.setFont("helvetica", "bold");
      doc.text(landlord.name || 'N/A', leftMargin + afterEntre, partesY);
      doc.setFont("helvetica", "normal");
      
      const textPart1 = `Entre el Sr/Sra. ${landlord.name || 'N/A'}, CUIL ${landlord.cuil || 'N/A'}, con domicilio en ${landlord.direccion || 'N/A'}, de la ciudad de ${landlord.ciudad || 'N/A'}, en caracter de propietario junto con ${property.socio}, en adelante denominados "LOS LOCADORES", por una parte, y por la otra el Sr/Sra `;
      const lines1 = doc.splitTextToSize(textPart1, maxWidth);
      partesY = addText(textPart1, partesY);
      
      const beforeTenant = doc.getTextWidth(lines1[lines1.length - 1]);
      doc.setFont("helvetica", "bold");
      const tenantNameWidth = doc.getTextWidth(tenant.name || 'N/A');
      
      if (beforeTenant + tenantNameWidth > maxWidth) {
        doc.text(tenant.name || 'N/A', leftMargin, partesY);
        partesY += lineHeight;
      } else {
        doc.text(tenant.name || 'N/A', leftMargin + beforeTenant, partesY - lineHeight);
      }
      
      doc.setFont("helvetica", "normal");
      const textPart2 = `, CUIL ${tenant.cuil || 'N/A'}, con domicilio en ${tenant.direccion || 'N/A'}, ${tenant.ciudad || 'N/A'}, ${tenant.provincia || 'N/A'}, en adelante denominado "LOCATARIO", convienen en celebrar el presente contrato de locacion, sujeto a las siguientes clausulas y condiciones:`;
      partesY = addText(textPart2, partesY);
    } else {
      const textPart1 = `Entre el Sr/Sra. `;
      doc.text(textPart1, leftMargin, partesY);
      const afterEntre = doc.getTextWidth(textPart1);
      doc.setFont("helvetica", "bold");
      doc.text(landlord.name || 'N/A', leftMargin + afterEntre, partesY);
      doc.setFont("helvetica", "normal");
      
      const fullText1 = `Entre el Sr/Sra. ${landlord.name || 'N/A'}, CUIL ${landlord.cuil || 'N/A'}, con domicilio en ${landlord.direccion || 'N/A'}, de la ciudad de ${landlord.ciudad || 'N/A'}, en adelante denominado "EL LOCADOR", por una parte, y por la otra el Sr/Sra `;
      const lines1 = doc.splitTextToSize(fullText1, maxWidth);
      partesY = addText(fullText1, partesY);
      
      const beforeTenant = doc.getTextWidth(lines1[lines1.length - 1]);
      doc.setFont("helvetica", "bold");
      const tenantNameWidth = doc.getTextWidth(tenant.name || 'N/A');
      
      if (beforeTenant + tenantNameWidth > maxWidth) {
        doc.text(tenant.name || 'N/A', leftMargin, partesY);
        partesY += lineHeight;
      } else {
        doc.text(tenant.name || 'N/A', leftMargin + beforeTenant, partesY - lineHeight);
      }
      
      doc.setFont("helvetica", "normal");
      const textPart2 = `, CUIL ${tenant.cuil || 'N/A'}, con domicilio en ${tenant.direccion || 'N/A'}, ${tenant.ciudad || 'N/A'}, ${tenant.provincia || 'N/A'}, en adelante denominado "EL LOCATARIO", convienen en celebrar el presente contrato de locacion, sujeto a las siguientes clausulas y condiciones:`;
      partesY = addText(textPart2, partesY);
    }
    
    currentY = partesY + 6;

    // Primera cláusula - Objeto
    addPageIfNecessary(40);
    doc.setFont("helvetica", "bold");
    doc.text("PRIMERA: Objeto.", 25, currentY);
    const primeraWidth = doc.getTextWidth("PRIMERA: Objeto. ");
    doc.setFont("helvetica", "normal");
    const objetoText = `El locador da en locacion al locatario y el locatario acepta de conformidad el inmueble sito en ${property.address || 'N/A'}, ${property.city || 'N/A'}, en adelante denominado el "INMUEBLE LOCADO" para ser destinado a ${getUsoPropiedad(property.typeProperty)}; no pudiendose cambiar el destino de uso. Superficie cubierta: ${property.superficieCubierta || 'N/A'}, Superficie total: ${property.superficieTotal || 'N/A'}. ${property.typeProperty !== "lote" && property.typeProperty !== "terreno" && property.rooms ? `El inmueble cuenta con ${property.rooms} ambientes y ${property.bathrooms || 0} banos.` : ""}`;
    const lines = doc.splitTextToSize(objetoText, maxWidth - primeraWidth);
    doc.text(lines[0], 25 + primeraWidth, currentY);
    currentY += lineHeight;
    for (let i = 1; i < lines.length; i++) {
      doc.text(lines[i], 25, currentY);
      currentY += lineHeight;
    }
    currentY += 5;

    // Segunda cláusula - Manifestación
    addPageIfNecessary(30);
    doc.setFont("helvetica", "bold");
    doc.text("SEGUNDA: Manifestacion.", 25, currentY);
    const segundaWidth = doc.getTextWidth("SEGUNDA: Manifestacion. ");
    doc.setFont("helvetica", "normal");
    const manifestacionText = `Las personas anteriormente mencionadas manifiestan no tener capacidad restringida para este acto y convienen en celebrar el presente CONTRATO DE LOCACION DE VIVIENDA, en adelante denominado "CONTRATO", a regirse por el Codigo civil y Comercial de la Nacion, leyes aplicables y las clausulas siguientes.`;
    const lines2 = doc.splitTextToSize(manifestacionText, maxWidth - segundaWidth);
    doc.text(lines2[0], 25 + segundaWidth, currentY);
    currentY += lineHeight;
    for (let i = 1; i < lines2.length; i++) {
      doc.text(lines2[i], 25, currentY);
      currentY += lineHeight;
    }
    currentY += 5;

    // Tercera cláusula - Descripción
    addPageIfNecessary(35);
    doc.setFont("helvetica", "bold");
    doc.text("TERCERA: Descripcion.", 25, currentY);
    const terceraWidth = doc.getTextWidth("TERCERA: Descripcion. ");
    doc.setFont("helvetica", "normal");
    const descripcionText = `El locatario declara conocer y aceptar el inmueble en el estado en que se encuentra, prestando conformidad por haberlo visitado e inspeccionado antes de ahora, la propiedad cuenta con: ${property.description || 'Sin descripcion'} y todas las demas especificaciones contenidas en clausula anexa al presente contrato de locacion.`;
    const lines3 = doc.splitTextToSize(descripcionText, maxWidth - terceraWidth);
    doc.text(lines3[0], 25 + terceraWidth, currentY);
    currentY += lineHeight;
    for (let i = 1; i < lines3.length; i++) {
      doc.text(lines3[i], 25, currentY);
      currentY += lineHeight;
    }
    currentY += 5;

    // Cuarta cláusula - Plazo del contrato
    const startDate = new Date(lease.startDate);
    const endDate = calcularFechaFin(startDate, lease.totalMonths);

    addPageIfNecessary(60);
    doc.setFont("helvetica", "bold");
    doc.text("CUARTA: Plazo del contrato.", 25, currentY);
    const cuartaWidth = doc.getTextWidth("CUARTA: Plazo del contrato. ");
    doc.setFont("helvetica", "normal");
    const cuartaClausulaText = `El plazo de la locacion sera de ${numeroALetras(lease.totalMonths)} (${lease.totalMonths}) meses, los mismos se computaran a partir del ${formatearFecha(startDate)}, y hasta el dia ${formatearFecha(endDate)}, recibiendo del locatario la tenencia del inmueble en el dia de la fecha. Es obligacion del locatario restituir al termino de la locacion el inmueble desocupado y en buen estado conforme a los art.1206 y 1207 del CCCN. Si ello no fuere cumplido se cobrara una multa equivalente al 0.4% diario sobre el ultimo alquiler hasta la entrega efectiva del inmueble locado y en las condiciones que le fue entregado.`;
    const lines4 = doc.splitTextToSize(cuartaClausulaText, maxWidth - cuartaWidth);
    doc.text(lines4[0], 25 + cuartaWidth, currentY);
    currentY += lineHeight;
    for (let i = 1; i < lines4.length; i++) {
      doc.text(lines4[i], 25, currentY);
      currentY += lineHeight;
    }
    currentY += 5;

    // Quinta cláusula - Precio
    addPageIfNecessary(45);
    doc.setFont("helvetica", "bold");
    doc.text("QUINTA: Precio:", 25, currentY);
    const quintaWidth = doc.getTextWidth("QUINTA: Precio: ");
    doc.setFont("helvetica", "normal");
    const quintaClausulaText = `El precio del alquiler se fija de comun acuerdo entre las partes por la suma de ${formatearMonto(lease.rentAmount)} para el ${lease.updateFrequency === "semestral" ? "primer semestre" : lease.updateFrequency === "anual" ? "primer ano" : "primer cuatrimestre"} de locacion. Para los ${lease.updateFrequency === "semestral" ? "siguientes semestres" : lease.updateFrequency === "anual" ? "siguientes anos" : "siguientes cuatrimestres"} el precio sera actualizado conforme al Indice de precios al consumidor (IPC) que confecciona y publica el Instituto Nacional de Estadisticas y Censos (INDEC).`;
    const lines5 = doc.splitTextToSize(quintaClausulaText, maxWidth - quintaWidth);
    doc.text(lines5[0], 25 + quintaWidth, currentY);
    currentY += lineHeight;
    for (let i = 1; i < lines5.length; i++) {
      doc.text(lines5[i], 25, currentY);
      currentY += lineHeight;
    }
    currentY += 6;

    // Inventario
    let inventarioLimpio = (lease.inventory || 'Sin inventario especificado')
      .replace(/\\n/g, '\n')
      .replace(/\n-/g, '\n• ');

    // Usar addLongText para manejar inventarios largos con saltos de página automáticos
    doc.setFont("helvetica", "bold");
    doc.text("INVENTARIO:", 25, currentY);
    currentY += lineHeight;
    doc.setFont("helvetica", "normal");
    currentY = addLongText(inventarioLimpio, currentY, 7, false);
    currentY += 6;

    // Garantes
    if (guarantors.length > 0) {
      guarantors.forEach((guarantor, index) => {
        addPageIfNecessary(25);
        doc.setFont("helvetica", "bold");
        const garanteTitle = `DECIMO QUINTO${index > 0 ? ` (${index + 1})` : ''}: Fianza.`;
        doc.text(garanteTitle, 25, currentY);
        const garanteWidth = doc.getTextWidth(garanteTitle + " ");
        doc.setFont("helvetica", "normal");
        const guarantorText = `El Sr/Sra ${guarantor.name}, CUIL ${guarantor.cuil}, con domicilio en ${guarantor.address}, se constituye en fiador solidario, liso, llano y principal pagador de todas y cada una de las obligaciones contraidas por el LOCATARIO en el presente contrato.`;
        const linesG = doc.splitTextToSize(guarantorText, maxWidth - garanteWidth);
        doc.text(linesG[0], 25 + garanteWidth, currentY);
        currentY += lineHeight;
        for (let i = 1; i < linesG.length; i++) {
          doc.text(linesG[i], 25, currentY);
          currentY += lineHeight;
        }
        currentY += 5;
      });
    }

    // Firmas
    addPageIfNecessary(50);
    currentY += 20;
    
    // Líneas de firma
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
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
  lease: PropTypes.object,
  autoGenerate: PropTypes.bool,
};

export default ContratoAlquiler;