import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "./Button";
import Logo from "./Logo";

export default function Homepage() {
  return (
    <div className="block-container no-bg real-full-page-container center no-margin">
      <Row>
        <Col xs={12} className="full-width-align-center">
          <div className="mx-auto fit-content">
            <Logo big={true} />
          </div>
          <div className="v-spacer" />
          <h4 className="full-width-align-center ">
            Access the power of the Mina Protocol Blockchain.
          </h4>
          <div className="v-spacer" />
          <Link to="/login">
            <Button
              className="lightGreenButton__fullMono mx-auto"
              text="Access with Private key"
            />
          </Link>
          <div className="v-spacer" />
          <Link to="/ledger">
            <Button
              className="lightGreenButton__fullMono mx-auto"
              text="Access with Ledger"
            />
          </Link>
          <div className="v-spacer" />
          <Link to="/register">
            <Button
              className="lightGreenButton__fullMono mx-auto"
              text="Create a wallet"
            />
          </Link>
        </Col>
      </Row>
    </div>
  );
}
