import {useEffect, useContext, useRef, useState, useMemo} from 'react';
import {Copy} from 'react-feather';
import {useQuery} from '@apollo/client';
import Avatar from '../../tools/avatar/avatar';
import {copyToClipboard, DEFAULT_QUERY_REFRESH_INTERVAL} from '../../tools';
import ReactTooltip from 'react-tooltip';
import {GET_TICKER, GET_BALANCE} from '../../graphql/query';
import {formatBalance} from './BalanceHelper';
import type {IBalanceQueryResult, ITicker} from './BalanceTypes';
import type {IBalanceContext} from '../../contexts/balance/BalanceTypes';
import {BalanceContext} from '../../contexts/balance/BalanceContext';
import {balanceTooltip} from './util';
import CustomSkeleton from '../CustomSkeleton';
import {useRecoilValue} from 'recoil';
import {walletState} from '/@/store';
import {MiddleTruncate} from '@re-dev/react-truncate';
import {AnimatePresence, motion} from 'framer-motion';

const Balance = () => {
  const wallet = useRecoilValue(walletState);
  const {address} = wallet;
  const addressContainerRef = useRef(null);
  const [currentBalanceLabelIndex, setCurrentBalanceLabelIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const {
    addBalance,
    setBalanceContext,
    shouldBalanceUpdate,
    setShouldBalanceUpdate,
    balanceData: balance,
  } = useContext<Partial<IBalanceContext>>(BalanceContext);
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
  const {
    data: tickerData,
    loading: tickerLoading,
    error: tickerError,
  } = useQuery<ITicker>(GET_TICKER);

  const isLoadingBalance = balanceLoading;
  const storedUserBalance =
    (balance?.balances[address] && balance?.balances[address].unconfirmedTotal) || 0;
  const userBalance =
    balanceData?.accountByKey?.balance?.unconfirmedTotal || storedUserBalance || 0;

  const memoBalance = useMemo(
    () => formatBalance({balanceData, userBalance, tickerData}),
    [balanceData, balanceLoading, userBalance, tickerData, tickerLoading],
  );
  const memoBalanceLabels = {
    mina: 'Balance',
    btc: 'BTC Apx. value',
    usdt: 'USDT Apx. value',
  };

  const currentBalanceLabel = Object.keys(memoBalanceLabels)[currentBalanceLabelIndex];

  const updateBalanceLabel = () => {
    setCurrentBalanceLabelIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % 3;
      return newIndex;
    });
  };

  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(updateBalanceLabel, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleButtonClick = () => {
    updateBalanceLabel();
    startInterval();
  };

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

  return (
    <AnimatePresence>
      <div className="glass-card px-3 py-2 flex justify-center balance-card">
        <ReactTooltip multiline={true} />
        <div className="flex flex-row w-100 justify-start gap-4 py-4">
          <div>
            <Avatar
              address={address}
              size={100}
              radius={20}
            />
          </div>
          <div className="flex w-100">
            <div className="flex flex-col justify-content-center w-100">
              <div className="flex flex-col w-100 balance-data">
                <div
                  className="flex flex-col justify-start w-100"
                  ref={addressContainerRef}
                >
                  <div className="text-sm text-start text-muted">
                    Address
                    <Copy
                      className="cursor-pointer copy-icon"
                      onClick={() => copyToClipboard(address)}
                    />
                  </div>
                  <span className="flex flex-row text-start address-text">
                    <MiddleTruncate end={15}>{address}</MiddleTruncate>
                  </span>
                </div>
                <div className="flex flex-row gap-4 w-100 justify-start balance_container">
                  {Object.keys(memoBalanceLabels).map(key => (
                    <div
                      key={key}
                      className="flex flex-col hide-small-balance"
                    >
                      <div className="text-sm text-start text-muted">{memoBalanceLabels[key]}</div>
                      <CustomSkeleton
                        show={isLoadingBalance}
                        altProps={{height: 20, width: 150}}
                      >
                        <h4
                          data-tip={balanceTooltip(balanceData)}
                          className="animate__animated animate__fadeIn"
                        >
                          {memoBalance[key] || 'Not available'}
                        </h4>
                      </CustomSkeleton>
                    </div>
                  ))}
                  <div
                    className="flex flex-col show-small-balance"
                    onClick={handleButtonClick}
                  >
                    {currentBalanceLabel && (
                      <>
                        <div className="text-sm text-start text-muted">
                          <motion.div
                            className="text-sm text-start text-muted"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            key={currentBalanceLabel}
                            transition={{
                              duration: 0.25,
                              delay: 0.2,
                            }}
                          >
                            {memoBalanceLabels[currentBalanceLabel]}
                          </motion.div>
                        </div>
                        <motion.h4
                          // data-tip={balanceTooltip(balanceData)}
                          className="animate__animated animate__fadeIn"
                          initial={{opacity: 0}}
                          animate={{opacity: 1}}
                          exit={{opacity: 0}}
                          key={currentBalanceLabel}
                          transition={{
                            duration: 0.25,
                            delay: 0.4,
                          }}
                        >
                          {memoBalance[currentBalanceLabel]}
                        </motion.h4>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default Balance;
