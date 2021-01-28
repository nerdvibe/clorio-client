import React from 'react'
import {Row,Col,Container} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Hoc from '../components/Hoc'

export default function Homepage(props) {
    return (
        <div className="mx-auto  ">
            <div className="block-container real-full-page-container">
                <div className="vertical-center">
                <Row>
                <Col md={4} xl={3} className="offset-md-4 offset-xl-4" >
                    <div className="mx-auto fit-content"><strong><h1>🔥 Crypto</h1></strong></div>
                    <div className="v-spacer" />
                            <h4 className="text-center">The blockchain power at your fingertips</h4>
                            <div className="v-spacer" />
                            <Link to="/login">
                                <Button className="lightGreenButton__fullMono mx-auto" onClick={props.login} text="Access a wallet" />
                            </Link>
                            <div className="v-spacer" />
                            <Link to="/register">
                                <Button className="lightGreenButton__fullMono mx-auto" onClick={props.register} text="Create a wallet" />
                            </Link>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )

    
}
