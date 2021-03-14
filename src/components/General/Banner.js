import React from "react";
import { Row, Col } from "react-bootstrap";
import Button from "./Button";

export default function Banner(props) {

  function renderButtonStyle() {
    switch (props.style) {
      case "success":
        return "lightGreenButton__outlineMono ";
      case "warning":
        return "yellowButton__outlineMono ";
      default:
        return "lightGreenButton__outlineMono ";
        break;
    }
  }
  
  return (
    <div className="block-container">
      <Row>
        <Col md={8} lg={9} xl={9}>
          <h4>{props.title}</h4>
          <p>{props.subtitle}</p>
        </Col>
        <Col className="align-end ml-auto " style={{ paddingTop: "20px" }}>
          {props.link ? (
            <a href={props.link} target="_blank">
              <Button
                className={`${renderButtonStyle(props.cta_color)} mx-auto`}
                text={props.cta || "Learn more"}
              />
            </a>
          ) : (
            <Button
              className={`${renderButtonStyle(props.cta_color)} mx-auto`}
              text={props.cta || "Learn more"}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}
