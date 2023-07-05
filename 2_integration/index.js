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
    Fuel VARCHAR(100)
  );

  CREATE TABLE IF NOT EXISTS location (
    id SERIAL PRIMARY KEY,
    Radiation_kWH NUMERIC(8,3),
    AvgTemperature_celsius NUMERIC(8,3),
    HoursOfSun NUMERIC(8,3),
    Code VARCHAR(100),
    FullName VARCHAR(100)
  );

  CREATE TABLE IF NOT EXISTS energyProduction (
    id SERIAL PRIMARY KEY,
    State VARCHAR(100),
    EnergySource VARCHAR(100), 
    Generation_MWH NUMERIC(100,5),
    FullName VARCHAR(100), 
    FuelID INT NULL,
    FOREIGN KEY (FuelID) REFERENCES fuel (id),
    LocationID INT NULL,
    FOREIGN KEY (LocationID) REFERENCES location (id)
  );

  CREATE TABLE IF NOT EXISTS solarFarmProduction (
    id SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    State VARCHAR(100),
    Capacity_MW NUMERIC(10,5),
    AnnualGeneration_GWh NUMERIC(10,5),
    Type VARCHAR(100),
    Coordinates VARCHAR(100),
    StateCode VARCHAR(100),
    LocationID INT NULL,
    FOREIGN KEY (LocationID) REFERENCES location (id)
  );

  CREATE TABLE IF NOT EXISTS dataCenterEnergyConsumption (
    id SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    AmmountConsumedPerYear_kWh NUMERIC(100,50),
    Size_mxm NUMERIC(100,5),
    GeoCoordinates VARCHAR(100),
    StateCode VARCHAR(100),
    LocationID INT NULL,
    FOREIGN KEY (LocationID) REFERENCES location (id)
  );  

  CREATE TABLE IF NOT EXISTS energyConsumption (
    id SERIAL PRIMARY KEY,
    State VARCHAR(100),
    Code VARCHAR(100),
    FuelType VARCHAR(100),
    Consumption NUMERIC(100,5),
    FuelID INT NULL,
    FOREIGN KEY (FuelID) REFERENCES fuel (id),
    LocationID INT NULL,
    FOREIGN KEY (LocationID) REFERENCES location (id)
  );
`, (err, result) => {
  if (err) {
    console.error('Error creating tables:', err);
  } else {
    console.log('Tables created successfully');
  }
});



