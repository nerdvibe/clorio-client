import React from 'react'
import {Table} from 'react-bootstrap'
import Spinner from './General/Spinner'
import ErrorImage from '../assets/Error.svg'
import { useState } from 'react'


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

export default function TransactionTable(props) {
    const [page, setpage] = useState(1)
    const [maxPages, setMaxPages] = useState(30)
    const { loading, error, data } = props
    if(error){
        return (
            <div className="block-container-last">
                <div className="full-width padding-y-50">
                    <img src={ErrorImage} className="animate__animated animate__fadeIn"/>
                </div>
            </div>
        )
    }
    return (
        <div className="block-container-last">
            <Spinner className={"full-width"} show={loading}>
                <Table className="animate__animated animate__fadeIn">
                    <thead>
                        {renderTableHeader()}
                    </thead>
                    {
                        renderTableBody()
                    }
                </Table>
                {
                    renderPagination()
                }
            </Spinner>
        </div>
    )

    function renderTableHeader(){
        return (
            <tr className="th-background">
                <th className="th-first-item">ID</th>
                <th>Date</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th className="th-last-item">Amount</th>
            </tr>
        )
    }

    function renderRow(row,index) {
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

    function renderTableBody() {
        return(
            <tbody>
                {data && mockData.map((row,index) => {return renderRow(row,index)})}
            </tbody>
        )
    }

    function renderPagination() {
        const indexes = []
        for(let i=1; i<=maxPages; i++){
            indexes.push(i);
        }
        const indexToRender = () => {
            const indexToReturn = []
            let count = 0;
            if(page>2 && page <indexes.length-2){
                const tmpIndex = page-2
                while(count<5){
                    indexToReturn.push(tmpIndex+count)
                    count++
                }
            } else if(page<=2) {
                while(count<5){
                    indexToReturn.push(1+count)
                    count++
                }
            } else {
                const tmpFirstIndex = indexes.length-4
                while(count<5){
                    indexToReturn.push(tmpFirstIndex+count)
                    count++
                }
            }
            return indexToReturn
        }
        const changePage = (index) => {
            const lastIndex = indexes.length-1
            if(index>0 && index<=indexes[lastIndex]){
                setpage(index)
            }
        }
        const elements = indexToRender().map(index=>{
            return renderPaginationItem(index,changePage)
        })
        return(
            <div className="pagination">
                <p onClick={()=>changePage(page-1)}>&laquo;</p>
                {elements}
                <p onClick={()=>changePage(page+1)}>&raquo;</p>
            </div>
        )
    }

    function renderPaginationItem(index,change) {
        return <p 
            onClick={() => change(index)}
            className={page===index?"active":""}>
            {index}
        </p>
    }
}
