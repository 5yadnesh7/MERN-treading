import { backEndUrl } from "./constants";

export const endpoint = {
    baseUrl: backEndUrl,
    nifty: {
        todaysData: "/niftyData",
        oiData: "/niftyOIData",
        topFiveOi: "/niftyTopFiveOi"
    },
    bankNifty: {
        todaysData: "/bankNiftyData",
    },
}