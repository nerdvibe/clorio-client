import React, { Component } from 'react'
import {Row,Col,Container} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Button from '../components/Button'
import Hoc from '../components/Hoc'
import {Copy} from 'react-feather'
import Logo from "../components/Logo";
import Footer from '../components/General/Footer'


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
            <Hoc className="main-container">
                <div className="block-container real-full-page-container">
                    <Row>
                        <Col md={10} xl={6} className="offset-md-1 offset-xl-3 text-center" >
                            <div className="mx-auto fit-content"><Logo big={true} /></div>
                            <div className="v-spacer" />
                            
                            <h4 className="full-width-align-center">This is your address</h4>
                            <div className="wrap-input1 validate-input" data-validate="Name is required">
                                <h5 className="full-width-align-center">
                                    <strong>
                                        nNdajndANoandaNOnna9210j21nsKANo
                                    </strong>
                                </h5>
                            </div>
                            <div className="v-spacer" />

                            <h4 className="full-width-align-center">This is your passphrase</h4>
                            <div className="wrap-input1 validate-input" data-validate="Name is required">
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
                            <div className="wrap-input1 validate-input">
                                <h5 className="full-width-align-center">
                                    <strong>
                                        aBUiadiaU219xSN8hska3j1ii3012i319jijdj1LLasdo
                                    </strong> 
                                </h5>
                            </div>
                            <div className="wrap-input1 validate-input" data-validate="Name is required">
                                <p className="full-width-align-center">
                                    This is the only time you will see the passphrase and the private key.
                                    Make sure have made a copy of them. If you loose your mnemonic phrase you will not be able to access your funds anymore! 
                                    <a className="link-button">
                                        Download a copy here
                                    </a>
                                </p>
                            </div>
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
                    <Footer />
                </div>
            </Hoc>
        )
    }
}
