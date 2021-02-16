import React,{useState} from 'react'
import  Button  from '../components/Button'
import { Table } from 'react-bootstrap'
import StakeTableValue from '../components/StakeTableValue'
import Spinner from './General/Spinner'
import Avatar from '../tools/avatar'

export default function StakeTable(props) {
    const [searchbox, setSearchbox] = useState("")
    const [page, setpage] = useState(1)
    const [maxPages, setMaxPages] = useState(1)

    const searchboxHandler = (search) => {
        setSearchbox(search.toLowerCase())
    }

    return (
        <div className="mx-auto  ">
            <div className="block-container-last  py-50">
                <div> 
                    <h4>Your status</h4>
                    <h6 className="full-width-align-left">Your are staking for {props.currentDelegate || "None"}</h6>
                    <div className="v-spacer" />
                    
                    <Table>
                        <thead>
                            <tr className="th-background">
                                <th className="th-first-item">Stake</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th className="th-last-item">
                                    <input className="table-searchbar" placeholder={"Filter..."} value={searchbox} onChange={(e) => searchboxHandler(e.currentTarget.value)} />
                                </th>
                            </tr>
                        </thead>
                        {renderTableBody()}
                    </Table>
                    {renderPagination()}
                </div>
            </div>
        </div>
    )

    function renderRow(el,index) {
        return(
            <tr key={index}>
                <StakeTableValue avatar={(
                    <div className="walletImageContainer small-image inline-element">
                        <div className=""> 
                            {el.image ? <img className="small-walletImage" src={el.image}/> : <Avatar address={el.publicKey} size="30" />}
                        </div>
                    </div>)} header="Validator" text={el.name} />
                <StakeTableValue header={"Uptime"} text={"100%"} />
                <StakeTableValue header={"Commission"} text={`${el.fee}%`} />
                <StakeTableValue header={"Staked"} text={"200 MINA"} />
                <td>
                    <Button className="yellowButton__fullMono" text="Delegate" onClick={() => props.toggleModal(el.name)}/>
                </td>
            </tr>
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
            let breakCondition = false
            if(page>2 && page <indexes.length-2){
                const tmpIndex = page-2
                while(count<5 && !breakCondition){
                    if(tmpIndex+count<=maxPages){
                        indexToReturn.push(tmpIndex+count)
                        count++
                    } else {
                        breakCondition = true
                    }
                }
            } else if(page<=2) {
                while(count<5 && !breakCondition){
                    if(1+count<=maxPages){
                        indexToReturn.push(1+count)
                        count++
                    } else {
                        breakCondition = true
                    }
                }
            } else {
                const tmpFirstIndex = indexes.length-4
                while(count<5 && !breakCondition){
                    if(tmpFirstIndex+count<=maxPages){
                        indexToReturn.push(tmpFirstIndex+count)
                        count++
                    } else {
                        breakCondition = true
                    }
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

    function renderTableBody() {
        if(props.validators.error){
            return (
                <div className="block-container-last">
                    <div className="full-width padding-y-50">
                        <img src={ErrorImage} className="animate__animated animate__fadeIn"/>
                    </div>
                </div>
            )
        }
        if(props.validators.data && props.validators.data.validators){
            const filteredValidators = props.validators.data.validators.filter(el=>el.name.toLowerCase().includes(searchbox))
            return (<tbody>
                {filteredValidators.map((el,index) => renderRow(el,index))}
            </tbody>)
        }
        return(
            <Spinner className={"full-width"} show={props.validators.loading}>
                <tbody />
            </Spinner>
        )
    }
}
