import React from 'react'
import {Row,Col} from 'react-bootstrap'
import Button from './Button'

export default function TransactionForm(props) {
    return (
        <div className="mx-auto  ">
            <div className="block-container fit-content-container">
                <div className="transaction-form">
                    <div className="mx-auto fit-content"><strong><h2>Create new transaction</h2></strong></div>
                    <div className="v-spacer" />
                    <Row>
                        <Col md={8} className="offset-md-2" >
                            <h3>Recipient</h3>
                            <div className="wrap-input1 validate-input" data-validate="Name is required">
                                <span className="icon" />
                                <input className="input1" type="text" name="address" value={props.transactionData.address} placeholder="Recipient address ... " onChange={e => addressHandler(e.currentTarget.value)} />
                                <span className="shadow-input1"></span>
                            </div>
                            <Row> 
                                <Col md={6}>
                                    <h3>Amount</h3>
                                    <div className="wrap-input1 validate-input" data-validate="Name is required">
                                        <span className="icon" />
                                        <input className="input1" type="text" name="amount" value={props.transactionData.amount} placeholder="Enter an amount " onChange={e => amountHandler(e.currentTarget.value)} />
                                        <span className="shadow-input1"></span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Row> 
                                        <Col md={4} className="align-initial">
                                            <h3 className="inline-element ">Fee</h3>
                                        </Col>
                                        <Col className="fee-label">
                                            <Button className="link-button align-end  no-padding" text="Average" onClick={setDefaultFee} />
                                        </Col>
                                        <Col className="fee-label">
                                            <Button className="link-button align-end  no-padding" text="Fast" onClick={setFastFee} />
                                        </Col>
                                    </Row>
                                    <div className="wrap-input1 validate-input" data-validate="Name is required">
                                        <span className="icon" />
                                        <input className="input1" type="text" name="name"  value={props.transactionData.fee} onChange={e => feeHandler(e.currentTarget.value)} placeholder="Enter a fee" />
                                        <span className="shadow-input1"></span>
                                    </div>
                                </Col>
                            </Row>
                            <div className="v-spacer" />
                            <Button className="lightGreenButton__fullMono mx-auto" onClick={props.nextStep} text="Preview" />
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )

    function setDefaultFee(){
        if(props.defaultFee){
            props.setData({
                ...props.transactionData,
                fee:props.defaultFee
            })
        }
    }

    function setFastFee(){
        if(props.fastFee){
            props.setData({
                ...props.transactionData,
                fee:props.fastFee
            })
        }
    }

    function addressHandler(address){
        props.setData({
            ...props.transactionData,
            address
        })
    }

    function amountHandler(amount){
        props.setData({
            ...props.transactionData,
            amount
        })
    }

    function feeHandler(fee){
        props.setData({
            ...props.transactionData,
            fee
        })
    }
}
