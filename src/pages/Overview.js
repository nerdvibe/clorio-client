import React from "react";
import { Banner } from "../components/General/Banner";
import TransactionsTable from "../components/Transactions/TransactionsTable";
import Hoc from "../components/General/Hoc";
import { useQuery } from "@apollo/client";
import Spinner from "../components/General/Spinner";
import { useState } from "react";
import { useContext } from "react";
import { BalanceContext } from "../context/BalanceContext";
import { ITEMS_PER_PAGE, DEFAULT_INTERVAL } from "../tools/const";
import { getPageFromOffset } from "../tools/utils";
import { GET_MEMPOOL, GET_TRANSACTIONS, GET_HOME_NEWS } from "../graphql/query";

export default function Overview(props) {
  const { balance } = useContext(BalanceContext);
  const [offset, setOffset] = useState(0);
  const news = useQuery(GET_HOME_NEWS);
  const latestNews =
    news.data?.news_home.length > 0 ? news.data?.news_home[0] : {};
  let queryResult;
  let mempool;
  if (props.sessionData) {
    const user = props.sessionData.id;
    queryResult = useQuery(GET_TRANSACTIONS, {
      variables: { user, offset },
      fetchPolicy: "network-only",
      skip: !user,
      pollInterval: DEFAULT_INTERVAL
    });
    mempool = useQuery(GET_MEMPOOL, {
      variables: { publicKey: props.sessionData.address },
      skip: !props.sessionData.address,
      fetchPolicy: "network-only",
      pollInterval: DEFAULT_INTERVAL
    });
  }

  /**
   * Set query offset param based on selected table page
   * @param {number} page Page number
   */
  function changeOffset(page) {
    const data = (page - 1) * ITEMS_PER_PAGE;
    setOffset(data);
  }

  return (
    <Hoc className="main-container">
      <Spinner show={queryResult.loading}>
        <Banner newsData={latestNews} />
        <TransactionsTable
          {...queryResult}
          mempool={mempool}
          balance={balance.total}
          setOffset={changeOffset}
          page={getPageFromOffset(offset)}
          userId={props.sessionData.id}
          userAddress={props.sessionData.address}
        />
      </Spinner>
    </Hoc>
  );
}
