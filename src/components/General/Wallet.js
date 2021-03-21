import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "./Button";
import { Copy } from "react-feather";
import { getAddress } from "../../tools";
import { useQuery } from "@apollo/client";
import Avatar from "../../tools/avatar";
import { copyToClipboard, toMINA } from "../../tools/utils";
import ReactTooltip from "react-tooltip";
import {BalanceContext} from "../../context/BalanceContext";
import { useContext } from "react";
import { GET_TICKER,GET_BALANCE } from "../../graphql/query";

export default function Wallet(props) {
  let userBalance = 0;
  const [address, setaddress] = useState(undefined);
  const { setBalanceContext } = useContext(BalanceContext);
  const ticker = useQuery(GET_TICKER);
  const balance = useQuery(GET_BALANCE, {
    variables: { publicKey: address },
    skip: !address || address==="",
    onCompleted: (data) => {
      if(setBalanceContext) {
        setBalanceContext(data?.accountByKey?.balance || {})
      }
    }
  });

  useEffect(() => {
    if (!address) {
      getAddress((data) => {
        setaddress(data);
      });
    }
  }, [address]);

  if (balance.data?.accountByKey?.balance) {
    const {total,liquid,locked,liquidUnconfirmed} = balance.data.accountByKey.balance;
    userBalance = balance.data.accountByKey.balance.total;
    if (props.setContextBalance) {
      props.setContextBalance({
        total,
        liquid,
        locked,
        liquidUnconfirmed,
      });
    }
  }
  if (address === undefined) {
    return <div />;
  }

  function renderBalance() {
    if(balance.loading){
      return "Loading "
    }
    if (balance.data) {
      if(!userBalance){
        return "Not available";
      } else {
        return toMINA(userBalance) + " Mina";
      }
    }
    return "Not available";
  }

  function renderAverageValue() {
    if(ticker.loading){
      return "Loading "
    }
    if (ticker.data?.ticker) {
      if(ticker.data.ticker.BTCMINA === null){
        return "Not available";
      } else {
        return toMINA(userBalance * ticker.data.ticker.BTCMINA) + " BTC";
      }
    }
    return "Not available";
  }

  return (
    <div className="block-container">
      <div className="align-left big-screen">
        <div className="inline-block-element walletImageContainer">
          <div className="walletImageOutline">
            <Avatar address={address} />
          </div>
        </div>
        <div className="inline-block-element wallet-data">
          <Row>
            <Col xs={12}>
              <h6 className="secondaryText">This is your address</h6>
              <h5>
                {address} &nbsp;
                <Button
                  className="inline-element"
                  icon={<Copy />}
                  onClick={() => copyToClipboard(address)}
                />
              </h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="inline-block-element">
                <h6 className="secondaryText">Your balance</h6>
                <h5 data-tip={+props.balance?.locked ? `Locked: ${toMINA(props.balance.locked)} Mina <br/> Liquid: ${toMINA(props.balance.liquid)} Mina`:``}>{renderBalance()}</h5>
                <ReactTooltip multiline={true} />
              </div>
              <div className="inline-block-element">
                <div className="v-div" />
              </div>
              <div className="inline-block-element">
                <span>
                  <h6 className="secondaryText">BTC Apx. value</h6>
                  <h5>{renderAverageValue()} </h5>
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className="align-left small-screen">
        <Row>
        <Col md={12}>
            <div className="inline-block-element walletImageContainer">
              <div className="walletImageOutline">
                <Avatar address={address} />
              </div>
            </div>
            <div className="inline-block-element ">
              <h6 className="secondaryText">This is your address</h6>
              <h5 className="small-screen-address">
                {address} &nbsp;
                <Button
                  className="inline-element"
                  icon={<Copy />}
                  onClick={() => copyToClipboard(address)}
                />
              </h5>
            </div>
          </Col>
        </Row>
        <div className="inline-block-element wallet-data full-width">
          <Row>
            <Col md={5} className="full-width-align-center small-screen-wallet-value">
              <div className="inline-block-element full-width-align-center">
                <h6 className="secondaryText full-width-align-center">Your balance</h6>
                <h5 className="full-width-align-center">{renderBalance()}</h5>
              </div>
            </Col>
            <Col md={2} className="full-width-align-center">
              <div className="inline-block-element">
                <div className="v-div" />
              </div>
            </Col>
            <Col md={5} className="full-width-align-center ">
              <div className="inline-block-element full-width-align-center small-screen-wallet-value">
                <span>
                  <h6 className="secondaryText full-width-align-center">Apx value</h6>
                  <h5 className="full-width-align-center">
                    {renderAverageValue()} 
                  </h5>
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
