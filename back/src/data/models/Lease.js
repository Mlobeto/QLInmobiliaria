const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Lease",
    {
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      rentAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      updateFrequency: {
        type: DataTypes.ENUM("semestral", "cuatrimestral", "anual"),
      },
      commission: {
        type: DataTypes.DECIMAL,
        validate: {
          min: 0,
          max: 100, // Comisión como porcentaje
        },
      },
      totalMonths: {
        type: DataTypes.INTEGER,
        allowNull: false, // Por ejemplo, 36 para 3 años
        validate: {
          min: 1, // Duración mínima: 1 mes
        },
      },
      inventory: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      landlordId: {
        // Propietario de la propiedad
        type: DataTypes.INTEGER,
        references: {
          model: 'Clients',
          key: 'idClient',
        },
        allowNull: false,
      },
      tenantId: {
        // Inquilino
        type: DataTypes.INTEGER,
        references: {
          model: 'Client',
          key: 'idClient',
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "terminated"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      paranoid: true,
    }
  );
};
