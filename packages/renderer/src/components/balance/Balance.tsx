import {useEffect, useContext, useRef, useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import Button from '../UI/Button';
import {Copy} from 'react-feather';
import {useQuery} from '@apollo/client';
import Avatar from '../../tools/avatar/avatar';
import {copyToClipboard, DEFAULT_QUERY_REFRESH_INTERVAL} from '../../tools';
import ReactTooltip from 'react-tooltip';
import {GET_TICKER, GET_BALANCE} from '../../graphql/query';
import {renderBalance, userBalanceToSymbolValue} from './BalanceHelper';
import type {IBalanceQueryResult, ITicker} from './BalanceTypes';
import type {IBalanceContext} from '../../contexts/balance/BalanceTypes';
import {BalanceContext} from '../../contexts/balance/BalanceContext';
import {balanceTooltip} from './util';
import CustomSkeleton from '../CustomSkeleton';
import Truncate from 'react-truncate-inside';
import {useRecoilValue} from 'recoil';
import {walletState} from '/@/store';
import {useTranslation} from 'react-i18next';

const Balance = () => {
  const wallet = useRecoilValue(walletState);
  const {address} = wallet;
  const textRef = useRef(null);
  const bigTextRef = useRef(null);
  const {t} = useTranslation();

  const [width, setwidth] = useState(0);
  const [widthBigText, setwidthBigText] = useState(0);

  useEffect(() => {
    if (textRef) {
      const observer = new ResizeObserver(entries => {
        setwidth(entries[0].contentRect.width - 150);
      });
      observer.observe(textRef.current);
      return () => textRef.current && observer.unobserve(textRef.current);
    }
  }, []);

  useEffect(() => {
    if (bigTextRef) {
      const observer = new ResizeObserver(entries => {
        setwidthBigText(entries[0].contentRect.width - 150);
      });
      observer.observe(bigTextRef.current);
      return () => bigTextRef.current && observer.unobserve(bigTextRef.current);
    }
  }, []);

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
      <div
        className="big-screen"
        ref={bigTextRef}
      >
        <div className="flex flex-row justify-start gap-4">
          <div className="inline-block-element mt-2">
            <CustomSkeleton
              show={address}
              altProps={{height: 75, width: 75, circle: true}}
            >
              <div className="walletImageOutline">
                <Avatar
                  address={address}
                  className="balance-avatar"
                />
              </div>
            </CustomSkeleton>
          </div>
          <div className="inline-block-element wallet-data flex gap-2 flex-col">
            <Row>
              <Col xs={12}>
                <div className="flex my-2 items-center justify-start gap-2">
                  <h6 className="secondaryText width-fit">
                    {t('balance.this_is_your_address')}
                    <Button
                      className="inline-element"
                      icon={<Copy size={20} />}
                      onClick={() => copyToClipboard(address)}
                    />
                  </h6>
                </div>
                <div className="flex flex-row justify-start">
                  <CustomSkeleton
                    show={address}
                    altProps={{height: 20, width: 300}}
                  >
                    <div className="flex flex-row">
                      <h5 className="selectable-text">
                        <Truncate
                          text={address}
                          width={widthBigText || 1000}
                        />
                      </h5>
                    </div>
                  </CustomSkeleton>
                </div>
              </Col>
            </Row>
            <div className="flex flex-row justify-start">
              <div className="inline-block-element">
                <h6 className="secondaryText">{t('balance.your_balance')}</h6>
                <CustomSkeleton
                  show={(!balanceLoading && balanceData && userBalance) || balanceError}
                  altProps={{height: 20, width: 150}}
                >
                  <h5
                    data-tip={balanceTooltip(balanceData)}
                    className="animate__animated animate__fadeIn"
                  >
                    {balanceError
                      ? t('balance.not_available')
                      : renderBalance({balanceData, balanceLoading, userBalance})}
                  </h5>
                </CustomSkeleton>
              </div>
              <div className="inline-block-element ml-2">
                <div className="v-div" />
              </div>
              <div className="inline-block-element ml-2">
                <span>
                  <h6 className="secondaryText">{t('balance.btc_apx_value')}</h6>
                  <CustomSkeleton
                    show={(!tickerLoading && tickerData && userBalance) || tickerError}
                    altProps={{height: 20, width: 150}}
                  >
                    <h5 data-tip={balanceTooltip(balanceData)}>
                      {tickerError
                        ? t('balance.not_available')
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
                  <h6 className="secondaryText">{t('balance.usdt_apx_value')}</h6>
                  <CustomSkeleton
                    show={(!tickerLoading && tickerData && userBalance) || tickerError}
                    altProps={{height: 20, width: 150}}
                  >
                    <h5 data-tip={balanceTooltip(balanceData)}>
                      {tickerError
                        ? t('balance.not_available')
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
      <div
        className="flex flex-col w-full items-center small-screen"
        style={{display: 'none'}}
        ref={textRef}
      >
        <div className="flex flex-row justify-start gap-4">
          <div className="inline-block-element mt-2">
            <CustomSkeleton
              show={address}
              altProps={{height: 75, width: 75, circle: true}}
            >
              <div className="walletImageOutline">
                <Avatar
                  address={address}
                  className="balance-avatar"
                  size={60}
                />
              </div>
            </CustomSkeleton>
          </div>
          <div className="inline-block-element wallet-data flex gap-2 flex-col">
            <Row>
              <Col xs={12}>
                <div className="flex my-2 items-center justify-start gap-2">
                  <h6 className="secondaryText width-fit">
                    {t('balance.this_is_your_address')}
                    <Button
                      className="inline-element"
                      icon={<Copy size={18} />}
                      onClick={() => copyToClipboard(address)}
                    />
                  </h6>
                </div>
                <div className="flex flex-row justify-start">
                  <CustomSkeleton
                    show={address}
                    altProps={{height: 20, width: 300}}
                  >
                    <div className="flex flex-row">
                      <h5 className="selectable-text">
                        <Truncate
                          text={address}
                          width={width || 1000}
                        />
                      </h5>
                    </div>
                  </CustomSkeleton>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between px-4 mt-4">
            <div className="inline-block-element text-center w-100">
              <h6 className="secondaryText text-center">{t('balance.your_balance')}</h6>
              <CustomSkeleton
                show={(!balanceLoading && balanceData && userBalance) || balanceError}
                altProps={{height: 20, width: 150}}
              >
                <h6
                  data-tip={balanceTooltip(balanceData)}
                  className="animate__animated animate__fadeIn text-center"
                >
                  {balanceError
                    ? t('balance.not_available')
                    : renderBalance({balanceData, balanceLoading, userBalance})}
                </h6>
              </CustomSkeleton>
            </div>
            <div className="inline-block-element ml-2">
              <div className="v-div" />
            </div>
            <div className="inline-block-element ml-2 w-100">
              <span>
                <h6 className="secondaryText text-center">{t('balance.btc_apx_value')}</h6>
                <CustomSkeleton
                  show={(!tickerLoading && tickerData && userBalance) || tickerError}
                  altProps={{height: 20, width: 150}}
                >
                  <h6
                    data-tip={balanceTooltip(balanceData)}
                    className="text-center"
                  >
                    {tickerError
                      ? t('balance.not_available')
                      : userBalanceToSymbolValue({
                          tickerData,
                          tickerLoading,
                          userBalance,
                          symbol: 'BTC',
                          ticker: 'BTCMINA',
                        })}
                  </h6>
                </CustomSkeleton>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
