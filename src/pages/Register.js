import React, { Component } from 'react'
import {Row,Col,Container} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Button from '../components/Button'
import Hoc from '../components/Hoc'
import {Copy} from 'react-feather'


export default class Register extends Component {
    copyToClipboard = (content) => {
        const el = document.createElement('textarea');
        el.value = content;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
    render() {
        return (
            <Hoc className="mx-auto">
                <div className="block-container real-full-page-container">
                    <div className="vertical-center">
                        <Row>
                            <Col md={4} xl={5} className="offset-md-3 offset-xl-3 text-center" >
                                <div className="mx-auto fit-content"><strong><h1>🔥 Crypto</h1></strong></div>
                                <div className="v-spacer" />
                                <div className="v-spacer" />
                                
                                <h4 className="full-width-align-center">This is your address</h4>
                                <div class="wrap-input1 validate-input" data-validate="Name is required">
                                    <h5 className="full-width-align-center">
                                        <strong>
                                            nNdajndANoandaNOnna9210j21nsKANo
                                        </strong>
                                    </h5>
                                </div>
                                <div className="v-spacer" />

                                <h4 className="full-width-align-center">This is your passphrase</h4>
                                <div class="wrap-input1 validate-input" data-validate="Name is required">
                                    <h5 className="full-width-align-center">
                                        <strong>
                                            witch collapse practice feed shame open despair creek road again ice least &nbsp;
                                            <Button className="inline-element" icon={<Copy />}  onClick={() => this.copyToClipboard("witch collapse practice feed shame open despair creek road again ice least")}/>
                                        </strong>
                                    </h5>
                                    <input style={{display: "none"}} value="" id="passphrase"/> 
                                </div>
                                <div className="v-spacer" />

                                <h4 className="full-width-align-center">This is your private key</h4>
                                <div class="wrap-input1 validate-input" data-validate="Name is required">
                                    <h5 className="full-width-align-center">
                                        <strong>
                                            aBUiadiaU219xSN8hska3j1ii3012i319jijdj1LLasdo
                                        </strong> 
                                    </h5>
                                </div>
                                <div className="v-spacer" />
                                <Row>
                                    <Col xs={6}>
                                        <Link to="/">
                                            <Button className="link-button mx-auto" onClick={this.props.register} text="Cancel" />
                                        </Link>
                                        
                                    </Col>
                                    <Col xs={6}>
                                        <Link to="/verify">
                                            <Button className="lightGreenButton__fullMono mx-auto" onClick={this.props.register} text="Continue" />
                                        </Link>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Hoc>
        )
    }
}
