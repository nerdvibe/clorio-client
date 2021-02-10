import React from 'react';
import Wallet from '../components/Wallet'
import Banner from '../components/Banner'
import TransactionTable from '../components/TransactionTable'
import Hoc from '../components/Hoc'

function Overview(props) {
  return (
    <Hoc className="main-container">
        <Wallet />
        <Banner />
        <TransactionTable />
    </Hoc>
  )
}

export default Overview;
