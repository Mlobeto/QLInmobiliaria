// Utilidad para generar el HTML del contrato desde los datos del lease
export const generarHTMLContrato = (lease, clausulasAdicionales = []) => {
  const property = lease.Property || {};
  const tenant = lease.Tenant || {};
  const landlord = lease.Landlord || {};
  const guarantors = lease.Garantors || [];

  // Funciones auxiliares
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    // Parsear correctamente evitando conversión UTC
    let f;
    if (typeof fecha === 'string') {
      // Si viene en formato ISO, tomar solo la parte de fecha
      const dateOnly = fecha.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);
      // Crear fecha en hora local sin conversión UTC
      f = new Date(year, month - 1, day);
    } else {
      f = new Date(fecha);
    }
    
    return `${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}`;
  };

  const calcularFechaFin = (fechaInicio, meses) => {
    // Parsear correctamente la fecha de inicio
    let fecha;
    if (typeof fechaInicio === 'string') {
      const dateOnly = fechaInicio.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);
      fecha = new Date(year, month - 1, day);
    } else {
      fecha = new Date(fechaInicio);
    }
    
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

  // ==========================================================
  // DATOS FIJOS DE LA INMOBILIARIA (editar acá si cambian)
  // ==========================================================
  const ADMINISTRADOR = 'QUINTERO LOBETO';
  const DOMICILIO_PAGO = 'el local comercial de Quintero Lobeto, sito en Av. Gobernador Cubas Nº 50 de la ciudad de Belén';
  const CIUDAD_FIRMA = 'Belén';
  const PROVINCIA_FIRMA = 'Catamarca';

  // Parsear correctamente startDate evitando conversión UTC
  let startDate;
  if (typeof lease.startDate === 'string') {
    const dateOnly = lease.startDate.split('T')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    startDate = new Date(year, month - 1, day);
  } else {
    startDate = new Date(lease.startDate);
  }

  // Fin del contrato: inicio + meses - 1 día (ej: 1/10/2026 + 24 meses => 30/09/2028)
  const endDate = calcularFechaFin(lease.startDate, lease.totalMonths);
  endDate.setDate(endDate.getDate() - 1);

  const getDestinoLocacion = (typeProperty) => {
    const comercial = ["oficina", "local", "finca"];
    const vivienda = ["casa", "departamento", "duplex"];
    
    if (comercial.includes(typeProperty)) {
      return "a fines comerciales";
    }
    if (vivienda.includes(typeProperty)) {
      return "a vivienda exclusivamente";
    }
    return "al destino acordado";
  };

  // Superficie: si viene solo el número, le agrega "m²"
  const formatearSuperficie = (valor) => {
    if (!valor) return null;
    const v = String(valor).trim();
    return /^\d+([.,]\d+)?$/.test(v) ? `${v} m²` : v;
  };

  // Datos de actualización según la frecuencia del contrato
  const FRECUENCIAS = {
    trimestral:    { meses: 3,  periodo: 'primer trimestre' },
    cuatrimestral: { meses: 4,  periodo: 'primer cuatrimestre' },
    semestral:     { meses: 6,  periodo: 'primer semestre' },
    anual:         { meses: 12, periodo: 'primer año' },
  };
  const frecuencia = FRECUENCIAS[lease.updateFrequency] || FRECUENCIAS.anual;
  const primeraActualizacion = calcularFechaFin(lease.startDate, frecuencia.meses);

  // Numeración automática de cláusulas (si no hay garantes, no queda un hueco)
  const ORDINALES = [
    'PRIMERA', 'SEGUNDA', 'TERCERA', 'CUARTA', 'QUINTA', 'SEXTA', 'SEPTIMA', 'OCTAVA', 'NOVENA', 'DECIMA',
    'DECIMA PRIMERA', 'DECIMA SEGUNDA', 'DECIMA TERCERA', 'DECIMA CUARTA', 'DECIMA QUINTA',
    'DECIMA SEXTA', 'DECIMA SEPTIMA', 'DECIMA OCTAVA', 'DECIMA NOVENA', 'VIGESIMA',
  ];
  let numClausula = 0;
  const siguiente = () => ORDINALES[numClausula++] || `CLÁUSULA ${numClausula}`;

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const supCubierta = formatearSuperficie(property.superficieCubierta);
  const supTotal = formatearSuperficie(property.superficieTotal);
  const esTerreno = property.typeProperty === "lote" || property.typeProperty === "terreno";

  const descripcionInmueble = [
    supCubierta ? `una superficie cubierta de ${supCubierta}` : null,
    supTotal ? `una superficie total de ${supTotal}` : null,
    !esTerreno && property.rooms ? `${property.rooms} ambientes y ${property.bathrooms || 0} baño${Number(property.bathrooms) === 1 ? '' : 's'}` : null,
  ].filter(Boolean).join(', ');

  // ==========================================================
  // CLÁUSULAS
  // ==========================================================
  const clausula = (titulo, cuerpo) => `
  <div class="clausula">
    <p><span class="titulo-clausula">${siguiente()}: ${titulo}</span> ${cuerpo}</p>
  </div>`;

  const clausulaConParrafos = (titulo, parrafos) => `
  <div class="clausula">
    <p><span class="titulo-clausula">${siguiente()}: ${titulo}</span> ${parrafos[0]}</p>
    ${parrafos.slice(1).map((p) => `<p>${p}</p>`).join('\n    ')}
  </div>`;

  const cPrimera = clausula('Objeto.',
    `Por el presente contrato, el LOCADOR cede el uso del inmueble sito en ${property.address || 'N/A'}, de la ciudad de ${property.city || 'N/A'}, por lo que en contraprestación, EL LOCATARIO se obliga a pagar al LOCADOR en calidad de renta el monto referido en la cláusula CUARTA, en la forma y oportunidad convenidas.`);

  const cSegunda = clausula('Destino de la locación.',
    `Las partes convienen que el inmueble referido en la cláusula primera será destinado ${getDestinoLocacion(property.typeProperty)}. ${descripcionInmueble ? `El inmueble cuenta con ${descripcionInmueble}, ` : 'El inmueble cuenta con '}y todas las demás especificaciones contenidas en el inventario anexo al presente contrato de locación.`);

  const cTercera = clausula('Plazo del contrato.',
    `Las partes convienen fijar un plazo de duración determinada de ${numeroALetras(lease.totalMonths)} (${lease.totalMonths}) meses, que se computará a partir del ${formatearFecha(startDate)}, y hasta el día ${formatearFecha(endDate)}, recibiendo el LOCATARIO la tenencia del inmueble en la fecha indicada. Es obligación del LOCATARIO restituir al término de la locación el inmueble desocupado y en buen estado, conforme a lo establecido en el artículo 1210 del Código Civil y Comercial de la Nación. Si ello no fuere cumplido se cobrará una multa equivalente al 0,4 % diario sobre el último alquiler hasta la entrega efectiva del inmueble locado y en las condiciones en que le fue entregado.`);

  const cCuarta = clausulaConParrafos('Precio:', [
    `El precio del alquiler se fija de común acuerdo entre las partes por la suma mensual de ${formatearMonto(lease.rentAmount)} para el ${frecuencia.periodo} de locación. A partir del ${formatearFecha(primeraActualizacion)}, el canon se actualizará cada ${numeroALetras(frecuencia.meses)} (${frecuencia.meses}) meses conforme al Índice de Precios al Consumidor (IPC) que confecciona y publica el Instituto Nacional de Estadísticas y Censos (INDEC), correspondiente a los últimos ${numeroALetras(frecuencia.meses)} meses cuyos índices se encuentren oficialmente publicados a la fecha de cada actualización. Si por una disposición legal y futura, los alquileres se vieren gravados con el pago del impuesto al valor agregado (IVA), EL LOCATARIO deberá adicionar al monto mensual a pagar en concepto de canon locativo, el porcentual correspondiente al IVA.`,
    `El LOCATARIO abonará el canon locativo en forma mensual y anticipada, entre los días 1º y 10º de cada mes. El pago podrá realizarse en efectivo, en moneda de curso legal, en ${DOMICILIO_PAGO}, o en el domicilio que en un futuro designe el LOCADOR.`,
    `Por el presente acto el LOCADOR comunica al LOCATARIO que constituye a ${ADMINISTRADOR}, en adelante EL ADMINISTRADOR, como su representante, quedando este facultado para actuar en su nombre en cualquier cuestión que emane del presente, percibir los cánones locativos y extender los correspondientes recibos, también para conservar y archivar los comprobantes de pago de todos los impuestos y servicios a cargo del LOCATARIO, quien tendrá por constancia de pago el asiento de los mismos en los recibos de pago del alquiler. La falta de pago íntegro dentro del plazo establecido producirá mora automática, devengándose el interés pactado equivalente al 0,5 % diario contado a partir del primer día del mes en mora.`,
  ]);

  const cQuinta = clausula('Modificaciones:',
    `El LOCATARIO tiene expresamente prohibido efectuar mejoras o modificaciones que alteren la estructura del inmueble sin autorización previa y por escrito del LOCADOR. De autorizarse la realización de mejoras, estas quedan a beneficio del inmueble sin derecho para el LOCATARIO a ninguna indemnización, reembolso, compensación y/o retribución. Al finalizar la locación EL LOCATARIO deberá restituir el inmueble en el mismo estado de conservación en que lo recibió, salvo el desgaste normal producido por el uso adecuado y el transcurso del tiempo.`);

  const cSexta = clausulaConParrafos('Impuestos y Servicios:', [
    `El LOCATARIO tendrá a su cargo el pago de los servicios de energía eléctrica y agua correspondientes al período de ocupación, este último en caso de encontrarse facturado. Asimismo, tendrá a su cargo el alta del servicio de energía eléctrica a su nombre y los gastos administrativos y de conexión que la empresa prestataria exija para habilitar el suministro, debiendo solicitar su baja o transferencia al finalizar la locación.`,
    `EL LOCATARIO responderá por los consumos correspondientes al período de ocupación, aun cuando las facturas sean emitidas con posterioridad a la restitución del inmueble. Serán a cargo del LOCADOR los impuestos, tasas, cargas y contribuciones que graven el inmueble, sean municipales, provinciales o nacionales, así como cualquier sobretasa, derecho adicional o impuesto que pudiera crearse durante la vigencia del contrato y afectar al inmueble.`,
  ]);

  const cSeptima = clausulaConParrafos('Incumplimiento:', [
    `En cualquiera de los casos de incumplimiento del LOCATARIO, sin perjuicio de las penalidades que se establecen en las demás cláusulas, el LOCADOR podrá pedir el cumplimiento de este contrato o resolverlo por incumplimiento imputable al LOCATARIO, solicitando en su caso la restitución inmediata del inmueble. Para el supuesto de que el LOCATARIO no restituya el inmueble en la fecha correspondiente, deberá abonar al LOCADOR en concepto de cláusula penal una suma equivalente al canon locativo mensual vigente por cada mes transcurrido desde la fecha en que el LOCATARIO debió restituir el inmueble y hasta su efectiva restitución, sin perjuicio de la indemnización por los daños y perjuicios que pudieren corresponder.`,
    `En particular, la falta de pago íntegro del canon locativo dentro del plazo establecido en la cláusula CUARTA constituirá al LOCATARIO en mora y facultará al LOCADOR a resolver el contrato por incumplimiento, exigir la restitución del inmueble y reclamar las sumas adeudadas, intereses y demás conceptos que correspondan, previo cumplimiento de las intimaciones y demás requisitos legalmente exigibles.`,
    `En caso de abandono comprobado del inmueble por parte del LOCATARIO, y a fin de evitar su deterioro o la ocupación por terceros, el LOCADOR podrá ingresar al inmueble para resguardar la propiedad, labrándose el acta correspondiente con intervención de escribano público o autoridad competente.`,
    `Los bienes que se encontraren en el inmueble quedarán bajo depósito del LOCADOR por el plazo de tres (3) meses, contados desde la fecha de dicha diligencia, para su posterior retiro por el LOCATARIO.`,
    `Vencido dicho plazo sin que el LOCATARIO retire sus bienes, el LOCADOR podrá disponer de ellos conforme a derecho.`,
  ]);

  const cOctava = clausula('Irresponsabilidad:',
    `El LOCADOR no se responsabiliza por los daños que pudieran sufrir EL LOCATARIO, sus convivientes, visitantes, terceros o sus bienes, cuando sean consecuencia de hechos imputables al LOCATARIO, sus convivientes, visitantes o terceros, o de acontecimientos ajenos a la responsabilidad del LOCADOR. Lo establecido precedentemente se entiende sin perjuicio de las obligaciones y responsabilidades que legalmente correspondan al LOCADOR respecto del inmueble.`);

  const cNovena = clausulaConParrafos('Resolución Anticipada:', [
    `Las partes acuerdan las siguientes condiciones para la resolución anticipada del presente contrato:`,
    `a) Por parte del LOCATARIO: El LOCATARIO podrá resolver anticipadamente el presente contrato en cualquier momento, debiendo notificar fehacientemente al LOCADOR su decisión. En tal supuesto, deberá abonar al LOCADOR, en concepto de indemnización, el equivalente al diez por ciento (10%) del saldo del canon locativo futuro, calculado desde la fecha de notificación de la resolución hasta la fecha de finalización pactada del contrato, conforme a lo establecido por el artículo 1221 del Código Civil y Comercial de la Nación.`,
    `b) Por parte del LOCADOR: EL LOCADOR podrá resolver anticipadamente el contrato cuando requiera el inmueble para uso propio, notificando fehacientemente al LOCATARIO con una anticipación mínima de noventa (90) días.`,
  ]);

  const cDecima = clausula('Intransferibilidad:',
    `EL LOCATARIO no podrá subarrendar, permutar, prestar o ceder en todo o en parte el inmueble objeto de este acto, ni transferir los derechos del presente contrato, constituyendo su incumplimiento causal de rescisión del presente contrato.`);

  const cDecimaPrimera = clausula('Sanciones:',
    `El incumplimiento por parte del LOCATARIO de cualquiera de las obligaciones asumidas en el presente contrato facultará al LOCADOR a ejercer los derechos previstos en la cláusula SEPTIMA, sin perjuicio de reclamar las cláusulas penales y los daños y perjuicios que correspondan conforme a derecho.`);

  // --- Garantes (no están en el modelo; se mantienen del contrato anterior) ---
  let cGarantes = '';
  if (guarantors.length > 0) {
    const numGarantes = siguiente();
    cGarantes = guarantors.map((guarantor, index) => {
      const numero = `${numGarantes}${index > 0 ? ` (${index + 1})` : ''}`;

      if (guarantor.description === 'seguro') {
        return `
  <div class="clausula">
    <p><span class="titulo-clausula">${numero}: Fianza - Seguro de caución:</span> El LOCATARIO constituye como garantía Seguro de Caución, emitido por aseguradora habilitada por la SSN y aceptada por el LOCADOR, que garantiza el cumplimiento íntegro del presente contrato.</p>
    <p><strong>Aseguradora:</strong> ${guarantor.insuranceCompany || '________'}</p>
    <p><strong>N.º de póliza:</strong> ${guarantor.policyNumber || '________'}</p>
    <p><strong>Suma asegurada:</strong> ${guarantor.insuredAmount || '________'}</p>
    <p><strong>Vigencia:</strong> desde ${guarantor.insuranceStartDate ? formatearFecha(guarantor.insuranceStartDate) : '__ / __ / ____'} hasta ${formatearFecha(endDate)}, debiendo mantenerse vigente durante todo el plazo contractual y hasta la restitución efectiva del inmueble.</p>
    <p>La póliza deberá cubrir alquileres, expensas, servicios y daños, contar con endoso a favor del LOCADOR y no podrá cancelarse sin su consentimiento, bajo apercibimiento de incumplimiento grave.</p>
  </div>`;
      }

      return `
  <div class="clausula">
    <p><span class="titulo-clausula">${numero}: Fianza. Garante:</span> El Sr/Sra ${guarantor.name}, que acredita su identidad con CUIL ${guarantor.cuil}, nacionalidad Argentina, con domicilio en ${guarantor.address}, teléfono ${guarantor.mobilePhone || 'N/A'}, correo electrónico: ${guarantor.email || 'N/A'}, quien manifiesta no tener capacidad restringida para este acto, a estos efectos exhibe el recibo de sueldo del Gobierno de la provincia de Catamarca, el que acredita ${guarantor.description}. Quien se constituye a los efectos de este contrato en Fiador/a solidario/a, liso, llano y principal pagador/a de los alquileres, impuestos, servicios adeudados por el LOCATARIO. La parte Fiadora renuncia a los beneficios de división y excusión y declara expresamente que, si al vencimiento del contrato el Locatario permaneciese en el uso y goce del bien locado, su responsabilidad y fianza continuarán en vigencia hasta el momento en que el Locatario entregue en devolución a la Locadora la propiedad libre de ocupantes y en las demás condiciones establecidas en este contrato. Comprometiéndose en este acto que si por alguna circunstancia propia o ajena, cambiara de empleador o bien de domicilio laboral, lo comunicará inmediatamente al Locador, o sus representantes, mediante notificación fehaciente. Es además obligación del Fiador, vigilar que el Locatario cumpla con todas y cada una de las obligaciones contraídas en este Contrato de Locación. Asimismo se avienen al pago de los alquileres adeudados por el Locatario, con la sola presentación de los recibos de alquileres respectivos. REEMPLAZO DE LOS GARANTES: En caso de falencia, insolvencia, fallecimiento, desaparición y responsabilidad manifiesta, etc. del o de los fiadores, el LOCADOR podrá requerir un nuevo garante fiador, en término de cinco (5) días corridos, cuya solvencia no podrá ser inferior a la anterior, quedando ésta, a juicio y satisfacción de la locadora. En caso de incumplimiento de esta obligación por parte del LOCATARIO, quedará resuelto el contrato, como si el convenio fuese a término vencido. Es obligación del LOCATARIO dar aviso al LOCADOR en caso de presentarse alguna de las mencionadas circunstancias.</p>
  </div>`;
    }).join('');
  }

  const cAdicionales = (clausulasAdicionales || []).map((c) => clausula(c.titulo, c.contenido)).join('');

  const cRenovacion = clausula('Renovación:',
    `Este contrato no puede ser prorrogado total o parcialmente ni renovado por idéntico período sin previo acuerdo escrito de las partes acerca de las nuevas condiciones del arrendamiento, especialmente sobre el precio del alquiler.`);

  const cEstado = clausula('Estado del Bien Locado:',
    `A los efectos de la restitución del inmueble, una vez vencido el término contractual, se aclara que el LOCATARIO deberá proceder de la siguiente manera: 1) El inmueble deberá restituirse en el mismo buen estado de conservación e higiene en que fue entregado y según consta en el inventario. El LOCATARIO no podrá eludir esta obligación contraída en el presente. La recepción del inmueble y de las llaves por parte del LOCADOR no implicará conformidad ni renuncia al derecho de reclamar los daños, desperfectos, servicios, impuestos u otras obligaciones pendientes a cargo del LOCATARIO.`);

  const inventario = `
  <div class="clausula">
    <p class="titulo-clausula">INVENTARIO:</p>
    <div class="inventario">${lease.inventory ? lease.inventory.replace(/\\n/g, '<br>').replace(/\n/g, '<br>') : 'Sin inventario especificado'}</div>
  </div>`;

  const cCompetencia = clausula('COMPETENCIA - Domicilios - Jurisdicción y Competencia:',
    `Las partes constituyen como domicilios especiales los indicados en el presente contrato, donde serán válidas todas las notificaciones que se cursen con motivo de la presente locación. Asimismo, renuncian al fuero federal o a cualquier otro que pudiera corresponder y se someten, para cualquier cuestión derivada del presente contrato, a la jurisdicción de los Tribunales ordinarios con asiento en la ciudad de ${CIUDAD_FIRMA}, Provincia de ${PROVINCIA_FIRMA}.`);

  const cFirma = clausula('FIRMA Y EJEMPLARES:',
    `Se pacta expresamente que el impuesto de sello provincial será abonado íntegramente por el LOCATARIO. Leído, las partes declaran su conformidad y firman tres (3) ejemplares de un mismo tenor y a un solo efecto, en la Ciudad de ${CIUDAD_FIRMA}, Provincia de ${PROVINCIA_FIRMA}, a los ${startDate.getDate()} días del mes de ${meses[startDate.getMonth()]} de ${startDate.getFullYear()}.`);

  // Generar HTML
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrato de Locación #${lease.id}</title>
  <style>
    @page { size: A4; margin: 20mm 25mm; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.5;
      max-width: 210mm;
      margin: 0 auto;
      font-size: 11pt;
      color: #000;
    }
    h1 { text-align: center; font-size: 14pt; font-weight: bold; margin: 0 0 20px 0; }
    p { text-align: justify; margin: 8px 0; line-height: 1.5; }
    .clausula { margin: 12px 0; }
    .titulo-clausula { font-weight: bold; }
    .inventario { white-space: pre-wrap; margin: 8px 0; text-align: left; }
    .firmas { margin-top: 60px; display: flex; justify-content: space-around; }
    .firma { text-align: center; padding-top: 8px; border-top: 1px solid #000; width: 220px; }
  </style>
</head>
<body>
  <h1>${getTituloContrato(property.typeProperty)}</h1>

  <p>
    ${property.socio 
      ? `Entre el Sr/Sra. <strong>${landlord.name || 'N/A'}</strong>, CUIL ${landlord.cuil || 'N/A'}, con domicilio en ${landlord.direccion || 'N/A'}, de la ciudad de ${landlord.ciudad || 'N/A'}, correo electrónico ${landlord.email || 'N/A'}, teléfono ${landlord.mobilePhone || 'N/A'}, en carácter de propietario junto con ${property.socio}, en adelante denominados "LOS LOCADORES", por una parte, y por la otra el Sr/Sra <strong>${tenant.name || 'N/A'}</strong>, CUIL ${tenant.cuil || 'N/A'}, con domicilio en ${tenant.direccion || 'N/A'}, ${tenant.ciudad || 'N/A'}, ${tenant.provincia || 'N/A'}, correo electrónico ${tenant.email || 'N/A'}, teléfono ${tenant.mobilePhone || 'N/A'}, en adelante denominado "EL LOCATARIO"`
      : `Entre el Sr/Sra. <strong>${landlord.name || 'N/A'}</strong>, CUIL ${landlord.cuil || 'N/A'}, con domicilio en ${landlord.direccion || 'N/A'}, de la ciudad de ${landlord.ciudad || 'N/A'}, en adelante denominado "EL LOCADOR", por una parte, y por la otra el Sr/Sra <strong>${tenant.name || 'N/A'}</strong>, CUIL ${tenant.cuil || 'N/A'}, con domicilio en ${tenant.direccion || 'N/A'}, ${tenant.ciudad || 'N/A'}, ${tenant.provincia || 'N/A'}, en adelante denominado "EL LOCATARIO"`
    }, convienen en celebrar el presente contrato de locación, sujeto a las siguientes cláusulas y condiciones:
  </p>
${cPrimera}${cSegunda}${cTercera}${cCuarta}${cQuinta}${cSexta}${cSeptima}${cOctava}${cNovena}${cDecima}${cDecimaPrimera}${cGarantes}${cAdicionales}${cRenovacion}${cEstado}${inventario}${cCompetencia}${cFirma}

  <div class="firmas">
    <div class="firma">Firma del LOCADOR</div>
    <div class="firma">Firma del LOCATARIO</div>
  </div>
</body>
</html>
  `;

  return html;
};
