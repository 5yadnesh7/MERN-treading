import React, { useState, useEffect } from 'react';
import "./main.scss";
import { niftyOiData, niftyTodayData, niftyTopFiveOi } from './helpers/services';
import NseTable from './components/nseTable';
import { formateDataByInterval } from './helpers/methods';
import OiChangedTable from './components/oiChangedTable';
import TopFiveOi from './components/topFiveOi';

const Main = () => {

  const [selectedTab, setSelectedTab] = useState({ nseTable: true, oiTable: false, topFiveOi: false })
  const [nseCurrentData, setNseCurrentData] = useState([])
  const [oiChangedData, setOiChangedData] = useState([])
  const [top5Data, setTop5Data] = useState([])

  useEffect(() => {
    niftyTodayData((rsp) => {
      if (rsp.length) {
        setNseCurrentData(rsp[0].filtered?.data)
      }
    })
    niftyOiData((rsp) => {
      if (rsp.length) {
        formateDataByInterval(rsp, 5, (formatedData) => {
          setOiChangedData(formatedData)
        })
      }
    })
    niftyTopFiveOi((rsp) => {
      setTop5Data(rsp)
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      niftyTodayData((rsp) => {
        if (rsp.length) {
          setNseCurrentData(rsp[0].filtered?.data)
        }
      })
      niftyOiData((rsp) => {
        if (rsp.length) {
          formateDataByInterval(rsp, 5, (formatedData) => {
            setOiChangedData(formatedData)
          })
        }
      })
      niftyTopFiveOi((rsp) => {
        setTop5Data(rsp)
      })
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
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
        <button onClick={() => handleSelectedTab("topFiveOi")}>Top 5 OI</button>
      </div>
      {selectedTab.nseTable ? <NseTable tData={nseCurrentData} key={"nseLatestDataTable"} /> : null}
      {selectedTab.oiTable ? <OiChangedTable OiData={oiChangedData} /> : null}
      {selectedTab.topFiveOi ? <TopFiveOi data={top5Data} /> : null}
    </div>
  )
}

export default Main