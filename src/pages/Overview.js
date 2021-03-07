import React from "react";
import Wallet from "../components/Wallet";
import Banner from "../components/Banner";
import TransactionTable from "../components/TransactionTable";
import Hoc from "../components/Hoc";
import { useQuery, gql } from "@apollo/client";
import Spinner from "../components/General/Spinner";
import { useState } from "react";

const TRANSACTIONS = gql`
  query GetTransactions($user: Int!) {
    user_commands(
      where: {
        _or: [{ receiver_id: { _eq: $user } }, { source_id: { _eq: $user } }]
      }
      order_by: { id: desc }
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
    news_home(order_by: { created_at: desc }, limit: 1) {
      title
      subtitle
      link
      cta
      cta_color
    }
  }
`;

function Overview(props) {
  const [balance, setbalance] = useState(0);
  let queryResult;
  let mempool;
  if (props.sessionData) {
    const user = props.sessionData.id;
    queryResult = useQuery(TRANSACTIONS, {
      variables: { user },
      fetchPolicy: "network-only",
    });
    mempool = useQuery(GET_MEMPOOL, {
      variables: { publicKey: props.sessionData.address },
      skip: !props.sessionData.address,
    });
  }
  const news = useQuery(NEWS);
  return (
    <Hoc className="main-container">
      <Spinner show={!queryResult || queryResult.loading}>
        <Wallet setBalance={setBalance} />
        {renderBanner()}
        <TransactionTable
          {...queryResult}
          mempool={mempool}
          balance={balance.total}
        />
      </Spinner>
    </Hoc>
  );

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

  function renderBanner() {
    if (news.data && news.data.news_home && news.data.news_home.length > 0) {
      const latest = news.data.news_home[0];
      return (
        <Banner
          title={latest.title}
          subtitle={latest.subtitle}
          link={latest.link}
          cta={latest.cta}
          cta={latest.cta_color}
        />
      );
    }
  }
}

export default Overview;
