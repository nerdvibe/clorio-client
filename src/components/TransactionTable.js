import React from 'react'
import {Table} from 'react-bootstrap'

const mockData = [{
    id: "170dde7f ... 274d93baaf",
    date: "03/01/2021 14:49:12",
    sender: "DdaimCs1298xsaZA012dScaAcals",
    recipient: "DdaimCs1298xsaZA012dScaAcals",
    amount: "500",
}, {
    id: "170dde7f ... 274d93baaf",
    date: "03/01/2021 14:49:12",
    sender: "DdaimCs1298xsaZA012dScaAcals",
    recipient: "DdaimCs1298xsaZA012dScaAcals",
    amount: "500",
}, {
    id: "170dde7f ... 274d93baaf",
    date: "03/01/2021 14:49:12",
    sender: "DdaimCs1298xsaZA012dScaAcals",
    recipient: "DdaimCs1298xsaZA012dScaAcals",
    amount: "500",
}, {
    id: "170dde7f ... 274d93baaf",
    date: "03/01/2021 14:49:12",
    sender: "DdaimCs1298xsaZA012dScaAcals",
    recipient: "DdaimCs1298xsaZA012dScaAcals",
    amount: "500",
}, {
    id: "170dde7f ... 274d93baaf",
    date: "03/01/2021 14:49:12",
    sender: "DdaimCs1298xsaZA012dScaAcals",
    recipient: "DdaimCs1298xsaZA012dScaAcals",
    amount: "500",
}, {
    id: "170dde7f ... 274d93baaf",
    date: "03/01/2021 14:49:12",
    sender: "DdaimCs1298xsaZA012dScaAcals",
    recipient: "DdaimCs1298xsaZA012dScaAcals",
    amount: "500",
}, {
    id: "170dde7f ... 274d93baaf",
    date: "03/01/2021 14:49:12",
    sender: "DdaimCs1298xsaZA012dScaAcals",
    recipient: "DdaimCs1298xsaZA012dScaAcals",
    amount: "500",
}, {
    id: "170dde7f ... 274d93baaf",
    date: "03/01/2021 14:49:12",
    sender: "DdaimCs1298xsaZA012dScaAcals",
    recipient: "DdaimCs1298xsaZA012dScaAcals",
    amount: "500",
}]

export default function TransactionTable() {
    return (
        <div className="block-container">
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Sender</th>
                        <th>Recipient</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.map(
                        (row,index) => {
                            return (
                                <tr key={index}>
                                    <td><a href="#" target="_blank">{row.id}</a></td>
                                    <td>{row.date}</td>
                                    <td>{row.sender}</td>
                                    <td>{row.recipient}</td>
                                    <td>{row.amount} MINA</td>
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </Table>
        </div>
    )
}
