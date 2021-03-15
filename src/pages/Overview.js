import React from "react";
import Wallet from "../components/General/Wallet";
import Banner from "../components/General/Banner";
import TransactionsTable from "../components/Transactions/TransactionsTable";
import Hoc from "../components/General/Hoc";
import { useQuery, gql } from "@apollo/client";
import Spinner from "../components/General/Spinner";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

const TRANSACTIONS = gql`
  query GetTransactions($user: Int!, $offset: Int!) {
    user_commands(
      where: {
        _or: [{ receiver_id: { _eq: $user } }, { source_id: { _eq: $user } }]
      }
      order_by: { id: desc }
      limit: ${ITEMS_PER_PAGE}
      offset: $offset
    ) {
      amount
      fee
      id
      hash
      memo
      publicKeyBySourceId {
        value
      }
      publicKeyByReceiverId {
        value
      }
      token
      type
      valid_until
      nonce
      blocks_user_commands {
        block {
          height
          timestamp
          state_hash
        }
      }
    }
  }
`;

const GET_MEMPOOL = gql`
  query GetMempool($publicKey: String!) {
    mempool(publicKey: $publicKey) {
      id
      fee
      feeToken
      kind
      amount
      nonce
      source {
        publicKey
      }
      receiver {
        publicKey
      }
    }
  }
`;

const NEWS = gql`
  query NewsHome {
    news_home(limit: 1) {
      title
      subtitle
      link
      cta
      cta_color
    }
  }
`;

export default function Overview(props) {
  const [balance, setbalance] = useState(0);
  const [offset, setOffset] = useState(0);
  let queryResult;
  let mempool;
  if (props.sessionData) {
    const user = props.sessionData.id;
    queryResult = useQuery(TRANSACTIONS, {
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
  const news = useQuery(NEWS);

  /**
   * Set wallet balance inside component state
   * @param {object} data Wallet balance data
   */
  function setBalance(data) {
    if (!balance) {
      setbalance(data);
    } else {
      const difference =
        data.total !== balance.total || data.liquid !== balance.liquid;
      if (difference) {
        setbalance(data);
      }
    }
  }

  /**
   * If news are available, render banner
   * @returns HTMLElement
   */
  function renderBanner() {
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
        <Wallet setBalance={setBalance} />
        {renderBanner()}
        <TransactionsTable
          {...queryResult}
          mempool={mempool}
          balance={balance.total}
          setOffset={changeOffset}
          page={offset / ITEMS_PER_PAGE + 1}
          user={props.sessionData.id}
        />
      </Spinner>
    </Hoc>
  );
}
