import React from 'react'
import "./index.scss";
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const BarChart = ({ data, title, strikePriceAry }) => {

    const options = {
        title: { text: title },
        axisYType: "primary",
        data: [
            {
                type: "column",
                name: "Put",
                showInLegend: true,
                dataPoints: data.put || [],
                color: "green",
            },
            {
                type: "line",
                name: "Strike Price",
                showInLegend: true,
                dataPoints: strikePriceAry || [],
                color: "black",
            },
            {
                type: "column",
                name: "Call",
                showInLegend: true,
                dataPoints: data.call || [],
                color: "red",
            },
        ],
    };

    return (
        <CanvasJSChart options={options} />
    )
}

export default BarChart