import Hoc from "../components/UI/Hoc";
import Logo from "../components/UI/logo/Logo";
import { Row, Col } from "react-bootstrap";
import Button from "../components/UI/Button";

const NotFound = () => (
  <Hoc>
    <div className="block-container no-bg real-full-page-container center">
      <Row>
        <Col xs={12} className="full-width-align-center">
          <Logo big={true} />
          <div className="v-spacer" />
          <div className="huge-text">404</div>
          <div className="v-spacer" />
          <div className="big-text">Something went wrong</div>
          <h3 className="full-width-align-center">
            Better go back to the{" "}
            <Button className="inline-element" link="/" text="home page" />
          </h3>
        </Col>
      </Row>
    </div>
  </Hoc>
);

export default NotFound;
