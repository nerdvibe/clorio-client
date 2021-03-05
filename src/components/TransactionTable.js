import React from 'react'
import {Table} from 'react-bootstrap'
import Spinner from './General/Spinner'
import ErrorImage from '../assets/Error.png'
import NoTransactionsOrNotAvailableImage from '../assets/NoTransactionsOrNotAvailable.svg'
import TxHistoryNotAvailableImage from '../assets/TxHistoryNotAvailable.svg'
import NoTransactions from '../assets/NoTransactions.svg'
import { useState } from 'react'
import { timestampToDate } from '../tools/utils';
import Big from 'big.js';

export default function TransactionTable(props) {
    const [page, setpage] = useState(1)
    const [maxPages, setMaxPages] = useState(30)
    const { loading, error, data } = props
    const mempool = props.mempool
    if(error || mempool.error){
        return renderError()
    }
    if(!data || data.user_commands.length===0){
        return renderEmptyState()
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
                    // renderPagination()
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
        const {timestamp,state_hash} = row.blocks_user_commands[0].block
        const amount = row.amount ? Big(row.amount).mul(1e-9).toFixed(3) : 0
        return (
            <tr key={index}>
                <td className="table-element"><a href={`https://minaexplorer.com/block/${state_hash}`} target="_blank">{row.hash}</a></td>
                <td className="table-element">{timestampToDate(timestamp)}</td>
                <td className="table-element">{row.publicKeyBySourceId.value}</td>
                <td className="table-element">{row.publicKeyByReceiverId.value}</td>
                <td className="table-element">{amount} MINA</td>
            </tr>
        )
    }

    function renderMempoolRow(row,index) {
        const state_hash = row.blocks_user_commands ? row.blocks_user_commands[0].block.state_hash : ""
        const amount = row.amount ? Big(row.amount).mul(1e-9).toFixed(3) : 0
        return (
            <tr key={index}>
                <td className="table-element"><a href={`https://minaexplorer.com/payment/${row.id}`} target="_blank">{row.id}</a></td>
                <td className="table-element">Waiting for confirmation</td>
                <td className="table-element">{row.source && row.source.publicKey}</td>
                <td className="table-element">{row.receiver && row.receiver.publicKey}</td>
                <td className="table-element">{amount} MINA</td>
            </tr>
        )
    }

    function renderTableBody() {
        return(
            <tbody>
                {mempool.data && mempool.data.mempool.map((row,index) => {return renderMempoolRow(row,index)})}
                {data && data.user_commands.map((row,index) => {return renderRow(row,index)})}
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
            key={index}
            onClick={() => change(index)}
            className={page===index?"active":""}>
            {index}
        </p>
    }

    function renderError(){
        const {balance} = props 
        let imageToRender = ErrorImage;
        if(balance === 0 ){ 
            imageToRender=NoTransactionsOrNotAvailableImage;
        } else if(balance > 0 ){ 
            imageToRender=TxHistoryNotAvailableImage;
        }
        return (
            <div className="block-container-last">
                <div className="full-width padding-y-50">
                    <img src={imageToRender} className="animate__animated animate__fadeIn"/>
                </div>
            </div>
        )
    }

    function renderEmptyState(){
        const {balance} = props 
        let imageToRender = NoTransactions;
        if(balance === 0 ){ 
            imageToRender=NoTransactionsOrNotAvailableImage;
        } else if(balance > 0 ){ 
            imageToRender=TxHistoryNotAvailableImage;
        }
        return (
            <div className="block-container-last">
                <div className="full-width padding-y-50">
                    <img src={imageToRender} className="animate__animated animate__fadeIn"/>
                </div>
            </div>
        )
    }
}
