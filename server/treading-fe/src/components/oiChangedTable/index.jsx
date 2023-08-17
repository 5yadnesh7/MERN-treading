import React from 'react';
import "./index.scss";

const OiChangedTable = ({ OiData = [] }) => {
    return (
        <table border={1} className='oiTable-container'>
            <thead className="header">
                <tr className={"no-border"}>
                    <th colSpan={2}>Call</th>
                    <th colSpan={3}></th>
                    <th colSpan={2}>Put</th>
                </tr>
                <tr>
                    <th>OI</th>
                    <th>Changed in OI</th>
                    <th>PCR</th>
                    <th>Difference</th>
                    <th>Time</th>
                    <th>Changed in OI</th>
                    <th>OI</th>
                </tr>
            </thead>
            <tbody className='body'>
                {
                    OiData?.length ? OiData.reverse()?.map((item, ind) => {
                        const changePE = item?.callOi < 0 ? Math.abs(item?.putOi) + Math.abs(item?.callOi) : Math.abs(item?.putOi)
                        const changeCE = item?.putOi < 0 ? Math.abs(item?.callOi) + Math.abs(item?.putOi) : Math.abs(item?.callOi)
                        const pcrRation = (changePE === 0 && changePE === 0) ? "-" : (changePE / changeCE).toFixed(4)

                        return (
                            <tr className={pcrRation < 1 ? "danger" : "safe"} key={`oiData${ind}`}>
                                <td>{item.call}</td>
                                <td>{item.callOi}</td>
                                <td>{pcrRation}</td>
                                <td>{item.putOi - item.callOi}</td>
                                <td>{item.Htime}</td>
                                <td>{item.putOi}</td>
                                <td>{item.put}</td>
                            </tr>
                        )
                    }) : <tr><td colSpan={7}>Data not available</td></tr>
                }
            </tbody>
        </table>
    )
}

export default OiChangedTable