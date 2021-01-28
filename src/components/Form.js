import React from 'react'
import {Row,Col,Container} from 'react-bootstrap'

export default function Form(props) {
    return (
        <div className="mx-auto  ">
            <div className="block-container full-page-container">
                <div className="vertical-center">
                    <div className="mx-auto fit-content"><strong><h2>Create new transaction</h2></strong></div>
                    <div className="v-spacer" />
                    <Row>
                        <Col md={8} className="offset-md-2" >
                            <h3>Recipient</h3>
                            <div class="wrap-input1 validate-input" data-validate="Name is required">
                                <span className="icon" />
                                <input class="input1" type="text" name="name" placeholder="Recipient address ... " />
                                <span class="shadow-input1"></span>
                            </div>
                            <Row> 
                                <Col md={6}>
                                    <h3>Amount</h3>
                                    <div class="wrap-input1 validate-input" data-validate="Name is required">
                                        <span className="icon" />
                                        <input class="input1" type="text" name="name" placeholder="Enter an amount " />
                                        <span class="shadow-input1"></span>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <Row> 
                                        <Col md={6} className="align-initial">
                                            <h3 className="inline-element ">Fee</h3>
                                        </Col>
                                        <Col md={6} className="fee-label">
                                            <span className="align-end">Use recommended</span>
                                        </Col>
                                    </Row>
                                    <div class="wrap-input1 validate-input" data-validate="Name is required">
                                        <span className="icon" />
                                        <input class="input1" type="text" name="name" placeholder="Enter a fee" />
                                        <span class="shadow-input1"></span>
                                    </div>
                                </Col>
                            </Row>
                            <div className="v-spacer" />
                            <div className="lightGreenButton__fullMono mx-auto" onClick={props.nextStep}>Preview</div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
