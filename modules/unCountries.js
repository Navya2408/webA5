const countryData = require("../data/countryData");
const regionData = require("../data/regionData");

let countries = [];

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


