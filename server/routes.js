const express = require("express");
const route = express();
const { niftyData, bankNiftyData, niftyOIData, niftyTopFiveOi } = require("./service");

route.get("/niftyData", niftyData)
route.get("/bankNiftyData", bankNiftyData)
route.get("/niftyOIData", niftyOIData)
route.get("/niftyTopFiveOi", niftyTopFiveOi)

module.exports = route;
