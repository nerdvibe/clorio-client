import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Hash, Server, Tool, Edit2, Save, Anchor } from "react-feather";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/UI/Button";
import Hoc from "../components/UI/Hoc";
import Input from "../components/UI/input/Input";

const Settings = () => {
  const history = useHistory();
  const [showEditEndpoint, setShowEditEndpoint] = useState<boolean>(false);
  const currentEndpoint: string | undefined =
    localStorage.getItem("custom-endpoint") || process.env.REACT_APP_GQL_SERVER;
  const [endpoint, setEndpoint] = useState<string>(currentEndpoint || "");

  /**
   * Set the new endpoint inside the local storage and reload the application
   */
  const setNewEndpoint = (value?: string) => {
    if (value && value !== "" && value !== currentEndpoint) {
      localStorage.setItem("custom-endpoint", value);
      toast.success("Endpoint changed, reloading the application");
      setTimeout(() => {
        history.replace("/");
        location.reload();
      }, 1000);
    }
    setShowEditEndpoint(false);
  };

  return (
    <Hoc className="main-container block-container animate__animated animate__fadeIn selectable-text">
      <h3 className="full-width-align-center">
        <Tool /> Settings
      </h3>
      <div>
        <h4>
          <Hash />
          Clorio version
        </h4>
        <h5 className="light">
          Current version : Clorio {process.env.REACT_APP_VERSION}
        </h5>
        <hr />
        <Row>
          <Col>
            <h4>
              <Server /> Current node
            </h4>
          </Col>
          <Col className="align-end">
            {showEditEndpoint ? (
              <Button
                onClick={() => setNewEndpoint(endpoint)}
                text="Save"
                icon={<Save />}
                className="link-button inline-element"
              />
            ) : (
              <Button
                onClick={() => setShowEditEndpoint(!showEditEndpoint)}
                text="Edit"
                icon={<Edit2 />}
                className="link-button inline-element"
              />
            )}
            <Button
              onClick={() => setNewEndpoint(process.env.REACT_APP_GQL_SERVER)}
              text="Default"
              icon={<Anchor />}
              className="link-button inline-element"
            />
          </Col>
        </Row>
        {showEditEndpoint ? (
          <Input
            inputHandler={(event) => {
              setEndpoint(event.target.value);
            }}
            placeholder={endpoint}
            className="animate__animated animate__fadeIn"
          />
        ) : (
          <h5 className="light animate__animated animate__fadeIn selectable-text">
            {endpoint}
          </h5>
        )}
      </div>
    </Hoc>
  );
};

export default Settings;
