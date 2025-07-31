const fs = require('fs');
const path = require('path');
const { conn, Property, Client } = require('../data'); // Importa 'conn' en vez de 'sequelize'

async function seed() {
  try {
    await conn.sync();

    // Insertar propiedades
    const propertiesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'properties.json'), 'utf8')
    );
    for (const prop of propertiesData) {
      await Property.create(prop);
    }
    console.log('Propiedades insertadas.');

    // Insertar clientes
    const clientsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'clients.json'), 'utf8')
    );
    for (const client of clientsData) {
      await Client.create(client);
    }
    console.log('Clientes insertados.');

    // No hagas process.exit() si lo usas como parte del server
  } catch (error) {
    console.error('Error al insertar datos:', error);
  }
}

module.exports = seed;