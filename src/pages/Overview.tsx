import TransactionsTable from "../components/transactions-table/TransactionsTable";
import Hoc from "../components/general/Hoc";
import { useQuery } from "@apollo/client";
import Spinner from "../components/general/Spinner";
import { useState } from "react";
import { useContext } from "react";
import { BalanceContext } from "../context/balance/BalanceContext";
import { ITEMS_PER_PAGE, DEFAULT_INTERVAL } from "../tools/const";
import { getPageFromOffset } from "../tools/utils";
import { GET_MEMPOOL, GET_TRANSACTIONS, GET_HOME_NEWS } from "../graphql/query";
import { Banner } from "../components/general/Banner";
import { IWalletData } from "../models/wallet-data";
import { ITransactionQueryResult,IMempoolQueryResult } from "../components/transactions-table/transactions";

interface IProps{
  sessionData:IWalletData
}

export default function Overview(props:IProps) {
  const {sessionData} = props;
  const { balance }:any = useContext(BalanceContext);
  const [offset, setOffset] = useState(0);
  const news = useQuery(GET_HOME_NEWS);
  const latestNews = news.data?.news_home.length > 0 ? news.data?.news_home[0] : {};
  const transactions = useQuery<ITransactionQueryResult>(GET_TRANSACTIONS, {
    variables: { user:sessionData.id, offset },
    fetchPolicy: "network-only",
    skip: !sessionData.id,
    pollInterval: DEFAULT_INTERVAL
  });
  const mempool = useQuery<IMempoolQueryResult>(GET_MEMPOOL, {
    variables: { publicKey: sessionData.address },
    skip: !sessionData.address,
    fetchPolicy: "network-only",
    pollInterval: DEFAULT_INTERVAL
  });

  /**
   * Set query offset param based on selected table page
   * @param {number} page Page number
   */
  function changeOffset(page:number) {
    const data = (page - 1) * ITEMS_PER_PAGE;
    setOffset(data);
  }

  return (
    <Hoc className="main-container">
      <Spinner show={transactions.loading}>
        <div>
          <Banner {...latestNews} />
          <TransactionsTable
            transactions={transactions.data}
            mempool={mempool.data}
            error={transactions.error}
            loading={transactions.loading || mempool.loading}
            balance={balance.total}
            setOffset={changeOffset}
            page={getPageFromOffset(offset)}
            userId={sessionData.id}
            userAddress={sessionData.address}
          />
        </div>
      </Spinner>
    </Hoc>
  );
}
