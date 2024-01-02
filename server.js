const unCountryData = require("./modules/unCountries");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Assignment 2:  Student Name - Student Id');
});

app.get("/un/countries", async (req,res)=>{
  let countries = await unCountryData.getAllCountries();
  res.send(countries);
});

app.get("/un/countries/country-demo", async (req,res)=>{
  try{
    let country = await unCountryData.getCountryByCode("ca");
    res.send(country);
  }catch(err){
    res.send(err);
  }
});

app.get("/un/countries/region-demo", async (req,res)=>{
  try{
    let countries = await unCountryData.getCountriesByRegion("Oceania");
    res.send(countries);
  }catch(err){
    res.send(err);
  }
});

unCountryData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});

