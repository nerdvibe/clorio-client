import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hoc from "../UI/Hoc";
import Input from "../UI/input/Input";
import { isMinaAppOpen } from "../../tools/ledger";
import { Row, Col } from "react-bootstrap";
import Logo from "../UI/Logo";
import LedgerLoader from "../UI/LedgerLoader";
import Footer from "../UI/Footer";
import Button from "../UI/Button";
import LedgerGetAddress from "./LedgerGetAddress";
import ReactTooltip from "react-tooltip";
import HelpHint from "../UI/HelpHint";
import { toast } from "react-toastify";
import { IProps } from "./LedgerLoginTypes";
import {
  TIME_DELAY,
  MINIMUM_LEDGER_ACCOUNT_NUMBER,
  MAXIMUM_LEDGER_ACCOUNT_NUMBER,
} from "../../tools";

const LedgerConnect = (props: IProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [customAccount, setCustomAccount] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<number>(0);
  const [proceedToLedger, setProceedToLedger] = useState<boolean>(false);
  const [browserIncompatible, setBrowserIncompatible] = useState<boolean>(
    false,
  );

  /**
   * On component load check for the Ledger Mina app on the connected Ledger
   * On component dismount clear the time interval
   */
  useEffect(() => {
    const timerCheck = setInterval(() => checkLedgerMinaAppOpen(), TIME_DELAY);
    return () => {
      clearInterval(timerCheck);
    };
  }, []);

  /**
   * Check if Ledger Mina app is open on the connected Ledger
   */
  const checkLedgerMinaAppOpen = async () => {
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

  /**
   * Set account number inside the component state
   * @param event input text
   */
  const accountNumberHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = +event.target.value || MINIMUM_LEDGER_ACCOUNT_NUMBER;
    setAccountNumber(number);
  };

  /**
   * Check if the selected account number is between the minimum and the maximum
   */
  const verifyAccountNumber = () => {
    if (
      +accountNumber >= MINIMUM_LEDGER_ACCOUNT_NUMBER &&
      +accountNumber <= MAXIMUM_LEDGER_ACCOUNT_NUMBER
    ) {
      setProceedToLedger(true);
    } else {
      toast.error(
        `Account number should be between ${MINIMUM_LEDGER_ACCOUNT_NUMBER} and ${MAXIMUM_LEDGER_ACCOUNT_NUMBER}`,
      );
    }
  };

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
                <Logo big={true} />
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
};

export default LedgerConnect;
