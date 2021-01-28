import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function Banner() {
    return (
        <div className="block-container">
            <Row>
                <Col md={10}>
                    <h4>Learn more about Mina</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                </Col>
                <Col md={2}>
                    <div onClick={() => console.log('Test')} className="lightGreenButton__outlineMono"> Learn more </div>
                </Col>
            </Row>
        </div>
    )
}
