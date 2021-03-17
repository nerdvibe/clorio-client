import React from "react";
import { Row, Col } from "react-bootstrap";

export default function StakeTableValue(props) {
  return (
    <td className={props.className}>
      <div>
        <Row className="stake-row-value">
          {props.avatar && (
            <Col sm={3} lg={2} xl={2}>
              {props.avatar}
            </Col>
          )}
          <Col sm={9}>
            <p className="secondaryText no-bottom">{props.header}</p>
            <h5>{props.text}</h5>
          </Col>
        </Row>
      </div>
    </td>
  );
}
