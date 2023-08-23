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

const aggregationFunc = async (arr, collectionName, cb) => {
    const db = getDb();
    const data = await db.collection(collectionName).aggregate(arr).toArray()
    cb(data)
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
        matchCurrentDate(apiRsp.records.timestamp, (isMatch) => {
            if (isMatch) {
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
            }
        })
    } catch (err) {
        console.log("Something went wrong ", err);
    }
}

const matchCurrentDate = (curDate, cb) => {
    const givenDate = new Date(curDate);

    const currentDate = new Date();

    const givenYear = givenDate.getFullYear();
    const givenMonth = givenDate.getMonth();
    const givenDay = givenDate.getDate();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const datesMatch = givenYear === currentYear && givenMonth === currentMonth && givenDay === currentDay;
    cb(datesMatch)
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
    // return { date: finalDate, niftyCol: `nifty50-17082023`, bankCol: `bankNifty-17082023` };
    return { date: finalDate, niftyCol: `nifty50-${finalDate}`, bankCol: `bankNifty-${finalDate}` };
}

// true for PE and false for CE
const dynamicSPandOi = (price, type) => {
    const spType = type ? "filtered.data.PE.strikePrice" : "filtered.data.CE.strikePrice"
    const oiType = type ? "filtered.data.PE.openInterest" : "filtered.data.CE.openInterest"
    const comAry = [
        {
            $unwind: "$filtered.data"
        },
        {
            $match: {
                [spType]: price
            }
        },
        {
            $project: {
                _id: 0,
                x: "$records.timestamp",
                y: `$${oiType}`
            }
        }
    ]
    return comAry
}

const dySPAggCall = (inpuAry, collectionName, cb) => {
    const dataAry = []
    inpuAry.map((item, ind) => {
        const dyAry = dynamicSPandOi(item.strikePrice, true)
        aggregationFunc(dyAry, collectionName, (dyRsp) => {
            dataAry.push({ strikePrice: item.strikePrice, data: dyRsp })
            if (inpuAry.length === ind + 1) {
                setTimeout(() => { cb(dataAry) }, 10)
            }
        })
    })
}

const getLimitedData = (arr, timeNode, interval = 5) => {

    function findNearestMatch(inputTimezone) {
        const targetTime = new Date(inputTimezone).getTime();
        let nearestIndex = -1;
        let minTimeDifference = Infinity;

        for (let i = 0; i < arr.length; i++) {
            const currentTime = new Date(arr[i][timeNode]).getTime();

            if (currentTime >= targetTime) {
                const timeDifference = currentTime - targetTime;

                if (timeDifference < minTimeDifference) {
                    minTimeDifference = timeDifference;
                    nearestIndex = i;
                }
            }
        }

        if (nearestIndex !== -1) {
            return arr[nearestIndex];
        } else {
            return null;
        }
    }
    function AddMinutesToDate(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    const startTime = new Date()
    startTime.setHours(9)
    startTime.setMinutes(15)
    startTime.setSeconds("00")
    startTime.setMilliseconds("00")

    const endTime = new Date(arr[arr.length - 1][timeNode])

    const timeAry = []
    for (let i = startTime; i <= endTime; i = AddMinutesToDate(i, interval)) {
        timeAry.push(i)
    }

    const newAry = []
    for (let i = 0; i <= timeAry.length; i++) {
        const item = timeAry[i]
        const nearestMatch = findNearestMatch(item);
        if (nearestMatch !== null) {
            newAry.push(nearestMatch);
        }
        if (item > new Date(arr[arr.length - 1][timeNode])) {
            break;
        }
    }
    newAry.map(item => {
        item.Htime = formatHTime(item.time)
        delete item.time;
    })
    return newAry.reverse();
}

const formatHTime = (timeStr) => {
    const date = new Date(timeStr);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
};

module.exports = { insertData, updateData, getData, deleteData, aggregationFunc, cronJob, getFormattedDate, dySPAggCall, getLimitedData };