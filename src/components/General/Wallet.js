import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "./Button";
import { Copy } from "react-feather";
import { getAddress } from "../../tools";
import { useQuery } from "@apollo/client";
import Avatar from "../../tools/avatar";
import { copyToClipboard, toMINA } from "../../tools/utils";
import ReactTooltip from "react-tooltip";
import { BalanceContext } from "../../context/BalanceContext";
import { useContext } from "react";
import { GET_TICKER, GET_BALANCE } from "../../graphql/query";
import { DEFAULT_INTERVAL } from "../../tools/const";

export default function Wallet() {
  const [address, setaddress] = useState(undefined);
  const [userBalance, setUserBalance] = useState(0);
  const {
    setBalanceContext,
    shouldBalanceUpdate,
    setShouldBalanceUpdate,
  } = useContext(BalanceContext);
  const ticker = useQuery(GET_TICKER);
  const balance = useQuery(GET_BALANCE, {
    variables: {
      publicKey: address,
      notifyOnNetworkStatusChange: true,
    },
    fetchPolicy: "network-only",
    skip: !address || address === "",
    pollInterval: DEFAULT_INTERVAL,
    onCompleted: (data) => {
      if (setBalanceContext) {
        setBalanceContext(data?.accountByKey?.balance || {});
      }
    },
  });

  useEffect(() => {
    if (!address) {
      getAddress((data) => {
        setaddress(data);
      });
    }
  }, [address]);

  useEffect(() => {
    if (shouldBalanceUpdate) {
      balance.refetch({ publicKey: address });
      setShouldBalanceUpdate(false);
    }
    if (balance.data?.accountByKey?.balance) {
      const { unconfirmedTotal } = balance.data.accountByKey.balance;
      setUserBalance(unconfirmedTotal);
      setBalanceContext(balance.data.accountByKey.balance);
    }
  }, [shouldBalanceUpdate, balance]);

  if (address === undefined) {
    return <div />;
  }

  function renderBalance() {
    if (balance.loading) {
      return "Loading ";
    }
    if (balance.data) {
      if (!userBalance) {
        return "Not available";
      } else {
        return toMINA(userBalance) + " Mina";
      }
    }
    return "Not available";
  }

  function renderAverageValue() {
    if (ticker.loading) {
      return "Loading ";
    }
    if (ticker.data?.ticker) {
      if (ticker.data.ticker.BTCMINA === null) {
        return "Not available";
      } else {
        return toMINA(userBalance * ticker.data.ticker.BTCMINA) + " BTC";
      }
    }
    return "Not available";
  }

  return (
    <div className="block-container">
      <ReactTooltip multiline={true} />
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
                <h5
                  data-tip={`Locked: ${
                    balance.data?.accountByKey?.balance?.locked
                      ? toMINA(balance.data.accountByKey.balance.locked)
                      : 0
                  } Mina <br/> Liquid: ${
                    balance.data?.accountByKey?.balance?.liquid
                      ? toMINA(balance.data.accountByKey.balance.liquid)
                      : 0
                  } Mina`}
                >
                  {renderBalance()}
                </h5>
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
            <Col
              md={5}
              className="full-width-align-center small-screen-wallet-value"
            >
              <div className="inline-block-element full-width-align-center">
                <h6 className="secondaryText full-width-align-center">
                  Your balance
                </h6>
                <h5
                  className="full-width-align-center"
                  data-tip={`Locked: ${
                    balance.data?.accountByKey?.balance?.locked
                      ? toMINA(balance.data.accountByKey.balance.locked)
                      : 0
                  } Mina <br/> Liquid: ${
                    balance.data?.accountByKey?.balance?.liquid
                      ? toMINA(balance.data.accountByKey.balance.liquid)
                      : 0
                  } Mina`}
                >
                  {renderBalance()}
                </h5>
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
                  <h6 className="secondaryText full-width-align-center">
                    Apx value
                  </h6>
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
