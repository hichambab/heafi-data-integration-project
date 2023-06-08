const { Client } = require('pg');

//first do npm install to install all neccecary packages
//make sure node js is installed
//create postgres database with username postgres and password postgres
//database name is DataIntegration
//run code with node index.js
//connection to database should be open if everything is correct

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'DataIntegration',
  password: 'postgres',
  port: 5432, // Default PostgreSQL port
});

client.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
    } else {
      console.log('Connected to the database');
    }
  });


  //this part creates tables
  client.query(`
  CREATE TABLE IF NOT EXISTS fuel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
  );


  CREATE TABLE IF NOT EXISTS location (
    id SERIAL PRIMARY KEY,
    LocationName VARCHAR(100),
    Coordinates VARCHAR(100), 
    Radiation_kWH NUMERIC(5,5),
    AvgTemperature_celsius NUMERIC(5,5),
    HoursOfSun NUMERIC(5,5),
    Code VARCHAR(100)
  );

  CREATE TABLE IF NOT EXISTS energyProduction (
    id SERIAL PRIMARY KEY,
    State VARCHAR(100),
    EnergySource VARCHAR(100), 
    Generation_kWH NUMERIC(10,5)
  );

  CREATE TABLE IF NOT EXISTS solarFarmProduction (
    id SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    State VARCHAR(100),
    Capacity_MW NUMERIC(10,5),
    AnnualGeneration_GWh NUMERIC(10,5),
    Type VARCHAR(100),
    Location VARCHAR(100)
  );

  CREATE TABLE IF NOT EXISTS dataCenterEnergyConsumption (
    id SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    AmmountConsumedPerYear_kWh NUMERIC(10,5),
    Size_GWh NUMERIC(10,5),
    GeoCoordinates VARCHAR(100)
  );

  CREATE TABLE IF NOT EXISTS energyConsumption (
    id SERIAL PRIMARY KEY,
    State VARCHAR(100),
    Code VARCHAR(100),
    Coal NUMERIC(10,5),
    NaturalGas NUMERIC(10,5),
    Petroleum NUMERIC(10,5),
    Nuclear NUMERIC(10,5),
    HydroelectricConventional NUMERIC(10,5),
    OtherBiomass NUMERIC(10,5)

  );
`, (err, result) => {
  if (err) {
    console.error('Error creating tables:', err);
  } else {
    console.log('Tables created successfully');
  }
});
