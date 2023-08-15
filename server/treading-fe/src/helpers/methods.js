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
        finalAry.push({ call: changedCE, put: changedPE, time, callOi: oiCE, putOi: oiPE })
    })
    formateDataByInterval(finalAry, 5, (rsp) => {
        cb(rsp)
    })
}

const formateDataByInterval = (dataAry = [], intervalTime = 5, cb) => {
    const result = [dataAry[0]];
    const interval = intervalTime * 60 * 1000;
    const formatTime = (timeStr) => {
        const date = new Date(timeStr);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    };

    for (let i = 1; i < dataAry.length; i++) {
        const prevTime = new Date(result[result.length - 1].time);
        const currentTime = new Date(dataAry[i].time);

        if (currentTime.getTime() - prevTime.getTime() >= interval) {
            result.push(dataAry[i]);
        }
    }

    for (const item of result) {
        item.Htime = formatTime(item.time);
    }
    cb(result)
}