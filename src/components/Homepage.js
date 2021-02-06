import React from 'react'
import {Row,Col,Container} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Logo from './Logo'

export default function Homepage(props) {
    return (
        <div className="mx-auto  ">
            <div className="v-spacer" />
            <div className="block-container real-full-page-container">
                <Row>
                    <Col xs={10} className="offset-md-1 full-width-align-center">
                    <div className="mx-auto fit-content">
                        <Logo big={true} />
                    </div>
                    <div className="v-spacer" />
                            <h4 className="full-width-align-center ">The blockchain power at your fingertips</h4>
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
    )

    
}
