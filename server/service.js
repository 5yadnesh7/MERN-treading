const { getData, getFormattedDate } = require('./helpers/methods');
const ObjectId = require('mongodb').ObjectId;
const getDb = require('./helpers/connection').getDb;

module.exports.niftyData = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        const db = getDb();
        const data = await db.collection(currentDataObj.niftyCol).aggregate([
            {
                $project: {
                    filtered: 1,
                    timezone: "$records.timestamp",
                }
            }
        ]).toArray()
        res.send({ status: true, message: "Success", data: data })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.bankNiftyData = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        const db = getDb();
        const data = await db.collection(currentDataObj.bankCol).aggregate([
            {
                $project: {
                    filtered: 1,
                    timezone: "$records.timestamp",
                }
            }
        ]).toArray()
        res.send({ status: true, message: "Success", data: data })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}