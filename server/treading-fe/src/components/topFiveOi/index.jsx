import React, { useEffect, useState } from 'react';
import "./index.scss";
import MultiLineChart from '../multiLineChart';

const TopFiveOi = ({ data }) => {

    const [finalData, setFinalData] = useState({ CE: [], PE: [] })

    useEffect(() => {
        const CEData = data?.CE.map(item => {
            return {
                type: "stackedArea",
                name: item.strikePrice.toString(),
                showInLegend: true,
                xValueFormatString: "h:mm TT",
                dataPoints: item.data.map(subItem => {
                    return {
                        x: new Date(subItem.x),
                        y: subItem.y
                    }
                })
            }
        })
        const PEData = data?.PE.map(item => {
            return {
                type: "stackedArea",
                name: item.strikePrice.toString(),
                showInLegend: true,
                xValueFormatString: "h:mm TT",
                dataPoints: item.data.map(subItem => {
                    return {
                        x: new Date(subItem.x),
                        y: subItem.y
                    }
                })
            }
        })
        setFinalData({ CE: CEData, PE: PEData })
    }, [data])

    return (
        <div className="topFiveContainer">
            <MultiLineChart title={"Put OI"} yAxisText={"Call OI Counts"} dataAry={finalData.PE} />
            <MultiLineChart title={"Call OI"} yAxisText={"Put OI Counts"} dataAry={finalData.CE} />
        </div>
    )
}

export default TopFiveOi