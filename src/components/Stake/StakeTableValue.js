import React from "react";
import { Row, Col } from "react-bootstrap";

export default function StakeTableValue(props) {

  if(props.avatar){
    return (
      <td className={props.className}>
        <div>
          <Row className="stake-row-value">
          <Col sm={12} className="small-screen-stake-table-text">
              <div className="inline-block-element">
              {props.avatar}
              </div>
              <div className="inline-block-element">
                <p className="secondaryText no-bottom">{props.header}</p>
                <h5>{props.text}</h5>
              </div>
            </Col>
          </Row>
        </div>
      </td>
    );
  }

  return (
    <td className={props.className}>
      <div>
        <Row className="stake-row-value">
          <Col sm={9} className="small-screen-stake-table-text">
            <p className="secondaryText no-bottom">{props.header}</p>
            <h5>{props.text}</h5>
          </Col>
        </Row>
      </div>
    </td>
  );
}
