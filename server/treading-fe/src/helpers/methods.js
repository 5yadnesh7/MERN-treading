import Axios from "axios";
import { endpoint } from "./endpoints";

export const apiCalls = async (url, body = {}, conf = {}, method, cb) => {
    try {
        var Response = "";
        if (method === "get") {
            Response = await Axios.get(url, conf);
        } else {
            Response = await Axios.post(url, body, conf);
        }
        if (Response.data.status) {
            cb(Response.data.data)
        } else {
            cb(Response.data)
        }
    } catch (err) {
        cb(err)
    }
};

export const urlCreator = (path) => {
    return endpoint.baseUrl + path;
};

export const headers = (obj = "") => {
    var header = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (obj !== "") {
        header.headers = { ...header.headers, ...obj };
    }

    return header;
};

// currently not use
export const oiChangedFormatted = (dataAry, cb) => {
    const finalAry = []
    // eslint-disable-next-line
    dataAry.map(item => {
        const time = item.timezone
        let oiCE = 0, oiPE = 0, changedCE = 0, changedPE = 0;
        // eslint-disable-next-line
        item.filtered.data.map(item => {
            oiCE += item?.CE?.openInterest || 0;
            oiPE += item?.PE?.openInterest || 0;
            changedCE += item?.CE?.changeinOpenInterest || 0;
            changedPE += item?.PE?.changeinOpenInterest || 0;
        });
        finalAry.push({ call: oiCE, put: oiPE, time, callOi: changedCE, putOi: changedPE })
    })
    formateDataByInterval(finalAry, 5, (rsp) => {
        cb(rsp)
    })
}

export const formatHTime = (timeStr) => {
    const date = new Date(timeStr);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
};

// currently not use
export const formateDataByInterval = (dataAry = [], intervalTime = 5, cb) => {
    const result = [dataAry[0]];
    const interval = intervalTime * 60 * 1000;

    for (let i = 1; i < dataAry.length; i++) {
        const prevTime = new Date(result[result.length - 1].time);
        const currentTime = new Date(dataAry[i].time);

        if (currentTime.getTime() - prevTime.getTime() >= interval) {
            result.push(dataAry[i]);
        }
    }

    for (const item of result) {
        item.Htime = formatHTime(item.time);
    }
    cb(result)
}

export const filterByStrikePrice = (array, inputValue, n) => {
    const index = array.reduce((closestIndex, item, currentIndex) => {
        const currentDiff = Math.abs(item.label - inputValue);
        const closestDiff = Math.abs(array[closestIndex].label - inputValue);
        return currentDiff < closestDiff ? currentIndex : closestIndex;
    }, 0);

    const lowerBound = Math.max(0, index - n);
    const upperBound = Math.min(array.length, index + n + 1);

    const selectedElements = array.slice(lowerBound, upperBound);

    return selectedElements.reduce((result, item) => {
        result.push({ label: item.label, y: item.y });
        return result;
    }, []);
}
