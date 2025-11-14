// Utilidad para generar el HTML del contrato desde los datos del lease
export const generarHTMLContrato = (lease) => {
  const property = lease.Property || {};
  const tenant = lease.Tenant || {};
  const landlord = lease.Landlord || {};
  const guarantors = lease.Garantors || [];

  // Funciones auxiliares
  const formatearFecha = (fecha) => {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const f = new Date(fecha);
    return `${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`;
  };

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

  const getTituloContrato = (typeProperty) => {
    const comercial = ["oficina", "local", "finca"];
    const vivienda = ["casa", "departamento", "duplex"];
    
    if (comercial.includes(typeProperty)) {
      return "CONTRATO DE LOCACION DE LOCAL COMERCIAL";
    }
    if (vivienda.includes(typeProperty)) {
      return "CONTRATO DE LOCACION DE INMUEBLE CON DESTINO VIVIENDA";
    }
    return "CONTRATO DE LOCACION DE INMUEBLE";
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

  const startDate = new Date(lease.startDate);
  const endDate = calcularFechaFin(startDate, lease.totalMonths);

  // Generar HTML
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrato de Locación #${lease.id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 20px;
    }
    p {
      text-align: justify;
      margin: 10px 0;
    }
    .fecha {
      margin: 20px 0;
    }
    .clausula {
      margin: 15px 0;
    }
    .titulo-clausula {
      font-weight: bold;
    }
    .inventario {
      white-space: pre-wrap;
      margin: 15px 0;
      padding: 10px;
      background-color: #f5f5f5;
    }
    .firmas {
      margin-top: 40px;
      display: flex;
      justify-content: space-around;
    }
    .firma {
      text-align: center;
      padding-top: 40px;
      border-top: 1px solid #000;
      width: 200px;
    }
  </style>
</head>
<body>
  <h1>${getTituloContrato(property.typeProperty)}</h1>
  
  <p class="fecha">En Belen, Provincia de Buenos Aires, a los ${formatearFecha(lease.startDate)}</p>
  
  <p>
    ${property.socio 
      ? `Entre el Sr/Sra. <strong>${landlord.name || 'N/A'}</strong>, CUIL ${landlord.cuil || 'N/A'}, con domicilio en ${landlord.direccion || 'N/A'}, de la ciudad de ${landlord.ciudad || 'N/A'}, en carácter de propietario junto con ${property.socio}, en adelante denominados "LOS LOCADORES", por una parte, y por la otra el Sr/Sra <strong>${tenant.name || 'N/A'}</strong>, CUIL ${tenant.cuil || 'N/A'}, con domicilio en ${tenant.direccion || 'N/A'}, ${tenant.ciudad || 'N/A'}, ${tenant.provincia || 'N/A'}, en adelante denominado "LOCATARIO"`
      : `Entre el Sr/Sra. <strong>${landlord.name || 'N/A'}</strong>, CUIL ${landlord.cuil || 'N/A'}, con domicilio en ${landlord.direccion || 'N/A'}, de la ciudad de ${landlord.ciudad || 'N/A'}, en adelante denominado "EL LOCADOR", por una parte, y por la otra el Sr/Sra <strong>${tenant.name || 'N/A'}</strong>, CUIL ${tenant.cuil || 'N/A'}, con domicilio en ${tenant.direccion || 'N/A'}, ${tenant.ciudad || 'N/A'}, ${tenant.provincia || 'N/A'}, en adelante denominado "EL LOCATARIO"`
    }, convienen en celebrar el presente contrato de locación, sujeto a las siguientes cláusulas y condiciones:
  </p>

  <div class="clausula">
    <p><span class="titulo-clausula">PRIMERA: Objeto.</span> El locador da en locación al locatario y el locatario acepta de conformidad el inmueble sito en ${property.address || 'N/A'}, ${property.city || 'N/A'}, en adelante denominado el "INMUEBLE LOCADO" para ser destinado a ${getUsoPropiedad(property.typeProperty)}; no pudiéndose cambiar el destino de uso. Superficie cubierta: ${property.superficieCubierta || 'N/A'}, Superficie total: ${property.superficieTotal || 'N/A'}. ${property.typeProperty !== "lote" && property.typeProperty !== "terreno" && property.rooms ? `El inmueble cuenta con ${property.rooms} ambientes y ${property.bathrooms || 0} baños.` : ""}</p>
  </div>

  <div class="clausula">
    <p><span class="titulo-clausula">SEGUNDA: Manifestación.</span> Las personas anteriormente mencionadas manifiestan no tener capacidad restringida para este acto y convienen en celebrar el presente CONTRATO DE LOCACION DE VIVIENDA, en adelante denominado "CONTRATO", a regirse por el Código civil y Comercial de la Nación, leyes aplicables y las cláusulas siguientes.</p>
  </div>

  <div class="clausula">
    <p><span class="titulo-clausula">TERCERA: Descripción.</span> El locatario declara conocer y aceptar el inmueble en el estado en que se encuentra, prestando conformidad por haberlo visitado e inspeccionado antes de ahora, la propiedad cuenta con: ${property.description || 'Sin descripción'} y todas las demás especificaciones contenidas en cláusula anexa al presente contrato de locación.</p>
  </div>

  <div class="clausula">
    <p><span class="titulo-clausula">CUARTA: Plazo del contrato.</span> El plazo de la locación será de ${numeroALetras(lease.totalMonths)} (${lease.totalMonths}) meses, los mismos se computarán a partir del ${formatearFecha(startDate)}, y hasta el día ${formatearFecha(endDate)}, recibiendo del locatario la tenencia del inmueble en el día de la fecha. Es obligación del locatario restituir al término de la locación el inmueble desocupado y en buen estado conforme a los art.1206 y 1207 del CCCN. Si ello no fuere cumplido se cobrará una multa equivalente al 0.4% diario sobre el último alquiler hasta la entrega efectiva del inmueble locado y en las condiciones que le fue entregado.</p>
  </div>

  <div class="clausula">
    <p><span class="titulo-clausula">QUINTA: Precio:</span> El precio del alquiler se fija de común acuerdo entre las partes por la suma de ${formatearMonto(lease.rentAmount)} para el ${lease.updateFrequency === "semestral" ? "primer semestre" : lease.updateFrequency === "anual" ? "primer año" : "primer cuatrimestre"} de locación. Para los ${lease.updateFrequency === "semestral" ? "siguientes semestres" : lease.updateFrequency === "anual" ? "siguientes años" : "siguientes cuatrimestres"} el precio será actualizado conforme al Índice de precios al consumidor (IPC) que confecciona y publica el Instituto Nacional de Estadísticas y Censos (INDEC).</p>
  </div>

  <div class="clausula">
    <p class="titulo-clausula">INVENTARIO:</p>
    <div class="inventario">${lease.inventory || 'Sin inventario especificado'}</div>
  </div>

  ${guarantors.length > 0 ? guarantors.map((guarantor, index) => `
    <div class="clausula">
      <p><span class="titulo-clausula">DÉCIMO QUINTO${index > 0 ? ` (${index + 1})` : ''}: Fianza.</span> El Sr/Sra ${guarantor.name}, CUIL ${guarantor.cuil}, con domicilio en ${guarantor.address}, se constituye en fiador solidario, liso, llano y principal pagador de todas y cada una de las obligaciones contraídas por el LOCATARIO en el presente contrato.</p>
    </div>
  `).join('') : ''}

  <div class="firmas">
    <div class="firma">Firma del LOCADOR</div>
    <div class="firma">Firma del LOCATARIO</div>
  </div>
</body>
</html>
  `;

  return html;
};
