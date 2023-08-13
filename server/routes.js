const express = require("express");
const route = express();
const { niftyData, bankNiftyData } = require("./service");

route.get("/niftyData", niftyData)
route.get("/bankNiftyData", bankNiftyData)

module.exports = route;
