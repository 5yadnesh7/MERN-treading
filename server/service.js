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

module.exports.niftyOIData = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        const db = getDb();
        const data = await db.collection(currentDataObj.niftyCol).aggregate([
            {
                $project: {
                    records: 1,
                    filtered: 1
                }
            },
            {
                $unwind: "$filtered.data"
            },
            {
                $group: {
                    _id: "$records.timestamp",
                    call: { $sum: "$filtered.data.CE.openInterest" },
                    callOi: { $sum: "$filtered.data.CE.changeinOpenInterest" },
                    put: { $sum: "$filtered.data.PE.openInterest" },
                    putOi: { $sum: "$filtered.data.PE.changeinOpenInterest" }
                }
            },
            {
                $project: {
                    time: "$_id",
                    _id: 0,
                    call: 1,
                    callOi: 1,
                    put: 1,
                    putOi: 1,
                    diff: { $subtract: ["$putOi", "$callOi"] },
                    PCR: {
                        $cond: {
                            if: { $eq: ["$callOi", 0] },
                            then: 0,
                            else: {
                                $divide: ["$putOi", "$callOi"]
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    time: 1
                }
            }
        ]).toArray()
        res.send({ status: true, message: "Success", data: data })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}