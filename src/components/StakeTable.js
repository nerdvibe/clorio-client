import React from 'react'
import  Button  from '../components/Button'
import { Table } from 'react-bootstrap'
import StakeTableValue from '../components/StakeTableValue'

export default function StakeTable(props) {
    return (
        <div className="mx-auto  ">
            <div className="block-container half-page-container">
                <div className="vertical-center">
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
                            {[1,2,3,4].map((el,index) => (
                                <tr>
                                    <td>
                                        <StakeTableValue avatar={(
                                            <div md={2} lg={2} xl={1} className="walletImageContainer small-image inline-element">
                                                <div className=""> 
                                                    <img className="small-walletImage" src="https://via.placeholder.com/100.png"/>
                                                </div>
                                            </div>)} header="Validator" text="test" />
                                    </td>
                                    <td>
                                        <StakeTableValue header={"Uptime"} text={"100%"} />
                                    </td>
                                    <td>
                                        <StakeTableValue header={"Commission"} text={"50%"} />
                                    </td>
                                    <td>
                                        <StakeTableValue header={"Staked"} text={"200 MINA"} />
                                    </td>
                                    <td>
                                        <Button className="yellowButton__fullMono" text="Delegate" onClick={() => props.toggleModal(index)}/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
