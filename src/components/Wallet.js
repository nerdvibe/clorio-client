import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "../components/Button";
import { Copy } from "react-feather";
import { getAddress } from "../tools";
import { useQuery, gql } from "@apollo/client";
import Avatar from "../tools/avatar";
import Big from "big.js";
import { copyToClipboard } from "../tools/utils";

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
    skip: !address,
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
      userBalance = Big(balance.data.accountByKey.balance.total)
        .mul(1e-9)
        .toFixed();
      const total = Big(balance.data.accountByKey.balance.total)
        .mul(1e-9)
        .toFixed();
      const liquid = Big(balance.data.accountByKey.balance.liquid)
        .mul(1e-9)
        .toFixed();
      const liquidUnconfirmed = Big(
        balance.data.accountByKey.balance.liquidUnconfirmed
      )
        .mul(1e-9)
        .toFixed();
      if (props.setBalance) {
        props.setBalance({
          total,
          liquid,
          liquidUnconfirmed,
        });
      }
    }
  }
  if (address === undefined) {
    return <div />;
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
                <h5>{userBalance} MINA</h5>
              </div>
              <div className="inline-block-element">
                <div className="v-div" />
              </div>
              <div className="inline-block-element">
                <span>
                  <h6 className="secondaryText">Apx value</h6>
                  <h5>
                    {(ticker.data &&
                      userBalance * ticker.data.ticker.BTCMINA) ||
                      0}{" "}
                    BTC
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
