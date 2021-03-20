import React from "react";
import Banner from "../components/General/Banner";
import TransactionsTable from "../components/Transactions/TransactionsTable";
import Hoc from "../components/General/Hoc";
import { useQuery, gql } from "@apollo/client";
import Spinner from "../components/General/Spinner";
import { useState } from "react";
import { useContext } from "react";
import { BalanceContext } from "../context/BalanceContext";
import { ITEMS_PER_PAGE } from "../tools/const";
import { getPageFromOffset } from "../tools/utils";
import { GET_MEMPOOL, GET_TRANSACTIONS,GET_HOME_NEWS } from "../tools/query";

export default function Overview(props) {
  const { balance } = useContext(BalanceContext);
  const [offset, setOffset] = useState(0);
  let queryResult;
  let mempool;
  if (props.sessionData) {
    const user = props.sessionData.id;
    queryResult = useQuery(GET_TRANSACTIONS, {
      variables: { user, offset },
      fetchPolicy: "network-only",
      skip: !user,
    });
    mempool = useQuery(GET_MEMPOOL, {
      variables: { publicKey: props.sessionData.address },
      skip: !props.sessionData.address,
      fetchPolicy: "network-only",
    });
  }
  const news = useQuery(GET_HOME_NEWS);

  /**
   * Set query offset param based on selected table page
   * @param {number} page Page number
   */
  function changeOffset(page) {
    const data = (page - 1) * ITEMS_PER_PAGE;
    setOffset(data);
  }

  /**
   * If news are available, render banner
   * @returns HTMLElement
   */
  function renderNewsBanner() {
    if (news.data && news.data.news_home && news.data.news_home.length > 0) {
      const latest = news.data.news_home[0];
      return (
        <Banner
          title={latest.title}
          subtitle={latest.subtitle}
          link={latest.link}
          cta={latest.cta}
          cta_color={latest.cta_color}
        />
      );
    }
  }

  return (
    <Hoc className="main-container">
      <Spinner show={queryResult.loading}>
        {renderNewsBanner()}
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
