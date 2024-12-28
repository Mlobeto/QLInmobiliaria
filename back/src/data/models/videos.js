const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('Videos', {
    src: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      description: {
        type: DataTypes.TEXT, 
        allowNull: true,
      },
      artista:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
      },
      category: {
        type: DataTypes.ENUM,
        values: ['Producción Musical', 'Dirección Musical'],
        allowNull: false,
      },
  },{timestamps:false});
};