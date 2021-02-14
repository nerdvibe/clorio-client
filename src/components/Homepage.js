import React from 'react'
import {Row,Col,Container} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Logo from './Logo'

export default function Homepage(props) {
    return (
        <div className="block-container no-bg real-full-page-container center">
            <Row>
                <Col xs={10} className="offset-md-1 full-width-align-center">
                    <div className="mx-auto fit-content">
                        <Logo big={true} />
                    </div>
                    <div className="v-spacer" />
                    <h4 className="full-width-align-center ">The blockchain power at your fingertips</h4>
                    <div className="v-spacer" />
                        <Link to="/login">
                            <Button className="lightGreenButton__fullMono mx-auto" text="Access a wallet" />
                        </Link>
                        <div className="v-spacer" />
                        <Link to="/register">
                            <Button className="lightGreenButton__fullMono mx-auto" text="Create a wallet" />
                        </Link>
                    </Col>
                </Row>
        </div>
    )
}
