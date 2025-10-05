const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

async function testImport() {
  console.log('🚀 Probando importación de clientes...\n');

  const form = new FormData();
  const filePath = path.join(__dirname, 'clientes_a_importar.csv');
  
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://localhost:3001/api/import/clients', form, {
      headers: form.getHeaders()
    });

    console.log('✅ Resultado de la importación:\n');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.results) {
      console.log('\n📊 Resumen:');
      console.log(`Total: ${response.data.results.summary.total}`);
      console.log(`Procesados: ${response.data.results.summary.processed}`);
      console.log(`Fallidos: ${response.data.results.summary.failed}`);

      if (response.data.results.errors.length > 0) {
        console.log('\n❌ Errores encontrados:');
        response.data.results.errors.forEach(error => {
          console.log(`  Fila ${error.row}: ${error.errors.join(', ')}`);
        });
      }

      if (response.data.results.success.length > 0) {
        console.log('\n✅ Clientes importados exitosamente:');
        response.data.results.success.forEach(success => {
          console.log(`  ${success.client.name} (${success.client.cuil})`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testImport();
