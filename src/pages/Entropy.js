import React, { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import Hoc from "../components/Hoc";
import Logo from "../components/Logo";
import { Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import Footer from "../components/General/Footer";

export default function Entropy() {
  const [progress, setprogress] = useState(20);
  const genRanHex = (size) =>
    [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");

  return (
    <Hoc className="main-container center no-scroll">
      <div className="block-container no-bg real-full-page-container">
        <div className="vertical-center no-scroll" style={{ height: "50vh" }}>
          <Row className="vertical-center">
            <Col xs={6} className="offset-md-3 full-width-align-center">
              <Logo big={true} />
              <div className="v-spacer" />
              <h4 className="full-width-align-center strong">
                Here we go! <br />
                Move your mouse aroud to create random Bytes.
              </h4>
              <ProgressBar progress={progress} text={genRanHex(progress)} />
              <div className="v-spacer" />
              <Row>
                <Col>
                  <Button className="link-button" text="Go back" link={"/"} />
                </Col>
                <Col>
                  <Button
                    className="lightGreenButton__fullMono margin-auto"
                    text="Next step"
                    link={"/register-2"}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </Hoc>
  );
}
