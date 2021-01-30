import React from 'react'
import {Row,Col} from 'react-bootstrap'
import Button from '../components/Button'
import {Copy} from 'react-feather'

export default function Wallet() {
    function copyToClipboard (content) {
        const el = document.createElement('textarea');
        el.value = content;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
    return (
        <div className="block-container">
            <Row>
                    <div className="inline-element walletImageContainer">
                        <div className="walletImageOutline"> 
                            <img className="walletImage" src="https://via.placeholder.com/100.png"/>
                        </div>
                    </div>
                    <div className="inline-element">
                        <Row>
                            <Col xs={12}>
                                <h6 className="secondaryText">This is your address</h6>
                                <h4>
                                    1CwYRA3H1HAVXBd7tjgjgmi856jvSGey9K &nbsp;
                                    <Button className="inline-element" icon={<Copy />}  onClick={() => copyToClipboard("1CwYRA3H1HAVXBd7tjgjgmi856jvSGey9K")}/>
                                </h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={5}>
                                <h6 className="secondaryText">Your balance</h6> 
                                <h5>1.2313219 ETH</h5>
                            </Col>
                            <Col >
                                <Row>
                                    <Col sm={1} xl={1}>
                                        <div className="v-div"/>
                                    </Col>
                                    <Col>
                                        <span>
                                            <h6 className="secondaryText">Apx balance</h6>
                                            <h5>1.2313219 BTC</h5>
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
            </Row>
        </div>
    )
}
