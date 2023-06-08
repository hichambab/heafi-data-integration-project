// now we need to insert the data

const fs = require('fs');
const csv = require('csv-parser');
const { Client } = require('pg');

const path = '../0_datasets/Fuel.csv';


function parseCSV(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const headers = lines[0].split(';').map(header => header.trim().replace('\r', ''));
  const objects = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';').map(value => value.trim().replace('\r', ''));
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }

    objects.push(obj);
  }

  return objects;
}


const objectsList = parseCSV(path);
console.log(objectsList);



async function insertFuelData(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const headers = lines[0].split(';').map(header => header.trim().replace('\r', ''));
  const objects = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';').map(value => value.trim().replace('\r', ''));
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }

    objects.push(obj);
  }

  
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DataIntegration',
    password: 'postgres',
    port: 5432, // Default PostgreSQL port
});

  await client.connect();

  try {
    const insertQuery = `INSERT INTO fuel (${headers.join(', ')}) VALUES ${objects.map(obj => `(${Object.values(obj).map(value => `'${value}'`).join(', ')})`).join(', ')};`;
    await client.query(insertQuery);
    console.log('Data inserted successfully into the Fuel table.');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await client.end();
  }
}

insertFuelData(path);
