import React from 'react';
import Wallet from '../components/Wallet'
import Banner from '../components/Banner'
import TransactionTable from '../components/TransactionTable'
import Hoc from '../components/Hoc'
import { useQuery, gql } from '@apollo/client';
import Spinner from '../components/General/Spinner';

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


function Overview(props) {
  let queryResult;
  if(props.sessionData){
    const user = props.sessionData.id
    queryResult = useQuery(TRANSACTIONS,{
      variables: { user }
    });
  }
  return (
    <Hoc className="main-container">
      <Spinner show={!queryResult || queryResult.loading}>
        <Wallet />
        <Banner />
        <TransactionTable {...queryResult } />
      </Spinner>
    </Hoc>
  )
}

export default Overview;
