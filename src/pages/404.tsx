import Hoc from "../components/general/Hoc";
import Logo from "../components/general/Logo";
import { Row, Col } from "react-bootstrap";
import Button from "../components/general/Button";

const NotFound = () => {
  return (
    <Hoc>
      <div className="block-container no-bg real-full-page-container center">
        <Row>
          <Col xs={12} className="full-width-align-center">
            <Logo big={true} />
            <div className="v-spacer" />
            <div className="huge-text">404</div>
            <div className="v-spacer" />
            <div className="big-text">Something went wrong</div>
            <h3 style={{ textAlign: "center", width: "100%" }}>
              Better go back to a{" "}
              <Button className="inline-element" link="/" text="safe place" />
            </h3>
          </Col>
        </Row>
      </div>
    </Hoc>
  );
}

export default NotFound;