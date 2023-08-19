const { getFormattedDate, aggregationFunc, dySPAggCall } = require('./helpers/methods');
const ObjectId = require('mongodb').ObjectId;

module.exports.niftyData = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        const aggAry = [
            { $sort: { "records.timestamp": -1 } },
            { $limit: 1 },
            {
                $project: {
                    _id: 0,
                    filtered: 1,
                    timezone: "$records.timestamp",
                }
            }
        ]
        aggregationFunc(aggAry, currentDataObj.niftyCol, (rspData) => {
            res.send({ status: true, message: "Success", data: rspData })
        })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.bankNiftyData = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        const aggAry = [
            { $sort: { "records.timestamp": -1 } },
            { $limit: 1 },
            {
                $project: {
                    _id: 0,
                    filtered: 1,
                    timezone: "$records.timestamp",
                }
            }
        ]
        aggregationFunc(aggAry, currentDataObj.bankCol, (rspData) => {
            res.send({ status: true, message: "Success", data: rspData })
        })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.niftyOIData = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        const aggAry = [
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
                    _id: 0,
                    time: "$_id",
                    call: 1,
                    callOi: 1,
                    put: 1,
                    putOi: 1,
                }
            },
            {
                $sort: {
                    "time": 1
                }
            }
        ]
        aggregationFunc(aggAry, currentDataObj.niftyCol, (rspData) => {
            res.send({ status: true, message: "Success", data: rspData })
        })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.niftyTopFiveOi = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        const PEAggAry = [
            {
                $sort: {
                    "records.timestamp": -1
                }
            },
            { $limit: 1 },
            {
                $project: {
                    finalData: "$filtered.data"
                }
            },
            {
                $unwind: "$finalData"
            },
            {
                $project: {
                    _id: 0,
                    PEOpenInterest: "$finalData.PE.openInterest",
                    strikePrice: "$finalData.PE.strikePrice"
                }
            },
            {
                $sort: {
                    PEOpenInterest: -1
                }
            },
            { $limit: 5 }
        ]
        const CEaggAry = [
            {
                $sort: {
                    "records.timestamp": -1
                }
            },
            { $limit: 1 },
            {
                $project: {
                    finalData: "$filtered.data"
                }
            },
            {
                $unwind: "$finalData"
            },
            {
                $project: {
                    _id: 0,
                    CEOpenInterest: "$finalData.CE.openInterest",
                    strikePrice: "$finalData.CE.strikePrice"
                }
            },
            {
                $sort: {
                    CEOpenInterest: -1
                }
            },
            { $limit: 5 }
        ]
        aggregationFunc(PEAggAry, currentDataObj.niftyCol, (PErspData) => {
            aggregationFunc(CEaggAry, currentDataObj.niftyCol, (CErspData) => {
                dySPAggCall(PErspData, currentDataObj.niftyCol, (PEOverAllAry) => {
                    dySPAggCall(CErspData, currentDataObj.niftyCol, (CEOverAllAry) => {
                        res.send({ status: true, message: "Success", data: { PE: PEOverAllAry, CE: CEOverAllAry } })
                    })
                })
            })
        })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}