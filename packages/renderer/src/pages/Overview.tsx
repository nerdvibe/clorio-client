import TransactionsTable from '../components/transactionsTable/TransactionsTable';
import Hoc from '../components/UI/Hoc';
import {useQuery} from '@apollo/client';
import {useEffect, useState} from 'react';
import {useContext} from 'react';
import {BalanceContext} from '/@/contexts/balance/BalanceContext';
import type {IBalanceContext} from '/@/contexts/balance/BalanceTypes';
import {
  getPageFromOffset,
  readSession,
  TRANSACTIONS_TABLE_ITEMS_PER_PAGE,
  DEFAULT_QUERY_REFRESH_INTERVAL,
} from '/@/tools';
import {GET_MEMPOOL, GET_TRANSACTIONS, GET_HOME_NEWS, GET_ID} from '/@/graphql/query';
import NewsBanner from '../components/UI/NewsBanner';
import type {IWalletData} from '/@/types/WalletData';
import type {
  ITransactionQueryResult,
  IMempoolQueryResult,
} from '../components/transactionsTable/TransactionsTypes';
import type {IHomeNewsQuery} from '/@/types/NewsData';
import {useWallet} from '../contexts/WalletContext';
import {useRecoilState, useRecoilValue} from 'recoil';
import {walletState} from '../store';
import {IWalletIdData} from '../types';

interface IProps {
  sessionData: IWalletData;
}

const Overview = ({sessionData}: IProps) => {
  const {balanceData} = useContext<Partial<IBalanceContext>>(BalanceContext);
  const balance = balanceData?.balances[sessionData.address];
  const {wallet} = useWallet();
  const [{id, address}, updateWalletState] = useRecoilState(walletState);
  const [offset, setOffset] = useState<number>(0);
  const [walletId, setWalletId] = useState<number>(+sessionData.id);
  const [loading, setLoading] = useState(true);
  const {data: newsData} = useQuery<IHomeNewsQuery>(GET_HOME_NEWS);
  const {data: walletIDData} = useQuery<IWalletIdData>(GET_ID, {
    variables: {
      publicKey: address,
    },
  });
  const lastNews = newsData?.newsHome && newsData?.newsHome.length > 0 && newsData?.newsHome[0];
  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: transactionsRefetch,
    stopPolling: transactionStopPolling,
    startPolling: transactionStartPolling,
  } = useQuery<ITransactionQueryResult>(GET_TRANSACTIONS, {
    variables: {accountId: +id || walletId, offset},
    fetchPolicy: 'network-only',
    skip: !id,
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });
  const {
    data: mempoolData,
    loading: mempoolLoading,
    refetch: mempoolRefetch,
    stopPolling: mempoolStopPolling,
    startPolling: mempoolStartPolling,
  } = useQuery<IMempoolQueryResult>(GET_MEMPOOL, {
    variables: {publicKey: sessionData.address},
    skip: !sessionData.address,
    fetchPolicy: 'network-only',
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });
  /**
   * Read the wallet id from the session data every 10 seconds until a valid id is retrieved
   */
  useEffect(() => {
    readWalletData();
  });

  useEffect(() => {
    if (walletIDData) {
      const newId = walletIDData?.idByPublicKey?.id;
      if (newId && newId !== id) {
        updateWalletState(state => ({
          ...state,
          id: newId,
        }));
      }
      if (newId === null) {
        updateWalletState(state => ({
          ...state,
          id: -1,
        }));
      }
    }
  }, [walletIDData]);

  /**
   * Read session data and set the wallet id in the component state
   */
  const readWalletData = async () => {
    const wallet = await readSession();
    if (wallet && wallet?.id !== -1) {
      setWalletId(wallet.id);
    }
  };

  /**
   * Set query offset param based on selected table page
   * @param {number} page Page number
   */
  const changeOffset = (page: number) => {
    setLoading(true);
    const data = (page - 1) * TRANSACTIONS_TABLE_ITEMS_PER_PAGE;
    setOffset(data);
  };

  /**
   * Restart polling interval
   * @param refetch force refetch data
   */
  const refetchData = (refetch = false) => {
    transactionStopPolling();
    mempoolStopPolling();
    if (refetch) {
      mempoolRefetch();
      transactionsRefetch();
    }
    setTimeout(() => {
      transactionStartPolling(DEFAULT_QUERY_REFRESH_INTERVAL);
      mempoolStartPolling(DEFAULT_QUERY_REFRESH_INTERVAL);
    }, 500);
  };

  useEffect(() => {
    if (transactionsData) {
      setLoading(false);
    }
  }, [transactionsData, mempoolData]);

  useEffect(() => {
    if (transactionsError) {
      setLoading(false);
    }
  }, [transactionsError]);

  return (
    <Hoc className="main-container">
      <div>
        <TransactionsTable    
          transactions={transactionsData}
          mempool={mempoolData}
          error={transactionsError}
          loading={loading}
          balance={+(balance?.total || 0)}
          setOffset={changeOffset}
          page={getPageFromOffset(offset)}
          userId={walletId}
          userAddress={sessionData.address}
          refetchData={refetchData}
        />
      </div>
    </Hoc>
  );
};

export default Overview;
