import {useQuery as useRestQuery} from '@tanstack/react-query';
import {useContext, useEffect, useState} from 'react';
import NewsBanner from '../components/UI/NewsBanner';
import Hoc from '../components/UI/Hoc';
import TransactionsTable from '../components/transactionsTable/TransactionsTable';
import {BalanceContext} from '/@/contexts/balance/BalanceContext';
import type {IBalanceContext} from '/@/contexts/balance/BalanceTypes';
import {
  DEFAULT_QUERY_REFRESH_INTERVAL,
  getPageFromOffset,
  TRANSACTIONS_TABLE_ITEMS_PER_PAGE,
} from '/@/tools';
import {getNews} from '/@/api/content';
import {getMempool, getTransactions} from '/@/api/transactions';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';
import type {IWalletData} from '/@/types/WalletData';

interface IProps {
  sessionData: IWalletData;
}

const Overview = ({sessionData}: IProps) => {
  const {balanceData} = useContext<Partial<IBalanceContext>>(BalanceContext);
  const balance = balanceData?.balances?.[sessionData.address];
  const {settings} = useNetworkSettingsContext();
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const {data: newsData} = useRestQuery({
    queryKey: ['news', settings?.apiUrl, 'home'],
    queryFn: () => getNews(settings!.apiUrl, 'home'),
    enabled: Boolean(settings),
  });

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: transactionsRefetch,
  } = useRestQuery({
    queryKey: [
      'transactions',
      settings?.apiUrl,
      sessionData.address,
      offset,
      TRANSACTIONS_TABLE_ITEMS_PER_PAGE,
    ],
    queryFn: () =>
      getTransactions(
        settings!.apiUrl,
        sessionData.address,
        offset,
        TRANSACTIONS_TABLE_ITEMS_PER_PAGE,
      ),
    enabled: Boolean(settings && sessionData.address),
  });

  const {
    data: mempoolData,
    isLoading: mempoolLoading,
    refetch: mempoolRefetch,
  } = useRestQuery({
    queryKey: ['mempool', settings?.apiUrl, sessionData.address],
    queryFn: () => getMempool(settings!.apiUrl, sessionData.address),
    enabled: Boolean(settings && sessionData.address),
    refetchInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });

  const lastNews = newsData?.[0];

  const changeOffset = (page: number) => {
    setLoading(true);
    const data = (page - 1) * TRANSACTIONS_TABLE_ITEMS_PER_PAGE;
    setOffset(data);
  };

  const refetchData = (refetch = false) => {
    if (refetch) {
      void mempoolRefetch();
      void transactionsRefetch();
    }
  };

  useEffect(() => {
    if (transactionsData || mempoolData || transactionsError) {
      setLoading(false);
    }
  }, [transactionsData, mempoolData, transactionsError]);

  const currentBalance = balance?.total ? +balance.total : 0;

  return (
    <Hoc className="main-container overview-container">
      <div>
        {lastNews && <NewsBanner {...lastNews} />}
        <TransactionsTable
          transactions={transactionsData}
          mempool={mempoolData}
          error={transactionsError}
          loading={loading || transactionsLoading || mempoolLoading}
          balance={currentBalance}
          setOffset={changeOffset}
          page={getPageFromOffset(offset)}
          userAddress={sessionData.address}
          refetchData={refetchData}
        />
      </div>
    </Hoc>
  );
};

export default Overview;
