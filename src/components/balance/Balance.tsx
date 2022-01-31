import { useState, useEffect, useContext } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "../UI/Button";
import { Copy } from "react-feather";
import { useQuery } from "@apollo/client";
import Avatar from "../../tools/avatar/avatar";
import {
  copyToClipboard,
  toMINA,
  DEFAULT_QUERY_REFRESH_INTERVAL,
  readSession,
} from "../../tools";
import ReactTooltip from "react-tooltip";
import { GET_TICKER, GET_BALANCE } from "../../graphql/query";
import { renderBalance, userBalanceToSymbolValue } from "./BalanceHelper";
import { IBalanceQueryResult, ITicker } from "./BalanceTypes";
import { IBalanceContext } from "../../contexts/balance/BalanceTypes";
import { BalanceContext } from "../../contexts/balance/BalanceContext";

const Balance = () => {
  const [address, setAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const {
    setBalanceContext,
    shouldBalanceUpdate,
    setShouldBalanceUpdate,
  } = useContext<Partial<IBalanceContext>>(BalanceContext);
  const { data: tickerData, loading: tickerLoading } = useQuery<ITicker>(
    GET_TICKER
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
    skip: !address,
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
    onCompleted: (data) => {
      if (setBalanceContext) {
        setBalanceContext(data?.accountByKey?.balance || {});
      }
    },
  });

  /**
   * If the wallet address is empty get it from the store and set it into the component state
   */
  useEffect(() => {
    if (!address) {
      getAndSetAddress();
    }
  }, [address]);
  useEffect(() => {
    refetchBalance();
    // If balance is available set it inside the component state and the balance context
    if (balanceData?.accountByKey?.balance) {
      const { unconfirmedTotal } = balanceData.accountByKey.balance;
      setUserBalance(unconfirmedTotal);
      if (setBalanceContext) {
        setBalanceContext(balanceData?.accountByKey?.balance);
      }
    }
  }, [shouldBalanceUpdate, balanceData]);

  /**
   * If balance update is required (shouldBalanceUpdate) refetch it
   */
  const refetchBalance = async () => {
    if (shouldBalanceUpdate) {
      await balanceRefetch({ publicKey: address });
      if (setShouldBalanceUpdate) {
        setShouldBalanceUpdate(false);
      }
    }
  };

  /**
   * Get current wallet public key
   */
  const getAndSetAddress = async () => {
    const walletAddress = await readSession();
    if (walletAddress) {
      setAddress(walletAddress.address);
    }
  };

  if (!address) {
    return <div />;
  }

  return (
    <div className="glass-card px-3 pt-4">
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
                <span className="selectable-text">{address}</span>
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
                  data-tip={
                    +(balanceData?.accountByKey?.balance?.locked || 0) > 0
                      ? `Locked: ${
                          balanceData?.accountByKey?.balance?.locked
                            ? toMINA(balanceData.accountByKey.balance.locked)
                            : 0
                        } Mina <br/> Liquid: ${
                          balanceData?.accountByKey?.balance?.liquid
                            ? toMINA(balanceData.accountByKey.balance.liquid)
                            : 0
                        } Mina`
                      : ""
                  }
                >
                  {renderBalance({ balanceData, balanceLoading, userBalance })}
                </h5>
              </div>
              <div className="inline-block-element ml-2">
                <div className="v-div" />
              </div>
              <div className="inline-block-element ml-2">
                <span>
                  <h6 className="secondaryText">BTC Apx. value</h6>
                  <h5>
                    {userBalanceToSymbolValue({
                      tickerData,
                      tickerLoading,
                      userBalance,
                      symbol: "BTC",
                      ticker: "BTCMINA",
                    })}
                  </h5>
                </span>
              </div>
              <div className="inline-block-element ml-2">
                <div className="v-div" />
              </div>
              <div className="inline-block-element ml-2">
                <span>
                  <h6 className="secondaryText">USDT Apx. value</h6>
                  <h5>
                    {userBalanceToSymbolValue({
                      tickerData,
                      tickerLoading,
                      userBalance,
                      symbol: "USDT",
                      ticker: "USDTMINA",
                    })}
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
            <div className="inline-block-element walletImageContainer d-none d-sm-inline-block vertical-align-top">
              <div className="walletImageOutline">
                <Avatar address={address} />
              </div>
            </div>
            <div className="inline-block-element address-block-container">
              <h6 className="secondaryText d-none d-sm-inline-block">
                This is your address
              </h6>
              <h5 className="small-screen-address selectable-text truncate-text">
                {address} &nbsp;
                <Button
                  className="inline-element d-none d-sm-inline-block"
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
              sm={3}
              className="full-width-align-center small-screen-wallet-value"
            >
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
                  } Mina`}
                >
                  {renderBalance({ balanceData, balanceLoading, userBalance })}
                </h5>
              </div>
            </Col>
            <Col sm={1} className="full-width-align-center d-none d-sm-inline">
              <div className="inline-block-element">
                <div className="v-div" />
              </div>
            </Col>
            <Col sm={3} className="full-width-align-center ">
              <div className="inline-block-element full-width-align-center small-screen-wallet-value">
                <span>
                  <h6 className="secondaryText full-width-align-center">
                    BTC Apx. value
                  </h6>
                  <h5 className="full-width-align-center">
                    {userBalanceToSymbolValue({
                      tickerData,
                      tickerLoading,
                      userBalance,
                      symbol: "BTC",
                      ticker: "BTCMINA",
                    })}
                  </h5>
                </span>
              </div>
            </Col>
            <Col sm={1} className="full-width-align-center d-none d-sm-inline">
              <div className="inline-block-element">
                <div className="v-div" />
              </div>
            </Col>
            <Col sm={3} className="full-width-align-center ">
              <div className="inline-block-element full-width-align-center small-screen-wallet-value">
                <span>
                  <h6 className="secondaryText full-width-align-center">
                    USDT Apx. value
                  </h6>
                  <h5 className="full-width-align-center">
                    {userBalanceToSymbolValue({
                      tickerData,
                      tickerLoading,
                      userBalance,
                      symbol: "USDT",
                      ticker: "USDTMINA",
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
