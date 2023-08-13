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
                    OiData?.length && OiData?.map((item, ind) => {
                        const changePE = item?.call < 0 ? Math.abs(item?.put) + Math.abs(item?.call) : Math.abs(item?.put)
                        const changeCE = item?.put < 0 ? Math.abs(item?.call) + Math.abs(item?.put) : Math.abs(item?.call)
                        const pcrRation = (changePE / changeCE).toFixed(4)

                        return (
                            <tr className={pcrRation < 1 ? "danger" : "safe"} key={`oiData${ind}`}>
                                <td>{item.callOi}</td>
                                <td>{item.call}</td>
                                <td>{pcrRation}</td>
                                <td>{item.put - item.call}</td>
                                <td>{item.time}</td>
                                <td>{item.put}</td>
                                <td>{item.putOi}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default OiChangedTable