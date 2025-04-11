import express from "express";
import ejs, { name } from "ejs";
import axios from "axios";
import bodyParser from "body-parser";

import countries from 'i18n-iso-countries';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const enLocale = require('i18n-iso-countries/langs/en.json');
countries.registerLocale(enLocale);

const app = express();
const port = 3000;
const API_URL = "https://api.nationalize.io/?name=";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    // console.log(req);
    res.render("index.ejs", {
        
    });
});  

app.post("/", async (req, res) => {
    const nameArr = req.body.name.split();
    
    const response = await axios.get(API_URL + `${nameArr.join("+")}`);
    const result = response.data;
    let percent = Math.round(result.country[0].probability * 100) - 1;
    const countryISOCode = result.country[0].country_id;
    const countryName = countries.getName(countryISOCode, 'en');
    console.log(result);
    res.render("index.ejs", {
        name: result.name,
        country: countryName,
        percentage: percent,
    });
});



app.listen(port, () => {
    console.log(`working on ${port}`);
});