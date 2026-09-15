import React, {useMemo} from 'react';
import {AlertTriangle} from 'react-feather';
import Spinner from '../UI/Spinner';
import {getTotalPages} from '../../tools/utils';
import {useQuery} from '@tanstack/react-query';
import Pagination from '../UI/pagination/Pagination';
import ReactTooltip from 'react-tooltip';
import {getBlacklist} from '../../api/content';
import {useNetworkSettingsContext} from '../../contexts/NetworkContext';
import type {
  ITransactionRowData,
  ITransactionTableProps,
} from './TransactionsTypes';
import TransactionRow from './TransactionRow';
import TransactionCard from './TransactionCard';
import TransactionsTableError from './TransactionsTableError';
import {mempoolQueryRowToTableRow, transactionQueryRowToTableRow} from './TransactionsHelper';
import WalletCreationTransaction, {WalletCreationTransactionCard} from './WalletCreationTransaction';
import RefetchTransactions from './RefetchTransactions';
import type {Blacklist} from '../../types/Blacklist';
import {TRANSACTIONS_TABLE_ITEMS_PER_PAGE} from '/@/tools';
import './TransactionsTable.scss';

const TransactionsTable = ({
  transactions,
  error,
  mempool,
  loading,
  userAddress,
  page,
  setOffset,
  balance,
  refetchData,
}: ITransactionTableProps) => {
  const {settings} = useNetworkSettingsContext();
  const {data: blacklist, error: blacklistError} = useQuery<Blacklist>({
    queryKey: ['blacklist', settings?.apiUrl],
    queryFn: () => getBlacklist(settings!.apiUrl),
    enabled: Boolean(settings),
    retry: false,
  });

  const blacklistAddresses = blacklist?.blacklistedAddresses || [];

  const mempoolCount = mempool?.mempool?.length || 0;

  const mempoolRows = useMemo(
    () =>
      mempool?.mempool?.map((row, idx) => {
        const rowData: ITransactionRowData = mempoolQueryRowToTableRow(row);
        return (
          <TransactionRow
            key={`mempool-tx-${idx}`}
            rowData={rowData}
            index={idx}
            userAddress={userAddress}
            blacklist={blacklistAddresses}
            isMempool={true}
          />
        );
      }) || [],
    [mempool, userAddress, blacklistAddresses],
  );

  const mempoolCards = useMemo(
    () =>
      mempool?.mempool?.map((row, idx) => {
        const rowData: ITransactionRowData = mempoolQueryRowToTableRow(row);
        return (
          <TransactionCard
            key={`mempool-card-${idx}`}
            rowData={rowData}
            index={idx}
            userAddress={userAddress}
            blacklist={blacklistAddresses}
            isMempool={true}
          />
        );
      }) || [],
    [mempool, userAddress, blacklistAddresses],
  );

  const txRows = useMemo(
    () =>
      transactions?.transactions?.map((row, idx) => {
        const rowData: ITransactionRowData = transactionQueryRowToTableRow(row);
        return (
          <TransactionRow
            key={`tx-${idx}`}
            rowData={rowData}
            index={mempoolCount + idx}
            userAddress={userAddress}
            blacklist={blacklistAddresses}
            isMempool={false}
          />
        );
      }) || [],
    [transactions, userAddress, blacklistAddresses, mempoolCount],
  );

  const txCards = useMemo(
    () =>
      transactions?.transactions?.map((row, idx) => {
        const rowData: ITransactionRowData = transactionQueryRowToTableRow(row);
        return (
          <TransactionCard
            key={`tx-card-${idx}`}
            rowData={rowData}
            index={mempoolCount + idx}
            userAddress={userAddress}
            blacklist={blacklistAddresses}
            isMempool={false}
          />
        );
      }) || [],
    [transactions, userAddress, blacklistAddresses, mempoolCount],
  );

  const showWalletCreationFee = useMemo(() => {
    const totalRows = transactions?.total || 0;
    const isLastPage = +page === +getTotalPages(totalRows);
    return Boolean(
      transactions?.transactions?.length &&
        (transactions.transactions.length < TRANSACTIONS_TABLE_ITEMS_PER_PAGE || isLastPage),
    );
  }, [transactions, page]);

  const walletCreationRow = showWalletCreationFee
    ? WalletCreationTransaction((transactions?.total || 0) + 1)
    : null;

  if (
    !loading &&
    (error ||
      !transactions ||
      transactions?.transactions === null ||
      (transactions?.transactions && transactions?.transactions.length === 0) ||
      !transactions.total)
  ) {
    return TransactionsTableError(balance, error, refetchData);
  }

  return (
    <div className="glass-card px-4 pt-3 mb-5 pb-3">
      <Spinner
        className={'full-width'}
        show={loading}
      >
        <ReactTooltip multiline={true} />
        <div className="tx-table-toolbar">
          {blacklistError && (
            <div className="tx-safety-warning" role="status">
              <span
                className="tx-safety-warning__icon"
                role="img"
                tabIndex={0}
                aria-label="Blacklist safety data unavailable"
                title="Blacklist safety data is unavailable. Review transaction addresses carefully."
                data-tooltip="Blacklist safety data is unavailable. Review transaction addresses carefully."
                data-tip="Blacklist safety data is unavailable. Review transaction addresses carefully."
                data-place="top"
              >
                <AlertTriangle size={18} />
              </span>
            </div>
          )}
          <RefetchTransactions refetch={refetchData} />
        </div>

        <div className="tx-table-container">
          <table className="tx-table animate__animated animate__fadeIn">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Transaction</th>
                <th scope="col">Date</th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th
                  scope="col"
                  className="text-right"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {mempoolRows}
              {txRows}
              {walletCreationRow}
            </tbody>
          </table>
        </div>

        <div className="tx-card-list animate__animated animate__fadeIn">
          {mempoolCards}
          {txCards}
          {showWalletCreationFee && <WalletCreationTransactionCard />}
        </div>

        <Pagination
          page={page}
          setOffset={setOffset}
          total={getTotalPages(transactions?.total || 0)}
        />
      </Spinner>
    </div>
  );
};

export default TransactionsTable;
