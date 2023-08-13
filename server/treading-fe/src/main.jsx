import React, { useState, useEffect } from 'react';
import "./main.scss";
import { niftyTodayData } from './helpers/services';
import NseTable from './components/nseTable';
import { oiChangedFormatted } from './helpers/methods';
import OiChangedTable from './components/oiChangedTable';

const Main = () => {

  const [selectedTab, setSelectedTab] = useState({ nseTable: true, oiTable: false })
  const [nseCurrentData, setNseCurrentData] = useState([])
  const [oiChangedData, setOiChangedData] = useState([])

  useEffect(() => {
    niftyTodayData((rsp) => {
      console.log("Response is ", rsp);
      if (rsp.length) {
        setNseCurrentData(rsp[rsp.length - 1].filtered?.data)
        oiChangedFormatted(rsp, (finalData) => {
          setOiChangedData(finalData)
        })
      }
    })
  }, [])

  const handleSelectedTab = (selected) => {
    const currentState = { ...selectedTab }
    for (const key in currentState) {
      if (currentState.hasOwnProperty(key)) {
        currentState[key] = key === selected;
      }
    }
    setSelectedTab({ ...currentState })
  }

  return (
    <div className={"main-container"}>
      <div className={"top-btn-container"}>
        <button onClick={() => handleSelectedTab("nseTable")}>NSE Table</button>
        <button onClick={() => handleSelectedTab("oiTable")}>OI Table</button>
      </div>
      {selectedTab.nseTable ? <NseTable tData={nseCurrentData} key={"nseLatestDataTable"} /> : null}
      {selectedTab.oiTable ? <OiChangedTable OiData={oiChangedData} /> : null}
    </div>
  )
}

export default Main