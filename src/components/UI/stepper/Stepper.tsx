import React from "react";
import { Col, Row } from "react-bootstrap";

export const Stepper = () => {
  return (
    <Row>
      <Col>
        <div className="wrapper-progressBar">
          <ul className="progressBar">
            <li className="active">Compile</li>
            <li className="">Confirm</li>
            <li className="">Broadcast</li>
          </ul>
        </div>
      </Col>
    </Row>
  );
};
