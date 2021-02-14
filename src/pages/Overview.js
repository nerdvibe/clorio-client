import React from 'react';
import Wallet from '../components/Wallet'
import Banner from '../components/Banner'
import TransactionTable from '../components/TransactionTable'
import Hoc from '../components/Hoc'
import { useQuery, gql } from '@apollo/client';

const EXCHANGE_RATES = gql`
  query GetTransactions {
    public_keys(where: {value: {_eq: "B62qmmLsKD4G4oRzPVTTxcxgAtmN6SF1oMs96RyZ7yt5PsZNoS2kjtT"}}) {
        id
        value
      }
  }
`;


function Overview(props) {
  const queryResult = useQuery(EXCHANGE_RATES);
  return (
    <Hoc className="main-container">
        <Wallet />
        <Banner />
        <TransactionTable {...queryResult } />
    </Hoc>
  )
}

export default Overview;
