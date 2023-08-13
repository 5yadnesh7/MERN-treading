const getDb = require('./connection').getDb;
const axios = require('axios');

const insertData = async (data, collectionName, cb) => {
    const db = getDb();
    const insertedData = await db.collection(collectionName).insertOne(data)
    cb(insertedData)
}

const updateData = async (findObj, data, collectionName, cb) => {
    const db = getDb();
    const updatedData = await db.collection(collectionName).updateOne(findObj, { $set: data })
    cb(updatedData)
}

const getData = async (findObj, sortObj = {}, collectionName, cb) => {
    const db = getDb();
    const getData = await db.collection(collectionName)
        .find(findObj)
        .project({})
        .sort(sortObj)
        .toArray()
    cb(getData)
}

const deleteData = async (delObj, collectionName, cb) => {
    const db = getDb();
    const deletedData = await db.collection(collectionName).deleteOne(delObj)
    cb(deletedData)
}

const cronJob = () => {
    try {
        const db = getDb();
        const formattedDate = getFormattedDate();
        nseApiCall("NIFTY", (rsp) => {
            checkAndInsertData(db, formattedDate.niftyCol, rsp)
        })
        nseApiCall("BANKNIFTY", (rsp) => {
            checkAndInsertData(db, formattedDate.bankCol, rsp)
        })
    } catch (err) {
        console.log("Something went wrong ", err);
    }
}

const nseApiCall = async (symbol, cb) => {
    try {
        const url = `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`
        const res = await axios.get(url);
        const apiRsp = res.data;
        if (apiRsp?.records) {
            cb(apiRsp)
        }
    } catch (err) {
        console.log("Something went wrong ", err);
    }
}

const checkAndInsertData = async (db, collName, apiRsp) => {
    try {
        checkCollectionExist(db, collName, async (status) => {
            if (status) {
                getData({ "records.timestamp": apiRsp.records.timestamp }, {}, collName, (rsp) => {
                    if (rsp.length == 0) {
                        insertData(apiRsp, collName, (rsp) => {
                            // Data inserted
                        })
                    }
                })
            } else {
                await db.createCollection(collName)
            }
        })
    } catch (err) {
        console.log("Something went wrong ", err);
    }
}

const checkCollectionExist = async (db, collName, cb) => {
    try {
        const collectionNames = await db.listCollections().toArray();
        const findingObj = collectionNames.find(item => item.name == collName)
        if (findingObj?.name) {
            cb(true)
        } else {
            cb(false)
        }
    } catch (err) {
        console.log("Something went wrong ", err);
    }
}

const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    const finalDate = day + month + year
    return { date: finalDate, niftyCol: `nifty50-${finalDate}`, bankCol: `bankNifty-${finalDate}` };
}

module.exports = { insertData, updateData, getData, deleteData, cronJob, getFormattedDate };