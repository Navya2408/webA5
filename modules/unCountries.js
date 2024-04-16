require("dotenv").config();
const Sequelize = require("sequelize");

// set up sequelize to point to our postgres database
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);
const countryData = require("../data/countryData");
const regionData = require("../data/regionData");
let countries = [];

const Region = sequelize.define(
  "Region",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    subs: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

const Country = sequelize.define(
  "Country",
  {
    a2code: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    official: Sequelize.STRING,
    nativeName: Sequelize.STRING,
    permanentUNSC: Sequelize.BOOLEAN,
    wikipediaURL: Sequelize.STRING,
    capital: Sequelize.STRING,
    regionId: Sequelize.INTEGER,
    languages: Sequelize.STRING,
    population: Sequelize.INTEGER,
    flag: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

Country.belongsTo(Region, { foreignKey: "regionId" });

function initialize() {
  return new Promise((resolve, reject) => {
    countryData?.forEach(country => {
      let countryWithRegion = { ...country, region: regionData.find(region => region.id == country.regionId) }
      countries.push(countryWithRegion);
      resolve();
    });
  });

}

function getAllCountries() {
  return new Promise((resolve, reject) => {
    resolve(countries);
  });
}

function getCountryByCode(countryCode) {

  return new Promise((resolve, reject) => {
    let foundCountry = countries.find(c => c.a2code == countryCode.toUpperCase());

    if (foundCountry) {
      resolve(foundCountry)
    } else {
      reject("Unable to find requested country");
    }

  });

}

function getCountriesByRegion(region) {

  return new Promise((resolve, reject) => {
    let foundCountries = countries.filter(c => c.region.name.toUpperCase().includes(region.toUpperCase()));

    if (foundCountries) {
      resolve(foundCountries)
    } else {
      reject("Unable to find requested countries");
    }

  });

}

module.exports = { initialize, getAllCountries, getCountryByCode, getCountriesByRegion }



sequelize
  .sync()
  .then( async () => {
    try{
      await Region.bulkCreate(regionData);
      await Country.bulkCreate(countryData); 
      console.log("-----");
      console.log("data inserted successfully");
    }catch(err){
      console.log("-----");
      console.log(err.message);

      // NOTE: If you receive the error:

      // insert or update on table "Countries" violates foreign key constraint "Countries_region_id_fkey"

      // it is because you have a "country" in your collection that has a "regionId" that does not exist in the "regionData".   

      // To fix this, use PgAdmin to delete the newly created "Regions" and "Countries" tables, fix the error in your .json files and re-run this code
    }

    process.exit();
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  })