import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function Form(props) {
    return (
        <div className="mx-auto  ">
            <div className="block-container full-page-container">
                <div className="vertical-center">
                    <div className="mx-auto fit-content"><strong><h2>Create new transaction</h2></strong></div>
                    <div className="v-spacer" />
                    <Row>
                        <Col md={8} className="offset-md-2" >
                            You are about to send <strong>500 MINA</strong> <br/>
                            with a fee of <strong>0.100 MINA</strong> <br/>
                            to  <strong>1CwYRA3H1HAVXBd7tjgjgmi856jvSGey9K</strong> 
                            <div className="v-spacer" />
                            <div className="mx-auto">
                                <Row>
                                    <Col md={3} className="offset-md-3">
                                        <div className="link-button inline-element" onClick={props.stepBackward}>Cancel</div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="lightGreenButton__fullMono inline-element" onClick={props.sendTransaction}>Confirm</div>
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
