import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "../components/General/Button";
import Hoc from "../components/General/Hoc";
import Logo from "../components/General/Logo";
import Footer from "../components/General/Footer";

export default function Ledger(props) {
  return (
    <Hoc>
      <div className="block-container real-full-page-container center">
        <div className="full-width">
          <Row>
            <Col md={4} xl={6} className="offset-md-3 offset-xl-3 text-center">
              <div className="mx-auto fit-content">
                <Logo big="true" />
              </div>
              <div className="v-spacer" />
              <div className="v-spacer" />
              <div className="v-spacer" />

              <h4 className="full-width-align-center">
                Connect now your hardware wallet
              </h4>
              <div className="v-spacer" />
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="v-spacer" />
              <h6 className="full-width-align-center">Looking for devices</h6>
              <div className="v-spacer" />
              <Link to="/login">
                <Button className="link-button mx-auto" text="Go back" />
              </Link>
            </Col>
          </Row>
        </div>
      </div>
      <Footer network={props.network} />
    </Hoc>
  );
}
