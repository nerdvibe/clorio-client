import { useState, useEffect } from "react";
import Hoc from "../UI/Hoc";
import Input from "../UI/input/Input";
import { isMinaAppOpen } from "../../tools/ledger";
import { Row, Col } from "react-bootstrap";
import Button from "../UI/Button";
import LedgerGetAddress from "./LedgerGetAddress";
import HelpHint from "../UI/HelpHint";
import { toast } from "react-toastify";
import {
  IS_LEDGER_OPEN_TIME_DELAY,
  MINIMUM_LEDGER_ACCOUNT_NUMBER,
  MAXIMUM_LEDGER_ACCOUNT_NUMBER,
} from "../../tools";
import LedgerIncompatible from "./LedgerIncopatible";
import LedgerSearch from "./LedgerSearch";
import ReactTooltip from "react-tooltip";
import { ArrowLeft, ArrowRight } from "react-feather";

interface IProps {
  accountNumber?: number;
  toggleLoader: () => void;
}

const LedgerConnect = (props: IProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [customAccount, setCustomAccount] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<number>(0);
  const [proceedToLedger, setProceedToLedger] = useState<boolean>(false);
  const [browserIncompatible, setBrowserIncompatible] = useState<boolean>(
    false
  );

  /**
   * On component load check for the Ledger Mina app on the connected Ledger
   * On component dismount clear the time interval
   */
  useEffect(() => {
    const timerCheck = setInterval(
      () => checkLedgerMinaAppOpen(),
      IS_LEDGER_OPEN_TIME_DELAY
    );
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
        `Account number should be between ${MINIMUM_LEDGER_ACCOUNT_NUMBER} and ${MAXIMUM_LEDGER_ACCOUNT_NUMBER}`
      );
    }
  };

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
      <div className="mx-auto w-50">
        <Input
          type="number"
          value={accountNumber}
          inputHandler={accountNumberHandler}
        />
      </div>
      <ReactTooltip multiline />
    </div>
  );

  const renderAccountNumberSelect = (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1>Login</h1>
          <p className="text-center mt-1">
            Connect now your Ledger wallet and open the Mina app
          </p>
          <div className="divider w-100" />
        </div>
      </div>
      <h6 className="full-width-align-center">✅ Ledger connected</h6>
      <div className="v-spacer" />
      {customAccount ? customAccountInput : customAccountQuestion}
      <div className="v-spacer" />
      <Row>
        <Col xs={6}>
          <Button
            className="big-icon-button"
            icon={<ArrowLeft />}
            text="Go back"
            link="login-selection"
          />
        </Col>
        <Col xs={6}>
          <Button
            onClick={verifyAccountNumber}
            text="Continue"
            style="primary"
            icon={<ArrowRight />}
            appendIcon
          />
        </Col>
      </Row>
    </div>
  );

  if (proceedToLedger) {
    return <LedgerGetAddress {...props} accountNumber={accountNumber} />;
  }

  const isAvailableRender = isAvailable ? (
    renderAccountNumberSelect
  ) : (
    <LedgerSearch />
  );

  return (
    <Hoc className="full-screen-container-center">
      <div className="glass-card p-5 ">
        {browserIncompatible ? <LedgerIncompatible /> : isAvailableRender}
      </div>
    </Hoc>
  );
};

export default LedgerConnect;
