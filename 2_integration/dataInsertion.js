// now we need to insert the data

const fs = require('fs');
const csv = require('csv-parser');
const { Client } = require('pg');

const pathFuelCSV = '../0_datasets/Fuel.csv';
const pathLocationCSV = '../0_datasets/locationFilter.csv';
const pathDCConsumption = '../0_datasets/dataCenterEnergyConsumptionCSV.csv';
const pathSolarProduction = '../0_datasets/solarFarmProduction.csv';
const pathEnergyConsumption = '../0_datasets/EnergyConsumption.csv';
const pathEnergyProduction = '../0_datasets/energyProductionID.csv';


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


async function insertLocationData(filePath) {
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
    const insertQuery = `INSERT INTO location (${headers.join(', ')}) VALUES ${objects.map(obj => `(${Object.values(obj).map(value => `'${value}'`).join(', ')})`).join(', ')};`;
    await client.query(insertQuery);
    console.log('Data inserted successfully into the Location table.');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await client.end();
  }
  
}


async function insertDataIntoDataCenterEnergyConsumption(){

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DataIntegration',
    password: 'postgres',
    port: 5432, // Default PostgreSQL port
});

  await client.connect();

fs.createReadStream(pathDCConsumption)
  .pipe(csv({ separator: ';' })) 
  .on('data', (row) => {
    //Process each row of the CSV file
    const {
      id,
      Name,
      AmmountConsumedPerYear_kWh,
      Size_mxm,
      GeoCoordinates,
      StateCode,
    } = row;

    //Insert the data into the database
    const query = `
      INSERT INTO dataCenterEnergyConsumption (
        id,
        Name,
        AmmountConsumedPerYear_kWh,
        Size_mxm,
        GeoCoordinates,
        StateCode,
        LocationID
      )
      VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM location WHERE Code = $7))
    `;
    const values = [
      id,
      Name,
      AmmountConsumedPerYear_kWh,
      Size_mxm,
      GeoCoordinates,
      StateCode,
      StateCode,
    ];

    client.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
      } else {
        console.log('Data inserted successfully');
      }
    });
  })
  .on('end', () => {
    console.log('CSV file processed');
  });

}

async function insertIntoSolarProduction(){

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DataIntegration',
    password: 'postgres',
    port: 5432, // Default PostgreSQL port
});

  await client.connect();

fs.createReadStream(pathSolarProduction)
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    //Process each row of the CSV file
    const {
      id,
      Name,
      State,
      Capacity_MW,
      AnnualGeneration_GWh,
      Type,
      Coordinates,
      StateCode
    } = row;

    // Insert the data into the database
    const query = `
      INSERT INTO solarfarmproduction (
        id,
        Name,
        State,
        Capacity_MW,
        AnnualGeneration_GWh,
        Type,
        Coordinates,
        StateCode,
        LocationID
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (SELECT id FROM location WHERE Code = $9))`;
    const values = [
      id,
      Name,
      State,
      Capacity_MW,
      AnnualGeneration_GWh,
      Type,
      Coordinates,
      StateCode,
      StateCode, 
    ];

    client.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
      } else {
        console.log('Data inserted successfully');
      }
    });
  })
  .on('end', () => {
    console.log('CSV file processed');
  });

}

async function insertIntoEnergyConsumption() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DataIntegration',
    password: 'postgres',
    port: 5432, // Default PostgreSQL port
  });

  await client.connect();

  fs.createReadStream(pathEnergyConsumption)
    .pipe(csv({ separator: ';' })) 
    .on('data', (row) => {
      //Process each row of the CSV file
      const { id, State, Code, FuelType, Consumption } = row;
      //Insert the data into the database
      const query = `
        INSERT INTO energyconsumption (
          id,
          State,
          Code,
          FuelType,
          Consumption,
          FuelID,
          LocationID
        )
        VALUES ($1, $2, $3, $4, $5,
          (SELECT id FROM fuel WHERE Fuel = $6),
          (SELECT id FROM location WHERE Code = $7)
          )`;

      const values = [
        id,
        State,
        Code,
        FuelType,
        Consumption,
        FuelType,
        Code
      ];

      client.query(query, values, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
        } else {
          console.log('Data inserted successfully');
        }
      });
    })
    .on('end', () => {
      console.log('CSV file processed');
    });
}





async function insertIntoEnergyProduction() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DataIntegration',
    password: 'postgres',
    port: 5432, // Default PostgreSQL port
  });

  await client.connect();
  fs.createReadStream(pathEnergyProduction)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
      //Process each row of the CSV file
      const { id, State, EnergySource, Generation_MWH } = row;
      //Insert the data into the database
      const query = `
        INSERT INTO energyProduction (
          id,
          State,
          EnergySource,
          Generation_MWH,
          FuelID,
          LocationID
        )
        VALUES ($1, $2, $3, $4,
          (SELECT id FROM fuel WHERE Fuel = $5),
          (SELECT id FROM location WHERE Code = $6)
          )`;

      const values = [
        id,
        State,
        EnergySource,
        Generation_MWH,
        EnergySource,
        State
      ];

      client.query(query, values, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
        } else {
          console.log('Data inserted successfully');
          
        }
      });
    })
    .on('end', () => {
      console.log('CSV file processed');
    });
}
insertFuelData(pathFuelCSV);
insertLocationData(pathLocationCSV);

insertDataIntoDataCenterEnergyConsumption();
insertIntoSolarProduction();

insertIntoEnergyConsumption();
insertIntoEnergyProduction();
