import React from 'react'
import {Row,Col,Container} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Button from '../components/Button'
import Hoc from '../components/Hoc'

export default function Login(props) {
    return (
        <Hoc className="mx-auto">
            <div className="block-container real-full-page-container">
                <div className="vertical-center">
                    <Row>
                        <Col md={4} xl={5} className="offset-md-3 offset-xl-3 text-center" >
                            <div className="mx-auto fit-content"><strong><h1>🔥 Crypto</h1></strong></div>
                            <div className="v-spacer" />
                            <div className="v-spacer" />
                            
                            <h4 className="full-width-align-center">Insert your mnemonic</h4>
                            <div className="v-spacer" />
                            <div class="wrap-input1 validate-input" data-validate="Name is required">
                                <span className="icon" />
                                <input className="input1" type="text" name="name" placeholder="Enter here" />
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
                                        <Button className="lightGreenButton__fullMono mx-auto" onClick={props.register} text="Access a wallet" />
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
