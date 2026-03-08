// Banco de cláusulas predefinidas para contratos de locación

// Cláusulas específicas para LOCAL COMERCIAL
export const clausulasLocalComercial = {
  habilitaciones: {
    titulo: "Habilitaciones Comerciales",
    contenido: `El LOCATARIO declara que destinará el inmueble a actividad comercial lícita y se obliga a tramitar por su cuenta y cargo todas las habilitaciones comerciales, permisos municipales, inscripciones impositivas y cualquier otro requisito necesario para el desarrollo de su actividad. El incumplimiento de esta obligación facultará al LOCADOR a rescindir el contrato sin derecho a indemnización alguna para el LOCATARIO.`
  },
  actividad: {
    titulo: "Actividad Específica",
    contenido: `El LOCATARIO destinará el local exclusivamente para [ESPECIFICAR ACTIVIDAD COMERCIAL], no pudiendo cambiar el rubro sin previo consentimiento por escerto del LOCADOR. Queda expresamente prohibido el desarrollo de actividades que generen ruidos molestos, olores, vibraciones o cualquier molestia a vecinos o copropietarios.`
  },
  horario: {
    titulo: "Horario de Atención",
    contenido: `El LOCATARIO podrá atender al público en el horario permitido por las ordenanzas municipales vigentes, comprometiéndose a respetar los horarios de descanso y las disposiciones sobre contaminación sonora. En caso de realizar obras o reformas, deberá ajustarse estrictamente a los horarios autorizados por el municipio.`
  },
  reformas: {
    titulo: "Reformas y Adaptaciones",
    contenido: `El LOCATARIO podrá realizar las reformas necesarias para adaptar el local a su actividad comercial, previa presentación de planos y autorización escrita del LOCADOR. Todas las mejoras quedarán en beneficio del inmueble sin derecho a indemnización. Las instalaciones eléctricas, sanitarias o de gas deberán cumplir con las normativas vigentes y ser ejecutadas por profesionales matriculados.`
  },
  carteleria: {
    titulo: "Cartelería y Publicidad",
    contenido: `El LOCATARIO podrá colocar carteles y elementos publicitarios relacionados con su actividad comercial, respetando las ordenanzas municipales sobre publicidad y estética urbana. Los carteles no podrán dañar la fachada del inmueble y deberán ser retirados al finalizar el contrato, reparando cualquier daño ocasionado.`
  },
  expensas: {
    titulo: "Expensas y Servicios Comerciales",
    contenido: `El LOCATARIO se hace cargo del pago de todas las expensas ordinarias y extraordinarias, impuestos municipales, tasas de comercio e industria, servicios de luz, gas, agua, teléfono, internet y cualquier otro servicio que consuma. Asimismo, abonará los gastos de limpieza, vigilancia y mantenimiento de espacios comunes si los hubiere.`
  },
  transferencia: {
    titulo: "Transferencia de Fondo de Comercio",
    contenido: `El LOCATARIO no podrá ceder el contrato ni transferir el fondo de comercio sin previo consentimiento por escrito del LOCADOR. En caso de autorización, el LOCADOR percibirá una compensación equivalente a [MESES] meses de alquiler, y el nuevo locatario deberá cumplir con todos los requisitos de garantías establecidos en el presente contrato.`
  },
  seguros: {
    titulo: "Seguros Obligatorios",
    contenido: `El LOCATARIO se obliga a contratar y mantener vigente durante todo el plazo contractual un seguro de responsabilidad civil que cubra daños a terceros con un monto mínimo de cobertura de [MONTO]. Asimismo, deberá contratar seguro contra incendio sobre el contenido del local. Las pólizas deberán ser presentadas al LOCADOR dentro de los 30 días de firmado el contrato.`
  },
  residuos: {
    titulo: "Disposición de Residuos",
    contenido: `El LOCATARIO se compromete a realizar la correcta disposición de los residuos generados por su actividad comercial, cumpliendo con las ordenanzas municipales sobre recolección de residuos, reciclaje y tratamiento de desechos especiales si correspondiere. Los gastos de recolección diferenciada correrán por su cuenta.`
  }
};

