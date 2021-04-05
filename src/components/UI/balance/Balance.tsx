import { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "../Button";
import { Copy } from "react-feather";
import { readSession } from "../../../tools";
import { useQuery } from "@apollo/client";
import Avatar from "../../../tools/avatar";
import { copyToClipboard, toMINA } from "../../../tools";
import ReactTooltip from "react-tooltip";
import { BalanceContext } from "../../../context/balance/BalanceContext";
import { GET_TICKER, GET_BALANCE } from "../../../graphql/query";
import { DEFAULT_INTERVAL } from "../../../tools/const";
import {
  renderBalance,
  userBalanceToBTCValue,
  ITicker,
  IBalanceQueryResult,
} from "./BalanceHelper";

const Balance = () => {
  const [address, setAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const {
    setBalanceContext,
    shouldBalanceUpdate,
    setShouldBalanceUpdate,
  }: any = useContext(BalanceContext);
  const { data: tickerData, loading: tickerLoading } = useQuery<ITicker>(
    GET_TICKER,
  );
  const {
    data: balanceData,
    loading: balanceLoading,
    refetch: balanceRefetch,
  } = useQuery<IBalanceQueryResult>(GET_BALANCE, {
    variables: {
      publicKey: address,
      notifyOnNetworkStatusChange: true,
    },
    fetchPolicy: "network-only",
    skip: !address || address === "",
    pollInterval: DEFAULT_INTERVAL,
    onCompleted: data => {
      if (setBalanceContext) {
        setBalanceContext(data?.accountByKey?.balance || {});
      }
    },
  });

  useEffect(() => {
    if (!address) {
      getAndSetAddress();
    }
  }, [address]);

  useEffect(() => {
    if (shouldBalanceUpdate) {
      balanceRefetch({ publicKey: address });
      setShouldBalanceUpdate(false);
    }
    if (balanceData?.accountByKey?.balance) {
      const { unconfirmedTotal } = balanceData.accountByKey.balance;
      setUserBalance(unconfirmedTotal);
      setBalanceContext(balanceData.accountByKey.balance);
    }
  }, [shouldBalanceUpdate, balanceData]);

  /**
   * Get current wallet public key
   */
  const getAndSetAddress = async () => {
    const walletAddress = await readSession();
    if (walletAddress) {
      setAddress(walletAddress.address);
    }
  };

  if (address === "") {
    return <div />;
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
                    balanceData?.accountByKey?.balance?.locked
                      ? toMINA(balanceData.accountByKey.balance.locked)
                      : 0
                  } Mina <br/> Liquid: ${
                    balanceData?.accountByKey?.balance?.liquid
                      ? toMINA(balanceData.accountByKey.balance.liquid)
                      : 0
                  } Mina`}>
                  {renderBalance({ balanceData, balanceLoading, userBalance })}
                </h5>
              </div>
              <div className="inline-block-element">
                <div className="v-div" />
              </div>
              <div className="inline-block-element">
                <span>
                  <h6 className="secondaryText">BTC Apx. value</h6>
                  <h5>
                    {userBalanceToBTCValue({
                      tickerData,
                      tickerLoading,
                      userBalance,
                    })}{" "}
                  </h5>
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
              className="full-width-align-center small-screen-wallet-value">
              <div className="inline-block-element full-width-align-center">
                <h6 className="secondaryText full-width-align-center">
                  Your balance
                </h6>
                <h5
                  className="full-width-align-center"
                  data-tip={`Locked: ${
                    balanceData?.accountByKey?.balance?.locked
                      ? toMINA(balanceData.accountByKey.balance.locked)
                      : 0
                  } Mina <br/> Liquid: ${
                    balanceData?.accountByKey?.balance?.liquid
                      ? toMINA(balanceData.accountByKey.balance.liquid)
                      : 0
                  } Mina`}>
                  {renderBalance({ balanceData, balanceLoading, userBalance })}
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
                    {userBalanceToBTCValue({
                      tickerData,
                      tickerLoading,
                      userBalance,
                    })}
                  </h5>
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Balance;
