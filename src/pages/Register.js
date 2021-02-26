import React, { useState,useEffect } from 'react';
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
import Input from '../components/Input';


export default function Register (props) {
    const [validation, setValidation] = useState(false)
    const [keys, setKeys] = useState(undefined)
    const [validationText, setValidationText] = useState("")
    const history = useHistory();
    const privateKey = keys ? keys.privateKey : "";
    const publicKey = keys ? keys.publicKey : "";
    
    useEffect(() => {
        if(!keys){
            const keys = CodaSDK.genKeys();
            setKeys(keys);
        }
    }, [keys])
    
    
    return (
        <Hoc className="main-container ">
            <div className="block-container no-bg real-full-page-container center">
                {
                    validation?
                    renderValidationStep():
                    renderRegisterStep()
                }
                <Footer />
            </div>
        </Hoc>
    )

    function renderRegisterStep(){
        return(
            <Row className="full-width">
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
                    <div className="v-spacer" />
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
                            <Button 
                                className="link-button mx-auto" 
                                text="Generate new key" 
                                onClick={generateNew}/>
                            
                        </Col>
                        <Col xs={4}>
                            <Button 
                                className="lightGreenButton__fullMono mx-auto" 
                                onClick={()=>setValidation(true)} 
                                text="Continue" />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }

    function renderValidationStep(){
        return(
            <div className="full-width">
                <div className="mx-auto medium-size-box" >
                    <div className="mx-auto fit-content"><Logo big={true} /></div>
                    <div className="v-spacer no-print" />
                    <div className="v-spacer" />
                    <h4 className="full-width-align-center">Verify your Private key</h4>
                    <div className="v-spacer" />
                    <div className="wrap-input1 validate-input">
                        <h5 className="full-width-align-center">
                            <Input
                                inputHandler={(e)=>inputHandler(e.currentTarget.value)}
                                placeholer="Private key"
                            />
                        </h5>
                    </div>
                    <div className="v-spacer" />
                    <Row className="no-print">
                        <Col xs={6}>
                            <Button 
                                className="link-button mx-auto" 
                                text="Cancel"
                                onClick={stepBackwards} />
                        </Col>
                        <Col xs={6}>
                            <Button 
                                className="lightGreenButton__fullMono mx-auto" 
                                onClick={setAuthorization} 
                                text="Continue" 
                                disabled={checkButtonState()}
                                link="/overview"
                                />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }

    function inputHandler(text){
        setValidationText(text)
    }

    function checkButtonState(){
        if(validationText===keys.privateKey){
            return false
        }
        return true
    }

    function setAuthorization(){
        props.setLoader()
        storeSession(publicKey,()=>{
            history.push("/overview");
        })
    }

    function generateNew(){
        setKeys(undefined)
    }
    
    function stepBackwards() {
        setValidationText(undefined)
        setValidation(false);
    }
}

