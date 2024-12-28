const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  sequelize.define('Fotos', {
    src: {
        type: DataTypes.STRING,
        allowNull: false, // URL de la imagen en Cloudinary
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false, // Título del destino
      },
    
  },{timestamps:false});
};