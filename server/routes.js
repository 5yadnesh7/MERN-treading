const express = require("express");
const route = express();
const { niftyData, bankNiftyData, niftyOIData } = require("./service");

route.get("/niftyData", niftyData)
route.get("/bankNiftyData", bankNiftyData)
route.get("/niftyOIData", niftyOIData)

module.exports = route;
