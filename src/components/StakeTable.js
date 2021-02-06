import React from 'react'
import  Button  from '../components/Button'
import { Table } from 'react-bootstrap'
import StakeTableValue from '../components/StakeTableValue'

export default function StakeTable(props) {
    return (
        <div className="mx-auto  ">
            <div className="block-container full-page-container">
                <div> 
                    <h4>Your status</h4>
                    <h6 className="full-width-align-left">Your are staking for None</h6>
                    <div className="v-spacer" />
                    
                    <Table>
                        <thead>
                            <tr>
                                <th>Stake</th>
                                <th></th>
                                <th></th>
                                <th>Search</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1,2,3,4].map((el,index) => renderRow(el,index))}
                        </tbody>
                    </Table>
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
                    </div>)} header="Validator" text="test" />
                <StakeTableValue header={"Uptime"} text={"100%"} />
                <StakeTableValue header={"Commission"} text={"50%"} />
                <StakeTableValue header={"Staked"} text={"200 MINA"} />
                <td>
                    <Button className="yellowButton__fullMono" text="Delegate" onClick={() => props.toggleModal(index)}/>
                </td>
            </tr>
        )
    }
}
