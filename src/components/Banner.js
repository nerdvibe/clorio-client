import React from 'react'
import {Row,Col} from 'react-bootstrap'
import { Link } from 'react-feather'
import Button from './Button'

export default function Banner(props) {
    return (
        <div className="block-container">
            <Row>
                <Col md={8} lg={9} xl={9}>
                    <h4>{props.title}</h4>
                    <p>{props.subtitle}</p>
                </Col>
                <Col className="align-end ml-auto " style={{paddingTop:'20px'}}>
                    {props.link ?
                        (<a href={props.link} target="_blank">
                            <Button onClick={() => console.log('Test')} className="lightGreenButton__outlineMono mx-auto" text="Learn more" />
                        </a>):
                        <Button onClick={() => console.log('Test')} className="lightGreenButton__outlineMono mx-auto" text="Learn more" />    
                    }
                </Col>
            </Row>
        </div>
    )
}
