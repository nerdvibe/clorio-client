import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hoc from "../General/Hoc";
import Input from "../General/Input";
import {isMinaAppOpen} from "../../tools/ledger/ledger";
import { Row, Col } from "react-bootstrap";
import Logo from "../General/Logo";
import LedgerLoader from "../General/LedgerLoader";
import Footer from "../General/Footer";
import Button from "../General/Button";
import LedgerGetAddress from "./LedgerGetAddress";
import ReactTooltip from 'react-tooltip';
import { HelpCircle } from "react-feather";


export default function LedgerConnect(props) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [customAccount, setCustomAccount] = useState(false);
  const [accountNumber, setAccountNumber] = useState(0);
  const [proceedToLedger, setProceedToLedger] = useState(false);

  const check = async() => {
    try {
      const open = await isMinaAppOpen();
      setIsAvailable(open)
    } catch(e) {
        setIsAvailable(false)
    } 
  }

  useEffect(
    () => {
      let timerCheck = setInterval(() => check(), 2 * 1000);
      return () => {
        clearInterval(timerCheck);
      };
    },
    []
  );

  function accountNumberHandler(event){
    const number = +event.target.value || 0
    setAccountNumber(number);
  }

  function verifyAccountNumber(){
    if(+accountNumber>=0 && +accountNumber<=10000){
      setProceedToLedger(true)
    } else {
      props.showGlobalAlert("Account number should be between 0 and 10000", "error-toast");
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
        <h6 className="full-width-align-center">
          Looking for devices
        </h6>
        <div className="v-spacer" />
        <Link to="/">
          <Button className="link-button mx-auto" text="Go back" />
        </Link>
      </div>
    )

  const customAccountQuestion = (
    <div>
      <Button 
        className="link-button mx-auto" 
        text="Click here to select a custom account" 
        onClick={() => setCustomAccount(true)}
        />
    </div>
  )

  const customAccountInput = (
    <div>
      <h6 className="full-width-align-center">
      Please select account an number <HelpCircle data-tip="Default account number is 0. If you have created your wallet with another account index, change it here.<br/> Only change this number if you know what you are doing."/>
      </h6>
      <div className="v-spacer" />
      <Input small={true} type="number" value={accountNumber} inputHandler={accountNumberHandler}/>
      <ReactTooltip multiline={true} />
    </div>
  )

  const renderAccountNumberSelect = (
      <div>
        <h4 className="full-width-align-center">
          Connect now your Ledger wallet and open the Mina app
        </h4>
        <div className="v-spacer" />
        <h6 className="full-width-align-center">
          ✅ Ledger connected
        </h6>
        <div className="v-spacer" />
        {
          customAccount ? 
          customAccountInput:
          customAccountQuestion
        }
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
              text="Continue" />
          </Col>
        </Row>
      </div>
    )
    
  

  if(proceedToLedger){
    return <LedgerGetAddress {...props} accountNumber={accountNumber}/>
  }

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
              {
                isAvailable ? 
                renderAccountNumberSelect:
                renderLookingForLedger
              }
            </Col>
          </Row>
        </div>
      </div>
      <Footer network={props.network} />
    </Hoc>
  )
}