// Cláusulas específicas para VIVIENDA
export const clausulasVivienda = {
  destinoHabitacional: {
    titulo: "Destino Habitacional Exclusivo",
    contenido: `El inmueble se destina exclusivamente para vivienda familiar del LOCATARIO, quedando prohibido el desarrollo de cualquier actividad comercial, profesional o industrial. El LOCATARIO no podrá subarrendar total o parcialmente el inmueble ni ceder su uso a terceros sin autorización expresa y por escrito del LOCADOR.`
  },
  convivientes: {
    titulo: "Convivencia y Ocupantes",
    contenido: `El LOCATARIO declara que habitarán el inmueble [NÚMERO] personas. En caso de modificarse la cantidad de ocupantes, deberá notificar fehacientemente al LOCADOR. El ingreso de nuevos ocupantes estables requerirá autorización previa del LOCADOR.`
  },
  mascotas: {
    titulo: "Tenencia de Mascotas",
    contenido: `[OPCIÓN 1 - PERMITIDAS] Se autoriza la tenencia de mascotas domésticas de tamaño pequeño/mediano, debiendo el LOCATARIO responsabilizarse por cualquier daño que éstas ocasionen al inmueble y cumplir con las normas de convivencia del edificio/barrio.
[OPCIÓN 2 - NO PERMITIDAS] Queda expresamente prohibida la tenencia de animales de cualquier tipo en el inmueble locado.`
  },
  reglamento: {
    titulo: "Reglamento de Copropiedad",
    contenido: `El LOCATARIO se obliga a cumplir estrictamente con el reglamento de copropiedad y convivencia del edificio [si aplica], respetando los horarios de silencio, el uso de espacios comunes, las normas sobre mudanzas y cualquier otra disposición establecida por el consorcio de propietarios.`
  },
  reformasVivienda: {
    titulo: "Modificaciones al Inmueble", 
    contenido: `El LOCATARIO no podrá realizar obras, reformas o modificaciones que alteren la estructura, distribución o instalaciones del inmueble sin autorización previa y por escrito del LOCADOR. Las mejoras autorizadas quedarán en beneficio del inmueble sin derecho a compensación. Está permitida la realización de mejoras menores como pintura, empapelado o cambio de artefactos sanitarios previa notificación.`
  },
  expensasVivienda: {
    titulo: "Expensas Ordinarias",
    contenido: `El LOCATARIO abonará mensualmente las expensas ordinarias del edificio [si aplica] junto con el alquiler. Las expensas extraordinarias por mejoras o reparaciones mayores serán abonadas por el LOCADOR, salvo que sean consecuencia del uso indebido o negligencia del LOCATARIO. Los servicios de luz, gas, agua, internet y teléfono serán contratados y abonados directamente por el LOCATARIO.`
  },
  mantenimiento: {
    titulo: "Conservación y Mantenimiento",
    contenido: `El LOCATARIO se obliga a mantener el inmueble en buen estado de conservación, higiene y habitabilidad, realizando por su cuenta las reparaciones menores que surjan del uso normal (canillas, picaportes, vidrios, cerraduras, pintura, etc.). Las reparaciones estructurales, de instalaciones principales o por vicios ocultos corresponden al LOCADOR.`
  },
  desocupacion: {
    titulo: "Desocupación y Entrega",
    contenido: `Al finalizar el contrato, el LOCATARIO se obliga a entregar el inmueble totalmente desocupado, en buen estado de conservación y limpieza, tal como lo recibió según consta en el acta de entrega. Deberá presentar las constancias de deuda cero de servicios (luz, gas, agua, internet) y expensas. El incumplimiento facultará al LOCADOR a retener los montos correspondientes de la garantía.`
  }
};

