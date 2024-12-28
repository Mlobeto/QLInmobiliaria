const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Show',
    {
       idShow: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }, 
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      direccion: {
        type: DataTypes.STRING,
        allowNull: true,
      },  
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },    
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },   
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false,
      },
      src: {
        type: DataTypes.STRING,
        allowNull: false, 
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
