import React from 'react';
import Wallet from '../components/Wallet'
import Banner from '../components/Banner'
import TransactionTable from '../components/TransactionTable'
import Hoc from '../components/Hoc'

function Overview() {
  return (
    <Hoc className="mx-auto Home">
        <Wallet />
        <Banner />
        <TransactionTable />
    </Hoc>
  )
}

export default Overview;
