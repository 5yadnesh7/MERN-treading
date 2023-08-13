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
        const time = item.records.timestamp
        let oiCE = 0, oiPE = 0, changedCE = 0, changedPE = 0;
        // eslint-disable-next-line
        item.filtered.data.map((item) => {
            oiCE += item.CE.openInterest;
            oiPE += item.PE.openInterest;
            changedCE += item.CE.changeinOpenInterest;
            changedPE += item.PE.changeinOpenInterest;
        });
        finalAry.push({ call: changedCE, put: changedPE, time, callOi: oiCE, putOi: oiPE })
    })
    cb(finalAry)

}