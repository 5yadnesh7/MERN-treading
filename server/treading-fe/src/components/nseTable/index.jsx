import React from 'react';
import "./index.scss";

const NseTable = ({ tData = [] }) => {
    return (
        <table border={1} className={"table-container"}>
            <thead className={"header"}>
                <tr className={"no-border"}>
                    <th colSpan={6}>Call</th>
                    <th></th>
                    <th colSpan={6}>Put</th>
                </tr>
                <tr>
                    <th>OI</th>
                    <th>Changed in OI</th>
                    <th>Total Buying Qty</th>
                    <th>Total Selling Qty</th>
                    <th>BSR</th>
                    <th>Price</th>
                    <th>Strike Price</th>
                    <th>Price</th>
                    <th>BSR</th>
                    <th>Total Selling Qty</th>
                    <th>Total Buying Qty</th>
                    <th>Changed in OI</th>
                    <th>OI</th>
                </tr>
            </thead>
            <tbody className={"body"}>
                {tData.length && tData?.map((item, ind) => {
                    const callInTheMoney = item.CE.underlyingValue > item.CE.strikePrice
                    const putInTheMoney = item.CE.underlyingValue < item.CE.strikePrice
                    if (item.CE.strikePrice > item.CE.underlyingValue && item.CE.underlyingValue > item.CE.strikePrice - 50) {
                        return (
                            <React.Fragment key={`option ${ind}`}>
                                <tr key={`option-strike ${ind}`} className={"atTheMoney"}>
                                    <td colSpan={14}>{item.CE.underlyingValue}</td>
                                </tr>
                                <tr key={`option ${ind}`}>
                                    <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.CE.openInterest}</td>
                                    <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"} ${item.CE.changeinOpenInterest < 0 ? "danger" : ""}`}>{item.CE.changeinOpenInterest}</td>
                                    <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.CE.totalBuyQuantity}</td>
                                    <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.CE.totalSellQuantity}</td>
                                    <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{(item.CE.totalBuyQuantity / item.CE.totalSellQuantity).toFixed(4)}</td>
                                    <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.CE.askPrice}</td>
                                    <td className={"strikPrice"}>{item.CE.strikePrice}</td>
                                    <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.PE.askPrice}</td>
                                    <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{(item.PE.totalBuyQuantity / item.PE.totalSellQuantity).toFixed(4)}</td>
                                    <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.PE.totalSellQuantity}</td>
                                    <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.PE.totalBuyQuantity}</td>
                                    <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"} ${item.PE.changeinOpenInterest < 0 ? "danger" : ""}`}>{item.PE.changeinOpenInterest}</td>
                                    <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.PE.openInterest}</td>
                                </tr>
                            </React.Fragment>
                        );
                    }
                    return (
                        <tr key={`option ${ind}`}>
                            <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.CE.openInterest}</td>
                            <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"} ${item.CE.changeinOpenInterest < 0 ? "danger" : ""}`}>{item.CE.changeinOpenInterest}</td>
                            <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.CE.totalBuyQuantity}</td>
                            <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.CE.totalSellQuantity}</td>
                            <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{(item.CE.totalBuyQuantity / item.CE.totalSellQuantity).toFixed(4)}</td>
                            <td className={`${callInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.CE.askPrice}</td>
                            <td className={"strikPrice"}>{item.CE.strikePrice}</td>
                            <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.PE.askPrice}</td>
                            <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{(item.PE.totalBuyQuantity / item.PE.totalSellQuantity).toFixed(4)}</td>
                            <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.PE.totalSellQuantity}</td>
                            <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.PE.totalBuyQuantity}</td>
                            <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"} ${item.PE.changeinOpenInterest < 0 ? "danger" : ""}`}>{item.PE.changeinOpenInterest}</td>
                            <td className={`${putInTheMoney ? "inTheMoney" : "outTheMoney"}`}>{item.PE.openInterest}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

export default NseTable