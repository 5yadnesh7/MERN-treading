const PORT = 2121;

const frontEnd = [
    "http://localhost:3000",
];

const dbUrl = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const dbName = "treading"

module.exports = { PORT, frontEnd, dbUrl, dbName };