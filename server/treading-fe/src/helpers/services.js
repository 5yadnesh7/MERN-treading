import { endpoint } from "./endpoints";
import { apiCalls, headers, urlCreator } from "./methods";

export const niftyTodayData = (cb) => {
    const url = urlCreator(endpoint.nifty.todaysData);
    const conf = headers();
    apiCalls(url, {}, conf, "get", (rsp) => {
        cb(rsp)
    });
};

export const bankNiftyTodayData = (cb) => {
    const url = urlCreator(endpoint.bankNifty.todaysData);
    const conf = headers();
    apiCalls(url, {}, conf, "get", (rsp) => {
        cb(rsp)
    });
};

export const niftyOiData = (cb) => {
    const url = urlCreator(endpoint.nifty.oiData);
    const conf = headers();
    apiCalls(url, {}, conf, "get", (rsp) => {
        cb(rsp)
    });
};

export const niftyTopFiveOi = (cb) => {
    const url = urlCreator(endpoint.nifty.topFiveOi);
    const conf = headers();
    apiCalls(url, {}, conf, "get", (rsp) => {
        cb(rsp)
    });
};