import React, { Component } from 'react';
import {Row,Col,Container} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom';
import Button from '../components/Button';
import Hoc from '../components/Hoc';
import {Copy} from 'react-feather';
import Logo from "../components/Logo";
import Footer from '../components/General/Footer'
import * as CodaSDK from "@o1labs/client-sdk";
import { storeSession } from '../tools';
import { copyToClipboard } from '../tools/utils';


export default function Register (props) {
    const history = useHistory();
    
    const keys = CodaSDK.genKeys();
    const privateKey = keys.privateKey;
    const publicKey = keys.publicKey;
    

    const setAuthorization = () => {
        props.setLoader()
        storeSession(publicKey,()=>{
            history.push("/overview");
        })
    }
    
    return (
        <Hoc className="main-container ">
            <div className="block-container no-bg real-full-page-container center">
                <Row>
                    <Col md={10} xl={8} className="offset-md-1 offset-xl-2 text-center" >
                        <div className="mx-auto fit-content"><Logo big={true} /></div>
                        <div className="v-spacer no-print" />
                        
                        <h4 className="full-width-align-center">This is your address</h4>
                        <div className="wrap-input1 validate-input" data-validate="Name is required">
                            <h5 className="full-width-align-center">
                                {publicKey}
                                <Button className="inline-element no-print"  icon={<Copy />}  onClick={() => copyToClipboard(publicKey)}/>
                            </h5>
                        </div>
                        <div className="v-spacer" />

                        {/* <h4 className="full-width-align-center">This is your passphrase</h4>
                            <div className="wrap-input1 validate-input" data-validate="Name is required">
                                <h5 className="full-width-align-center">
                                    witch collapse practice feed shame open despair creek road again ice least &nbsp;
                                    <Button className="inline-element no-print" icon={<Copy />}  onClick={() => this.copyToClipboard("witch collapse practice feed shame open despair creek road again ice least")}/>
                                </h5>
                                <input style={{display: "none"}} value="" id="passphrase"/> 
                            </div>
                        <div className="v-spacer" /> */}

                        <h4 className="full-width-align-center">This is your private key</h4>
                        <div className="wrap-input1 validate-input">
                            <h5 className="full-width-align-center">
                                {privateKey}
                                <Button className="inline-element no-print" icon={<Copy />}  onClick={() => copyToClipboard(privateKey)}/>
                            </h5>
                        </div>
                        <div className="wrap-input1 validate-input no-print" data-validate="Name is required">
                            <p className="full-width-align-center">
                                This is the only time you will see the passphrase and the private key.
                                Make sure have made a copy of them. If you loose your private key you will not be able to access your funds anymore! <br />
                                <a className="link-button" onClick={()=>window.print()}>
                                    Download a copy here
                                </a>
                            </p>
                        </div>
                        <div className="v-spacer" />
                        <Row className="no-print">
                            <Col xs={4}>
                                <Link to="/">
                                    <Button className="link-button mx-auto" text="Cancel" />
                                </Link>
                                
                            </Col>
                            <Col xs={4}>
                                <Link to="/register">
                                    <Button className="link-button mx-auto" text="Generate new key" />
                                </Link>
                                
                            </Col>
                            <Col xs={4}>
                                <Link to="/overview">
                                    <Button className="lightGreenButton__fullMono mx-auto" onClick={setAuthorization} text="Continue" />
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
