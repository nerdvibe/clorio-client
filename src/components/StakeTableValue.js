import React from 'react'
import {Row,Col} from 'react-bootstrap'

export default function StakeTableValue(props) {
    return (
        <td className={props.className}>
            <span>
                <Row className="stake-row-value">
                    {props.avatar && (
                        <Col xs={2} lg={2} xl={2}>
                            {props.avatar}
                        </Col>
                    )}
                    <Col >
                        <p className="secondaryText no-bottom">{props.header}</p>
                        <h5>{props.text}</h5>
                    </Col>
                </Row>
            </span>
        </td>
    )
}
