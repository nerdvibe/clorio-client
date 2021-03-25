import React from "react";
import { Row, Col } from "react-bootstrap";
import appendQuery from "append-query";

export default function StakeTableValue(props) {
  if (props.avatar) {
    return (
      <td className={props.className}>
        <div>
          <Row className="stake-row-value">
            <Col sm={12} className="small-screen-stake-table-text">
              <div className="inline-block-element">{props.avatar}</div>
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

  if (props.header.toLowerCase() === "info") {
    return (
      <td className={props.className}>
        <div>
          <Row className="stake-row-value">
            <Col sm={9} className="small-screen-stake-table-text">
              <p className="secondaryText no-bottom">{props.header}</p>
              {props.website ? (
                <a
                  href={appendQuery(props.website, { ref: "clorio" })}
                  target="_blank"
                  rel="noreferrer"
                >
                  {props.text}
                </a>
              ) : null}
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
