const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Contacto',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },   
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isSuscripto:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
      },
      message: {
        type: DataTypes.TEXT, 
        allowNull: true,
      },
     
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
   

    },
    {
      paranoid: true,
    }
  );
};
