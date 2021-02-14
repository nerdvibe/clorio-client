import React,{useState} from 'react'
import  Button  from '../components/Button'
import { Table } from 'react-bootstrap'
import StakeTableValue from '../components/StakeTableValue'

export default function StakeTable(props) {
    const [searchbox, setSearchbox] = useState("")
    const [page, setpage] = useState(1)
    const [maxPages, setMaxPages] = useState(30)

    const searchboxHandler = (search) => {
        setSearchbox(search.toLowerCase())
    }

    return (
        <div className="mx-auto  ">
            <div className="block-container-last  py-50">
                <div> 
                    <h4>Your status</h4>
                    <h6 className="full-width-align-left">Your are staking for None</h6>
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
                        <tbody>
                            {["Prova","Test","asdasd","xdxd"].filter(el=>el.toLowerCase().includes(searchbox)).map((el,index) => renderRow(el,index))}
                        </tbody>
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
                            <img className="small-walletImage" src="https://via.placeholder.com/100.png"/>
                        </div>
                    </div>)} header="Validator" text={el} />
                <StakeTableValue header={"Uptime"} text={"100%"} />
                <StakeTableValue header={"Commission"} text={"50%"} />
                <StakeTableValue header={"Staked"} text={"200 MINA"} />
                <td>
                    <Button className="yellowButton__fullMono" text="Delegate" onClick={() => props.toggleModal(el)}/>
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
