const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Property",
    {
      propertyId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      neighborhood: {
        type: DataTypes.STRING,
      },
      socio:{
      type: DataTypes.STRING,
      allowNull: true,
    },
      
      city: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM("venta", "alquiler"),
        allowNull: false,
      },
      typeProperty: {
        type: DataTypes.ENUM(
          "casa",
          "departamento",
          "duplex",
          "finca",
          "local",
          "oficina",
          "lote",
          "terreno"
        ),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: 0, // Precio no puede ser negativo
        },
      },
      precioReferencia: {
        type: DataTypes.DECIMAL,
        allowNull: true, // No es requerido
        validate: {
          min: 0, // Precio de referencia no puede ser negativo
        },
      },
      rooms: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0, // Número mínimo de habitaciones
        },
      },

      comision: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: 0, // No puede ser menor al 0%
          max: 100, // No puede ser mayor al 100%
        },
      },

      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Por defecto, la propiedad está disponible
      },

      description: {
        type: DataTypes.TEXT,
      },
      escritura: {
        type: DataTypes.ENUM(
          "prescripcion en tramite",
          "escritura",
          "prescripcion adjudicada",
          "posesion",
          "sesión de derechos posesorios",
          "escritura en tramite"
        ),
        allowNull: false,
      },

      matriculaOPadron: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      // Campos específicos para lotes
      frente: {
        type: DataTypes.STRING,
        allowNull: true, // Solo aplicable para lotes
      },
      
      profundidad: {
        type: DataTypes.STRING,
        allowNull: true, // Solo aplicable para lotes
      },

      // Link de Instagram para todas las propiedades
      linkInstagram: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          customValidator(value) {
            // Solo validar si el valor no está vacío
            if (value && value.trim() !== '') {
              // Validar que sea una URL válida
              const urlPattern = /^https?:\/\/.+/i;
              if (!urlPattern.test(value)) {
                throw new Error('Debe ser una URL válida');
              }
            }
          }
        },
      },

      // Link de Google Maps para todas las propiedades
      linkMaps: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          customValidator(value) {
            // Solo validar si el valor no está vacío
            if (value && value.trim() !== '') {
              // Validar que sea una URL válida
              const urlPattern = /^https?:\/\/.+/i;
              if (!urlPattern.test(value)) {
                throw new Error('Debe ser una URL válida de Google Maps');
              }
            }
          }
        },
      },

      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
      },
      plantType: {
        type: DataTypes.STRING,
        allowNull: true, // Solo aplicable para fincas
      },
      plantQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true, // Solo aplicable para fincas
        validate: {
          min: 0, // No puede ser negativo
        },
      },
      bathrooms: {
        type: DataTypes.INTEGER,
      },
      highlights: {
        type: DataTypes.TEXT,
      },
      inventory:{
        type: DataTypes.TEXT,
        allowNull: true,
      },
      superficieCubierta:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      
      superficieTotal:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      
      requisito: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: `REQUISITOS PARA ALQUILAR Propiedad con domicilio en: {address}

1. Fotocopia D.N.I./ CUIL/CUIT, solicitante/s y garante/s, domicilio y teléfono de los mismos, sino es del dominio del documento electrónico.

2. Fotocopia de los últimos tres recibos de sueldo, y certificado de trabajo, si es autónomo justificación de ingresos, esta puede hacer por un Contador y debe pasar por el Colegio Profesional de Ciencias Económicas, para ser certificada.

3. ⦁	Tipos de garantías: Cantidad 2 –con recibo de sueldo-
⦁	Garantía de caución o/
⦁	Recibo de sueldo no inferior al tercio del monto del alquiler


Garante:

DNI:
Domicilio:
Correo electrónico:

4. Los garantes firman el contrato ante escribano para que les certifique la firma, y cuando firme ante escribano deberá ser legalizado por el colegio de Escribanos.

5. Monto del alquiler mensual: 1º Cuatrimestre {price} - Para los cuatrimestres siguientes de locación el precio será actualizado conforme el índice de precio al consumidor (IPC) que confecciona y publica el Instituto Nacional de Estadísticas y Censos (INDEC).

6. Honorarios de contratos ante escribano y favor de firma inmobiliaria: Igual al monto del alquiler

7. Período de locación: 2 años

8. Certificado de firma ante escribano público.

9. Sellado en rentas provincial

10. No se pide mes de depósito.

`,
      },
      
      whatsappTemplate: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: `{descripcion}

Precio: AR$ {precio}
Ubicación: {direccion}

{destacados}

📍 Ver ubicación: {linkMaps}

📸 Ver más fotos: {linkInstagram}

Estamos a tu entera disposición por dudas, precio o consultas.`,
      },
      
      
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );
};
