const express = require("express");
const route = express();
const { niftyData, bankNiftyData, niftyOIData, niftyTopFiveOi, bankNiftyOIData, bankNiftyTopFiveOi } = require("./service");

route.get("/niftyData", niftyData)
route.get("/bankNiftyData", bankNiftyData)
route.get("/niftyOIData", niftyOIData)
route.get("/bankNiftyOIData", bankNiftyOIData)
route.get("/niftyTopFiveOi", niftyTopFiveOi)
route.get("/bankNiftyTopFiveOi", bankNiftyTopFiveOi)

module.exports = route;
