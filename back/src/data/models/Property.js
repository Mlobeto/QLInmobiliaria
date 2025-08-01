const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
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
          min: 0,
        },
      },
      rooms: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
        },
      },
      comision: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      description: {
        type: DataTypes.TEXT,
      },
      escritura: {
        type: DataTypes.ENUM(
          "prescripcion en tramite",
          "escritura",
          "prescripcion adjudicada",
          "posesion"
        ),
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: true,
      },
      plantType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      plantQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
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
    },
    {
      tableName: "Properties", // ← AGREGAR ESTA LÍNEA
      paranoid: true,
    }
  );
};