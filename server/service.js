const { getData, getFormattedDate } = require('./helpers/methods');
const ObjectId = require('mongodb').ObjectId;

module.exports.niftyData = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        getData({}, {}, currentDataObj.niftyCol, (rspAry) => {
            res.send({ status: true, message: "Success", data: rspAry })
        })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}

module.exports.bankNiftyData = async function (req, res) {
    try {
        const currentDataObj = getFormattedDate();
        getData({}, {}, currentDataObj.bankCol, (rspAry) => {
            res.send({ status: true, message: "Success", data: rspAry })
        })
    } catch (e) {
        console.log("Error in nifty data ", e);
        res.send({ status: false, message: "Fail", data: e.toString() });
    }
}