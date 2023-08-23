import React, { useState, useEffect } from 'react';
import "./main.scss";
import { bankNiftyOiData, bankNiftyTodayData, bankNiftyTopFiveOi, niftyOiData, niftyTodayData, niftyTopFiveOi } from './helpers/services';
import NseTable from './components/nseTable';
import { filterByStrikePrice } from './helpers/methods';
import OiChangedTable from './components/oiChangedTable';
import TopFiveOi from './components/topFiveOi';
import BarChart from './components/barChart';

const Main = () => {

  const [optionType, setOptionType] = useState("nifty50")
  const [selectedTab, setSelectedTab] = useState({ nseTable: true, oiTable: false, topFiveOi: false, barGraph: false })
  const [nseCurrentData, setNseCurrentData] = useState([])
  const [oiChangedData, setOiChangedData] = useState([])
  const [top5Data, setTop5Data] = useState({ CE: [], PE: [] })
  const [barGraphData, setBarGraphData] = useState({ oiGraph: { call: [], put: [] }, oiChangedGraph: { call: [], put: [] }, strikePriceAry: [] })

  useEffect(() => {
    niftyTodayData((rsp) => {
      if (rsp.length) {
        setNseCurrentData(rsp[0].filtered?.data)
        BarGraphFormateData(rsp[0].filtered?.data, 5)
      }
    })
  }, [])

  const BarGraphFormateData = (data, columnCount = 5) => {
    const callOiAry = []
    const putOiAry = []
    const callOiChangedAry = []
    const putOiChangedAry = []
    let currentStrikePrice = ""
    data.map((item) => {
      if (!currentStrikePrice) {
        currentStrikePrice = item.CE.underlyingValue
      }

      callOiAry.push({ label: item.CE.strikePrice, y: item.CE.openInterest })
      putOiAry.push({ label: item.PE.strikePrice, y: item.PE.openInterest })
      callOiChangedAry.push({ label: item.CE.strikePrice, y: item.CE.changeinOpenInterest })
      putOiChangedAry.push({ label: item.PE.strikePrice, y: item.PE.changeinOpenInterest })
    });

    const formattedCallOiAry = filterByStrikePrice(callOiAry, currentStrikePrice, columnCount);
    const formattedPutOiAry = filterByStrikePrice(putOiAry, currentStrikePrice, columnCount);
    const formattedCallChangedOiAry = filterByStrikePrice(callOiChangedAry, currentStrikePrice, columnCount);
    const formattedPutChangedOiAry = filterByStrikePrice(putOiChangedAry, currentStrikePrice, columnCount);
    const strikePriceAry = []
    for (let i = 1; i <= (columnCount * 2) + 1; i++) {
      if (i == columnCount + 1) {
        strikePriceAry.push({ label: "", y: currentStrikePrice })
      } else {
        strikePriceAry.push({ label: "", y: "" })
      }
    }
    setBarGraphData({ oiGraph: { call: formattedCallOiAry, put: formattedPutOiAry }, oiChangedGraph: { call: formattedCallChangedOiAry, put: formattedPutChangedOiAry }, strikePriceAry });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (optionType === "nifty50") {
        if (selectedTab.nseTable || selectedTab.barGraph) {
          niftyTodayData((rsp) => {
            if (rsp.length) {
              setNseCurrentData(rsp[0].filtered?.data)
              BarGraphFormateData(rsp[0].filtered?.data, 5)
            }
          })
        } else if (selectedTab.oiTable) {
          niftyOiData((rsp) => {
            if (rsp.length) {
              setOiChangedData(rsp)
            }
          })
        } else if (selectedTab.topFiveOi) {
          niftyTopFiveOi((rsp) => {
            setTop5Data(rsp)
          })
        }
      } else {
        if (selectedTab.nseTable || selectedTab.barGraph) {
          bankNiftyTodayData((rsp) => {
            if (rsp.length) {
              setNseCurrentData(rsp[0].filtered?.data)
              BarGraphFormateData(rsp[0].filtered?.data, 5)
            }
          })
        } else if (selectedTab.oiTable) {
          bankNiftyOiData((rsp) => {
            if (rsp.length) {
              setOiChangedData(rsp)
            }
          })
        } else if (selectedTab.topFiveOi) {
          bankNiftyTopFiveOi((rsp) => {
            setTop5Data(rsp)
          })
        }
      }
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [optionType, selectedTab])

  useEffect(() => {
    if (optionType === "nifty50") {
      if (selectedTab.nseTable || selectedTab.barGraph) {
        niftyTodayData((rsp) => {
          if (rsp.length) {
            setNseCurrentData(rsp[0].filtered?.data)
            BarGraphFormateData(rsp[0].filtered?.data, 5)
          }
        })
      } else if (selectedTab.oiTable) {
        niftyOiData((rsp) => {
          if (rsp.length) {
            setOiChangedData(rsp)
          }
        })
      } else if (selectedTab.topFiveOi) {
        niftyTopFiveOi((rsp) => {
          setTop5Data(rsp)
        })
      }
    } else {
      if (selectedTab.nseTable || selectedTab.barGraph) {
        bankNiftyTodayData((rsp) => {
          if (rsp.length) {
            setNseCurrentData(rsp[0].filtered?.data)
            BarGraphFormateData(rsp[0].filtered?.data, 5)
          }
        })
      } else if (selectedTab.oiTable) {
        bankNiftyOiData((rsp) => {
          if (rsp.length) {
            setOiChangedData(rsp)
          }
        })
      } else if (selectedTab.topFiveOi) {
        bankNiftyTopFiveOi((rsp) => {
          setTop5Data(rsp)
        })
      }
    }
  }, [optionType, selectedTab])

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
      <div className={"option-selector"}>
        <select onChange={(e) => setOptionType(e.target.value)}>
          <option value={"nifty50"}>Nifty 50</option>
          <option value={"bankNifty"}>Bank Nifty</option>
        </select>
      </div>
      <div className={"top-btn-container"}>
        <button className={selectedTab.nseTable ? "active" : "inactive"} onClick={() => handleSelectedTab("nseTable")}>NSE Table</button>
        <button className={selectedTab.oiTable ? "active" : "inactive"} onClick={() => handleSelectedTab("oiTable")}>OI Table</button>
        <button className={selectedTab.topFiveOi ? "active" : "inactive"} onClick={() => handleSelectedTab("topFiveOi")}>Top 5 OI</button>
        <button className={selectedTab.barGraph ? "active" : "inactive"} onClick={() => handleSelectedTab("barGraph")}>OI Graph</button>
      </div>
      {selectedTab.nseTable && nseCurrentData.length ? <NseTable tData={nseCurrentData} key={"nseLatestDataTable"} /> : null}
      {selectedTab.oiTable && oiChangedData.length ? <OiChangedTable OiData={oiChangedData} /> : null}
      {selectedTab.topFiveOi && top5Data.CE.length && top5Data.PE.length ? <TopFiveOi data={top5Data} /> : null}
      {
        selectedTab.barGraph && nseCurrentData.length ?
          <>
            <BarChart data={barGraphData.oiGraph} strikePriceAry={barGraphData.strikePriceAry} title={"OI"} key={"oiGraph"} />
            <BarChart data={barGraphData.oiChangedGraph} strikePriceAry={barGraphData.strikePriceAry} title={"Changed OI"} key={"changeOiGraph"} />
          </>
          : null
      }

    </div>
  )
}

export default Main