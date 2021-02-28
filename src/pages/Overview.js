import React from 'react';
import Wallet from '../components/Wallet'
import Banner from '../components/Banner'
import TransactionTable from '../components/TransactionTable'
import Hoc from '../components/Hoc'
import { useQuery, gql } from '@apollo/client';
import Spinner from '../components/General/Spinner';
import { useState } from 'react';

const TRANSACTIONS = gql`
  query GetTransactions  ($user: Int!){
    user_commands(where: {source_id: {_eq: $user}}, limit: 10, offset: 10) {
      amount
      failure_reason
      fee
      id
      hash
      memo
      receiver_id
      source_id
      status
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

const NEWS = gql `
  query NewsHome {
    news_home(order_by: {created_at: desc}, limit: 1) {
      title
      subtitle
      link
      cta
      cta_color
    }
  }
`

function Overview(props) {
  const [balance, setbalance] = useState(0)
  let queryResult;
  if(props.sessionData){
    const user = props.sessionData.id
    queryResult = useQuery(TRANSACTIONS,{
      variables: { user }
    });
  }
  const news = useQuery(NEWS);
  return (
    <Hoc className="main-container">
      <Spinner show={!queryResult || queryResult.loading}>
        <Wallet 
        setBalance={setBalance} />
        {news.data && 
          <Banner 
            title={news.data.news_home[0].title} 
            subtitle={news.data.news_home[0].subtitle} 
            link={news.data.news_home[0].link}
            cta={news.data.news_home[0].cta}
            cta={news.data.news_home[0].cta_color}
            />}
        <TransactionTable {...queryResult } balance={balance} />
      </Spinner>
    </Hoc>
  )

  function setBalance(total){
    setbalance(total)
  }
}

export default Overview;
