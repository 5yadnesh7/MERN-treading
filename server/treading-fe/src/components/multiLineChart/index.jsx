import React from 'react';
import "./index.scss";
import CanvasJSReact from '@canvasjs/react-charts';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MultiLineChart = ({ title, yAxisText, dataAry }) => {

    const options = {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        title: {
            text: title
        },
        axisY: {
            title: yAxisText
        },
        toolTip: {
            shared: true
        },
        legend: {
            verticalAlign: "center",
            horizontalAlign: "right",
            reversed: true,
            cursor: "pointer"
        },
        data: dataAry
    }

    return (
        <div className="chart-container">
            <CanvasJSChart options={options} />
        </div>
    )
}

export default MultiLineChart