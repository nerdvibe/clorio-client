import TransactionsTable from "../components/transactionsTable/TransactionsTable";
import Hoc from "../components/UI/Hoc";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useContext } from "react";
import { BalanceContext } from "../contexts/balance/BalanceContext";
import { IBalanceContext } from "../contexts/balance/BalanceTypes";
import {
  getPageFromOffset,
  TRANSACTIONS_TABLE_ITEMS_PER_PAGE,
  DEFAULT_QUERY_REFRESH_INTERVAL,
} from "../tools";
import { GET_MEMPOOL, GET_TRANSACTIONS, GET_HOME_NEWS } from "../graphql/query";
import NewsBanner from "../components/UI/NewsBanner";
import { IWalletData } from "../types/WalletData";
import {
  ITransactionQueryResult,
  IMempoolQueryResult,
} from "../components/transactionsTable/TransactionsTypes";
import { IHomeNewsQuery } from "../types/NewsData";

interface IProps {
  sessionData: IWalletData;
}

const Overview = ({ sessionData }: IProps) => {
  const { balance } = useContext<Partial<IBalanceContext>>(BalanceContext);
  const [offset, setOffset] = useState<number>(0);
  const { data: newsData } = useQuery<IHomeNewsQuery>(GET_HOME_NEWS);
  const latestNews =
    newsData?.news_home && newsData?.news_home.length > 0
      ? newsData?.news_home[0]
      : {};
  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: transactionsRefetch,
    stopPolling: transactionStopPolling,
    startPolling: transactionStartPolling,
  } = useQuery<ITransactionQueryResult>(GET_TRANSACTIONS, {
    variables: { user: sessionData.id, offset },
    fetchPolicy: "network-only",
    skip: !sessionData.id,
  });
  const {
    data: mempoolData,
    loading: mempoolLoading,
    refetch: mempoolRefetch,
    stopPolling: mempoolStopPolling,
    startPolling: mempoolStartPolling,
  } = useQuery<IMempoolQueryResult>(GET_MEMPOOL, {
    variables: { publicKey: sessionData.address },
    skip: !sessionData.address,
    fetchPolicy: "network-only",
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });

  /**
   * Set query offset param based on selected table page
   * @param {number} page Page number
   */
  const changeOffset = (page: number) => {
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

  return (
    <Hoc className="main-container">
      <div>
        <NewsBanner {...latestNews} />
        <TransactionsTable
          transactions={transactionsData}
          mempool={mempoolData}
          error={transactionsError}
          loading={transactionsLoading || mempoolLoading}
          balance={+(balance?.total || 0)}
          setOffset={changeOffset}
          page={getPageFromOffset(offset)}
          userId={sessionData.id}
          userAddress={sessionData.address}
          refetchData={refetchData}
        />
      </div>
    </Hoc>
  );
};

export default Overview;
