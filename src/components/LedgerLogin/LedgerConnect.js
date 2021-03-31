import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hoc from "../general/Hoc";
import Input from "../general/input/Input";
import { isMinaAppOpen } from "../../tools/ledger";
import { Row, Col } from "react-bootstrap";
import Logo from "../general/Logo";
import LedgerLoader from "../general/LedgerLoader";
import Footer from "../general/Footer";
import Button from "../general/Button";
import LedgerGetAddress from "./LedgerGetAddress";
import ReactTooltip from "react-tooltip";
import HelpHint from "../general/HelpHint";
import { toast } from "react-toastify";

export default function LedgerConnect(props) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [customAccount, setCustomAccount] = useState(false);
  const [accountNumber, setAccountNumber] = useState(0);
  const [proceedToLedger, setProceedToLedger] = useState(false);
  const [browserIncompatible, setBrowserIncompatible] = useState(false);

  const check = async () => {
    try {
      const open = await isMinaAppOpen();
      setIsAvailable(open);
    } catch (e) {
      setIsAvailable(false);
      if (e.message.includes("not supported")) {
        setBrowserIncompatible(true);
      }
    }
  };

  useEffect(() => {
    let timerCheck = setInterval(() => check(), 2 * 1000);
    return () => {
      clearInterval(timerCheck);
    };
  }, []);

  function accountNumberHandler(event) {
    const number = +event.target.value || 0;
    setAccountNumber(number);
  }

  function verifyAccountNumber() {
    if (+accountNumber >= 0 && +accountNumber <= 10000) {
      setProceedToLedger(true);
    } else {
      toast.error("Account number should be between 0 and 10000");
    }
  }

  const renderLookingForLedger = (
    <div>
      <h4 className="full-width-align-center">
        Connect your Ledger wallet and open the Mina app
      </h4>
      <div className="v-spacer" />
      <LedgerLoader />
      <div className="v-spacer" />
      <h6 className="full-width-align-center">Looking for devices</h6>
      <div className="v-spacer" />
      <Link to="/">
        <Button className="link-button mx-auto" text="Go back" />
      </Link>
    </div>
  );

  const renderIncompatible = (
    <div>
      <h4 className="full-width-align-center">
        Connect your Ledger wallet and open the Mina app
      </h4>
      <div className="v-spacer" />
      <h6 className="full-width-align-center">
        ❌ Browser is incompatible, please use the last version of Chrome, Edge
        or Opera
      </h6>
      <div className="v-spacer" />
      <Link to="/">
        <Button className="link-button mx-auto" text="Go back" />
      </Link>
    </div>
  );

  const customAccountQuestion = (
    <div>
      <Button
        className="link-button mx-auto"
        text="Click here to select a custom account"
        onClick={() => setCustomAccount(true)}
      />
    </div>
  );

  const customAccountInput = (
    <div>
      <h6 className="full-width-align-center">
        Please select account an number{" "}
        <HelpHint hint="Default account number is 0. If you have created your wallet with another account index, change it here.<br/> Only change this number if you know what you are doing." />
      </h6>
      <div className="v-spacer" />
      <Input
        small={true}
        type="number"
        value={accountNumber}
        inputHandler={accountNumberHandler}
      />
      <ReactTooltip multiline={true} />
    </div>
  );

  const renderAccountNumberSelect = (
    <div>
      <h4 className="full-width-align-center">
        Connect now your Ledger wallet and open the Mina app
      </h4>
      <div className="v-spacer" />
      <h6 className="full-width-align-center">✅ Ledger connected</h6>
      <div className="v-spacer" />
      {customAccount ? customAccountInput : customAccountQuestion}
      <div className="v-spacer" />
      <Row>
        <Col md={6}>
          <Link to="/">
            <Button className="link-button mx-auto" text="Go back" />
          </Link>
        </Col>
        <Col md={6}>
          <Button
            onClick={verifyAccountNumber}
            className="lightGreenButton__fullMono mx-auto"
            text="Continue"
          />
        </Col>
      </Row>
    </div>
  );

  if (proceedToLedger) {
    return <LedgerGetAddress {...props} accountNumber={accountNumber} />;
  }

  const isAvailableRender = isAvailable
    ? renderAccountNumberSelect
    : renderLookingForLedger;

  return (
    <Hoc>
      <div className="block-container real-full-page-container center">
        <div className="full-width">
          <Row>
            <Col md={8} xl={8} className="offset-md-2 offset-xl-2 text-center">
              <div className="mx-auto fit-content">
                <Logo big="true" />
              </div>
              <div className="v-spacer" />
              <div className="v-spacer" />
              <div className="v-spacer" />
              {browserIncompatible ? renderIncompatible : isAvailableRender}
            </Col>
          </Row>
        </div>
      </div>
      <Footer network={props.network} />
    </Hoc>
  );
}
