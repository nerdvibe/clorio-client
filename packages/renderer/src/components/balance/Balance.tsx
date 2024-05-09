import {useEffect, useContext} from 'react';
import {Row, Col} from 'react-bootstrap';
import Button from '../UI/Button';
import {Copy} from 'react-feather';
import {useQuery} from '@apollo/client';
import Avatar from '../../tools/avatar/avatar';
import {copyToClipboard, toMINA, DEFAULT_QUERY_REFRESH_INTERVAL} from '../../tools';
import ReactTooltip from 'react-tooltip';
import {GET_TICKER, GET_BALANCE} from '../../graphql/query';
import {renderBalance, userBalanceToSymbolValue} from './BalanceHelper';
import type {IBalanceQueryResult, ITicker} from './BalanceTypes';
import type {IBalanceContext} from '../../contexts/balance/BalanceTypes';
import {BalanceContext} from '../../contexts/balance/BalanceContext';
import {balanceTooltip} from './util';
import CustomSkeleton from '../CustomSkeleton';
import {useWallet} from '/@/contexts/WalletContext';

const Balance = () => {
  const {wallet} = useWallet();
  const {address} = wallet;
  // const [userBalance, setUserBalance] = useState<number>(0);
  const {
    addBalance,
    setBalanceContext,
    shouldBalanceUpdate,
    setShouldBalanceUpdate,
    balanceData: balance,
  } = useContext<Partial<IBalanceContext>>(BalanceContext);
  const {
    data: tickerData,
    loading: tickerLoading,
    error: tickerError,
  } = useQuery<ITicker>(GET_TICKER);
  const {
    data: balanceData,
    loading: balanceLoading,
    error: balanceError,
    refetch: balanceRefetch,
  } = useQuery<IBalanceQueryResult>(GET_BALANCE, {
    variables: {
      publicKey: address,
      notifyOnNetworkStatusChange: true,
    },
    fetchPolicy: 'network-only',
    skip: !address,
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
    onCompleted: data => {
      if (addBalance && data) {
        // setBalanceContext(data?.accountByKey?.balance || {});
        addBalance(address, data?.accountByKey?.balance || {});
      }
    },
  });

  useEffect(() => {
    refetchBalance();
    // If balance is available set it inside the component state and the balance context
    if (balanceData?.accountByKey?.balance) {
      if (setBalanceContext) {
        addBalance(address, balanceData?.accountByKey?.balance || {});
      }
    }
  }, [shouldBalanceUpdate, balanceData]);

  /**
   * If balance update is required (shouldBalanceUpdate) refetch it
   */
  const refetchBalance = async (newAddress?: string) => {
    if (shouldBalanceUpdate) {
      await balanceRefetch({publicKey: newAddress || address});
      if (setShouldBalanceUpdate) {
        setShouldBalanceUpdate(false);
      }
    }
  };

  const storedUserBalance =
    (balance?.balances[address] && balance?.balances[address].unconfirmedTotal) || 0;
  const userBalance =
    balanceData?.accountByKey?.balance?.unconfirmedTotal || storedUserBalance || 0;

  return (
    <div className="glass-card px-3 py-2">
      <ReactTooltip multiline={true} />
      <div className="big-screen">
        <div className="flex flex-row justify-start gap-4">
          <div className="inline-block-element mt-2">
            <CustomSkeleton
              show={address}
              altProps={{height: 75, width: 75, circle: true}}
            >
              <div className="walletImageOutline">
                <Avatar address={address} />
              </div>
            </CustomSkeleton>
          </div>
          <div className="inline-block-element wallet-data flex gap-2 flex-col">
            <Row>
              <Col xs={12}>
                <div className="flex my-2 items-center justify-start gap-2">
                  <h6 className="secondaryText width-fit">This is your address</h6>
                </div>
                <div className="flex flex-row justify-start">
                  <CustomSkeleton
                    show={address}
                    altProps={{height: 20, width: 300}}
                  >
                    <div className="flex flex-row">
                      <h5 className="selectable-text">
                        {address}
                        <Button
                          className="inline-element"
                          icon={<Copy />}
                          onClick={() => copyToClipboard(address)}
                        />
                      </h5>
                    </div>
                  </CustomSkeleton>
                </div>
              </Col>
            </Row>
            <div className="flex flex-row justify-start">
              <div className="inline-block-element">
                <h6 className="secondaryText">Your balance</h6>
                <CustomSkeleton
                  show={(!balanceLoading && balanceData && userBalance) || balanceError}
                  altProps={{height: 20, width: 150}}
                >
                  <h5
                    data-tip={balanceTooltip(balanceData)}
                    className="animate__animated animate__fadeIn"
                  >
                    {balanceError
                      ? 'Not available'
                      : renderBalance({balanceData, balanceLoading, userBalance})}
                  </h5>
                </CustomSkeleton>
              </div>
              <div className="inline-block-element ml-2">
                <div className="v-div" />
              </div>
              <div className="inline-block-element ml-2">
                <span>
                  <h6 className="secondaryText">BTC Apx. value</h6>
                  <CustomSkeleton
                    show={(!tickerLoading && tickerData && userBalance) || tickerError}
                    altProps={{height: 20, width: 150}}
                  >
                    <h5 data-tip={balanceTooltip(balanceData)}>
                      {tickerError
                        ? 'Not available'
                        : userBalanceToSymbolValue({
                            tickerData,
                            tickerLoading,
                            userBalance,
                            symbol: 'BTC',
                            ticker: 'BTCMINA',
                          })}
                    </h5>
                  </CustomSkeleton>
                </span>
              </div>
              <div className="inline-block-element ml-2">
                <div className="v-div" />
              </div>
              <div className="inline-block-element ml-2">
                <span>
                  <h6 className="secondaryText">USDT Apx. value</h6>
                  <CustomSkeleton
                    show={(!tickerLoading && tickerData && userBalance) || tickerError}
                    altProps={{height: 20, width: 150}}
                  >
                    <h5 data-tip={balanceTooltip(balanceData)}>
                      {tickerError
                        ? 'Not available'
                        : userBalanceToSymbolValue({
                            tickerData,
                            tickerLoading,
                            userBalance,
                            symbol: 'USDT',
                            ticker: 'USDTMINA',
                          })}
                    </h5>
                  </CustomSkeleton>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="align-left small-screen">
        <Row>
          <Col md={12}>
            <div className="inline-block-element walletImageContainer d-none d-sm-inline-block vertical-align-top">
              <div className="walletImageOutline">{address && <Avatar address={address} />}</div>
            </div>
            <div className="inline-block-element address-block-container">
              <h6 className="secondaryText d-none d-sm-inline-block">This is your address</h6>
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
                <h6 className="secondaryText full-width-align-center">Your balance</h6>
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
                  {renderBalance({balanceData, balanceLoading, userBalance})}
                </h5>
              </div>
            </Col>
            <Col
              sm={1}
              className="full-width-align-center d-none d-sm-inline"
            >
              <div className="inline-block-element">
                <div className="v-div" />
              </div>
            </Col>
            <Col
              sm={3}
              className="full-width-align-center "
            >
              <div className="inline-block-element full-width-align-center small-screen-wallet-value">
                <span>
                  <h6 className="secondaryText full-width-align-center">BTC Apx. value</h6>
                  <h5 className="full-width-align-center">
                    {userBalanceToSymbolValue({
                      tickerData,
                      tickerLoading,
                      userBalance,
                      symbol: 'BTC',
                      ticker: 'BTCMINA',
                    })}
                  </h5>
                </span>
              </div>
            </Col>
            <Col
              sm={1}
              className="full-width-align-center d-none d-sm-inline"
            >
              <div className="inline-block-element">
                <div className="v-div" />
              </div>
            </Col>
            <Col
              sm={3}
              className="full-width-align-center "
            >
              <div className="inline-block-element full-width-align-center small-screen-wallet-value">
                <span>
                  <h6 className="secondaryText full-width-align-center">USDT Apx. value</h6>
                  <h5 className="full-width-align-center">
                    {userBalanceToSymbolValue({
                      tickerData,
                      tickerLoading,
                      userBalance,
                      symbol: 'USDT',
                      ticker: 'USDTMINA',
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
