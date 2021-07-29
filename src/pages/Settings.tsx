import { useState } from "react";
import { Col, Collapse, Row } from "react-bootstrap";
import {
  Hash,
  Server,
  Tool,
  Edit2,
  Save,
  Anchor,
  ArrowUpCircle,
} from "react-feather";
import { useHistory } from "react-router";
import Button from "../components/UI/Button";
import Hoc from "../components/UI/Hoc";
import Input from "../components/UI/input/Input";
import { deriveAccountFromMnemonic } from "../tools";
import { toast } from "react-toastify";

const Settings = () => {
  const history = useHistory();
  const [showEditEndpoint, setShowEditEndpoint] = useState<boolean>(false);
  const currentEndpoint: string | undefined =
    localStorage.getItem("custom-endpoint") || process.env.REACT_APP_GQL_SERVER;
  const [endpoint, setEndpoint] = useState<string>(currentEndpoint || "");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");

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

  const exportPrivateKey = async () => {
    try {
      const wallet = await deriveAccountFromMnemonic(mnemonic);
      setPrivateKey(wallet?.priKey);
    } catch (error: any) {
      toast.error(error.message);
      setPrivateKey("");
    }
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
        <hr />
        <h4>
          <ArrowUpCircle />
          {"  "}
          Export Private key
        </h4>
        <Row>
          <Col xs={10}>
            <Input
              inputHandler={(event) => {
                setMnemonic(event.target.value);
              }}
              placeholder={"Mnemonic passphrase"}
              className="animate__animated animate__fadeIn"
            />
          </Col>
          <Col>
            <Button
              className="link-button "
              text="Export"
              onClick={exportPrivateKey}
            />
          </Col>
        </Row>
        <Collapse in={!!privateKey}>
          <div>
            <h5>This is your Private Key</h5>
            <h6 className="selectable-text">{privateKey}</h6>
          </div>
        </Collapse>
      </div>
    </Hoc>
  );
};

export default Settings;
