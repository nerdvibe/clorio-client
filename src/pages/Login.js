import React from 'react'
import {Row,Col,Container} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Button from '../components/Button'
import Hoc from '../components/Hoc'
import Logo from "../components/Logo";
import Footer from '../components/General/Footer'
import { useState } from 'react'
import { storeSession } from '../tools'

export default function Login(props) {
    const [passphrase, setpassphrase] = useState("")
    const checkCredentials = () => {
        storeSession("this is a custom address",passphrase)
    }
    
    return (
        <Hoc>
            <div className="block-container real-full-page-container center">
                <div className="full-width">
                    <Row>
                        <Col md={4} xl={6} className="offset-md-3 offset-xl-3 text-center" >
                            <div className="mx-auto fit-content"><Logo big="true" /></div>
                            <div className="v-spacer" />
                            
                            <h4 className="full-width-align-center">Sign in with your passphrase</h4>
                            <h6 className="full-width-align-center">Don't have an account? <Link to="/register"><Button className="link-button inline-element" onClick={props.register} text="Sign-in" /></Link></h6>
                            <div className="v-spacer" />
                            <div className="v-spacer" />
                            <div className="wrap-input1 validate-input" data-validate="Name is required">
                                <span className="icon" />
                                <input className="input1" type="text" name="name" onChange={(e)=>setpassphrase(e.currentTarget.value)} placeholder="Enter here" />
                                <span className="shadow-input1"></span>
                            </div>
                            <div className="v-spacer" />
                            <Row>
                                <Col xs={6}>
                                    <Link to="/">
                                        <Button className="link-button mx-auto" onClick={props.register} text="Cancel" />
                                    </Link>
                                    
                                </Col>
                                <Col xs={6}>
                                    <Link to="/overview">
                                        <Button className="lightGreenButton__fullMono mx-auto" onClick={checkCredentials} text="Access a wallet" />
                                    </Link>
                                </Col>
                            </Row>
                            <div className="v-spacer" />
                            <div className="v-spacer" />
                            <Link to="/ledger">
                                <Button className="link-button mx-auto" onClick={props.register} text="Login through a hardware wallet" />
                            </Link>
                        </Col>
                    </Row>
                </div> 
            </div>
            <Footer />
        </Hoc>
    )
}
