import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "./Button";
import { Copy } from "react-feather";
import { getAddress } from "../../tools";
import { useQuery, gql } from "@apollo/client";
import Avatar from "../../tools/avatar";
import { copyToClipboard, toMINA } from "../../tools/utils";
import Countup from "./Countup";
import ReactTooltip from "react-tooltip";

const TICKER = gql`
  query ticker {
    ticker {
      BTCMINA
    }
  }
`;

const BALANCE = gql`
  query accountByKey($publicKey: String!) {
    accountByKey(publicKey: $publicKey) {
      balance {
        total
        liquid
        locked
        liquidUnconfirmed
      }
    }
  }
`;

export default function Wallet(props) {
  let userBalance = 0;
  const [address, setaddress] = useState(undefined);
  const ticker = useQuery(TICKER);
  const balance = useQuery(BALANCE, {
    variables: { publicKey: address },
    skip: !address || address==="",
  });

  useEffect(() => {
    if (!address) {
      getAddress((data) => {
        setaddress(data);
      });
    }
  }, [address]);

  if (balance && balance.data) {
    if (balance.data.accountByKey) {
      userBalance = balance.data.accountByKey.balance.total;
      const total = balance.data.accountByKey.balance.total;
      const liquid = balance.data.accountByKey.balance.liquid;
      const locked = balance.data.accountByKey.balance.locked;
      const liquidUnconfirmed =
        balance.data.accountByKey.balance.liquidUnconfirmed;
      if (props.setContextBalance) {
        props.setContextBalance({
          total,
          liquid,
          locked,
          liquidUnconfirmed,
        });
      }
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
    if (ticker.data) {
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
      <div className="align-left">
        <div className="inline-block-element walletImageContainer">
          <div className="walletImageOutline">
            <Avatar address={address} size="80" />
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
    </div>
  );
}
