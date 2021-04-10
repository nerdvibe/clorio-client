import TransactionsTable from "../components/transactionsTable/TransactionsTable";
import Hoc from "../components/UI/Hoc";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useContext } from "react";
import { BalanceContext } from "../context/balance/BalanceContext";
import { ITEMS_PER_PAGE, DEFAULT_INTERVAL } from "../tools/const";
import { getPageFromOffset } from "../tools/utils";
import { GET_MEMPOOL, GET_TRANSACTIONS, GET_HOME_NEWS } from "../graphql/query";
import NewsBanner from "../components/UI/NewsBanner";
import { IWalletData } from "../types/WalletData";
import {
  ITransactionQueryResult,
  IMempoolQueryResult,
} from "../components/transactionsTable/TransactionsTypes";
import { IHomeNewsQuery } from "../types/NewsData";
import { IBalanceContext } from "../context/balance/BalanceTypes";

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
  } = useQuery<ITransactionQueryResult>(GET_TRANSACTIONS, {
    variables: { user: sessionData.id, offset },
    fetchPolicy: "network-only",
    skip: !sessionData.id,
    pollInterval: DEFAULT_INTERVAL,
  });
  const {
    data: mempoolData,
    loading: mempoolLoading,
  } = useQuery<IMempoolQueryResult>(GET_MEMPOOL, {
    variables: { publicKey: sessionData.address },
    skip: !sessionData.address,
    fetchPolicy: "network-only",
    pollInterval: DEFAULT_INTERVAL,
  });

  /**
   * Set query offset param based on selected table page
   * @param {number} page Page number
   */
  const changeOffset = (page: number) => {
    const data = (page - 1) * ITEMS_PER_PAGE;
    setOffset(data);
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
        />
      </div>
    </Hoc>
  );
};

export default Overview;
