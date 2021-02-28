import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function ConfirmLedgerTransaction(props) {
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
                            <div className="v-spacer" />
                            <div className="mx-auto">
                                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                            </div>
                            <strong>Check your hardware wallet to proceed</strong> 
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
