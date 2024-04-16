const unCountryData = require("./modules/unCountries");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public')); 
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render("home")
});

app.get('/about', (req, res) => {
  res.render("about")
});

app.get("/un/countries", async (req,res)=>{
  
  let countries = [];

  try{
    if(req.query.region){
      countries = await unCountryData.getCountriesByRegion(req.query.region);
    }else{
      countries = await unCountryData.getAllCountries();
    }
    // res.json(countries)
    res.render("countries", {countries})
  }catch(err){
    res.status(404).render("404", {message: err});
  }

});

app.get("/un/countries/:code", async (req,res)=>{
  try{
    let country = await unCountryData.getCountryByCode(req.params.code);
    res.render("country", {country})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});

// app.get("/un/countries/region-demo", async (req,res)=>{
//   try{
//     let countries = await unCountryData.getCountriesByRegion("Oceania");
//     res.send(countries);
//   }catch(err){
//     res.send(err);
//   }
// });

app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

unCountryData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});

