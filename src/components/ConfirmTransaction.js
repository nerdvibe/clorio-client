import React from 'react'
import {Row,Col} from 'react-bootstrap'
import Button from './Button'

export default function ConfirmTransaction(props) {
    return (
        <div className="mx-auto  ">
            <div className="block-container full-page-container">
                <div className="vertical-center">
                    <div className="mx-auto fit-content"><strong><h2>Create new transaction</h2></strong></div>
                    <div className="v-spacer" />
                    <Row>
                        <Col md={8} className="offset-md-2" >
                            You are about to send <strong>{props.transactionData.amount} MINA</strong> <br/>
                            with a fee of <strong>{props.transactionData.fee} MINA</strong> <br/>
                            to  <strong>{props.transactionData.address}</strong> 
                            with memo  <strong>{props.transactionData.memo}</strong> 
                            <div className="v-spacer" />
                            <div className="mx-auto">
                                <Row>
                                    <Col md={3} className="offset-md-3">
                                        <Button className="link-button inline-element" onClick={props.stepBackward} text="Cancel" />
                                    </Col>
                                    <Col md={3}>
                                        <Button className="lightGreenButton__fullMono inline-element mx-auto" onClick={props.sendTransaction} text="Confirm" />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
