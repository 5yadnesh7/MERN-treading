const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { PORT, frontEnd } = require("./helpers/constants");
const router = require("./routes");
const db = require('./helpers/connection');
const { cronJob } = require("./helpers/methods");
const CronJob = require('cron').CronJob;

app.use(
    cors({
        origin: frontEnd,
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", router);

const job = new CronJob('* * * * *', cronJob)

db.mongoConnect((db) => {
    app.db = db;
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
        job.start()
    })
});