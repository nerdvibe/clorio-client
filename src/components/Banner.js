import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function Banner() {
    return (
        <div className="block-container">
            <Row>
                <Col md={8} lg={9} xl={9}>
                    <h4>Learn more about Mina</h4>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
                </Col>
                <Col className="align-end ml-auto " style={{paddingTop:'20px'}}>
                    <div onClick={() => console.log('Test')} className="lightGreenButton__outlineMono mx-auto"> Learn more </div>
                </Col>
            </Row>
        </div>
    )
}
