import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function Wallet() {
    return (
        <div className="block-container">
            <Row>
                <Col md={2} lg={2} xl={1} className="walletImageContainer">
                    <div className="walletImageOutline"> 
                        <img className="walletImage" src="https://via.placeholder.com/100.png"/>
                    </div>
                </Col>
                <Col xs={10}>
                    <Row>
                        <Col xs={12}>
                            <h6 className="secondaryText">This is your address</h6> <br />
                            <h4>1CwYRA3H1HAVXBd7tjgjgmi856jvSGey9K</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={2} lg={3}>
                            <h6 className="secondaryText">Your balance</h6> <br />
                            <h5>1.2313219 ETH</h5>
                        </Col>
                        <Col >
                            <Row>
                                <Col sm={1} xl={1}>
                                    <div className="v-div"/>
                                </Col>
                                <Col>
                                    <span>
                                        <h6 className="secondaryText">Apx balance</h6> <br />
                                        <h5>1.2313219 BTC</h5>
                                    </span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