// Cláusulas comunes adicionales (opcionales)
export const clausulasOpcionales = {
  anticipoAlquiler: {
    titulo: "Anticipo de Alquileres",
    contenido: `En concepto de adelanto, el LOCATARIO abona al momento de la firma del presente contrato la suma de [MONTO] correspondiente a [CANTIDAD] meses de alquiler, los cuales serán imputados a [ESPECIFICAR MESES].`
  },
  garantiaExtendida: {
    titulo: "Garantía Extendida",
    contenido: `Además de la garantía estipulada en este contrato, el LOCATARIO constituye una garantía adicional mediante [ESPECIFICAR: depósito/título/seguro] por un monto de [MONTO], la cual será devuelta al finalizar el contrato previa verificación del estado del inmueble y pago de todas las obligaciones.`
  },
  clausulaPenal: {
    titulo: "Cláusula Penal por Incumplimiento",
    contenido: `En caso de incumplimiento de cualquiera de las obligaciones establecidas en este contrato, la parte incumplidora abonará a la otra una multa equivalente a [CANTIDAD] meses de alquiler, sin perjuicio del derecho a reclamar los daños y perjuicios que correspondan.`
  },
  servicios: {
    titulo: "Servicios Especiales Incluidos",
    contenido: `El precio del alquiler incluye los siguientes servicios: [ESPECIFICAR: internet, cable, gas, expensas, etc.]. Estos servicios serán contratados y abonados por el LOCADOR, quien garantiza su normal prestación durante la vigencia del contrato.`
  },
  renovacionAutomatica: {
    titulo: "Opción de Renovación Automática",
    contenido: `Las partes acuerdan que, salvo notificación fehaciente en contrario con [DÍAS] días de anticipación al vencimiento, el presente contrato se renovará automáticamente por un período de [MESES] meses bajo las mismas condiciones, con actualización del precio según [ESPECIFICAR ÍNDICE/PORCENTAJE].`
  },
  opcionCompra: {
    titulo: "Opción de Compra",
    contenido: `El LOCADOR otorga al LOCATARIO una opción de compra sobre el inmueble locado, la cual podrá ejercerse hasta [FECHA/PLAZO]. El precio de venta será de [MONTO] y se descontará el [PORCENTAJE]% de los alquileres abonados. Esta opción caduca automáticamente si no se ejerce en el plazo establecido o si el LOCATARIO incurre en incumplimientos.`
  },
  mediacion: {
    titulo: "Mediación Previa Obligatoria",
    contenido: `Las partes acuerdan que, ante cualquier controversia que surja de la interpretación o ejecución del presente contrato, someterán la disputa a un proceso de mediación previa y obligatoria, designando de común acuerdo un mediador matriculado. Solo en caso de fracasar la mediación podrán recurrir a la vía judicial.`
  },
  cochera: {
    titulo: "Cochera o Estacionamiento Incluido",
    contenido: `Se incluye en la locación el uso de [NÚMERO] cochera(s)/espacio(s) de estacionamiento identificado(s) con el número [NÚMERO], en carácter de [fija/rotativa]. El LOCATARIO se compromete a utilizar el espacio únicamente para estacionar vehículos y no obstruir los accesos comunes.`
  }
};

// Función para obtener cláusulas según tipo de propiedad
export const obtenerClausulasSegunTipo = (tipoPropiedad) => {
  const tiposComerciales = ['local', 'oficina'];
  const tiposVivienda = ['casa', 'departamento', 'duplex'];

  if (tiposComerciales.includes(tipoPropiedad?.toLowerCase())) {
    return {
      tipo: 'comercial',
      clausulas: clausulasLocalComercial,
      descripcion: 'Cláusulas para Local Comercial u Oficina'
    };
  } else if (tiposVivienda.includes(tipoPropiedad?.toLowerCase())) {
    return {
      tipo: 'vivienda',
      clausulas: clausulasVivienda,
      descripcion: 'Cláusulas para Vivienda'
    };
  }

  return {
    tipo: 'general',
    clausulas: {},
    descripcion: 'Contrato General'
  };
};
