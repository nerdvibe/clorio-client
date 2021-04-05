import { Table } from "react-bootstrap";
import Spinner from "../UI/Spinner";
import { getTotalPages } from "../../tools/utils";
import { useQuery } from "@apollo/client";
import Pagination from "../UI/pagination/Pagination";
import ReactTooltip from "react-tooltip";
import { GET_TRANSACTIONS_TOTAL } from "../../graphql/query";
import {
  ITransactionRowData,
  ITransactionTableProps,
} from "./TransactionsTypes";
import TransactionRow from "./TransactionRow";
import TransactionsTableError from "./TransactionsTableError";
import {
  mempoolQueryRowToTableRow,
  transactionQueryRowToTableRow,
} from "./TransactionsHelper";

const TransactionsTable = (props: ITransactionTableProps) => {
  const {
    transactions,
    error,
    mempool,
    loading,
    userId,
    userAddress,
    page,
    setOffset,
    balance,
  } = props;
  const { data: totalData } = useQuery(GET_TRANSACTIONS_TOTAL, {
    variables: { user: userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });
  if (error) {
    return TransactionsTableError(balance, true);
  }
  if (!transactions || transactions.user_commands.length === 0) {
    return TransactionsTableError(balance, false);
  }

  /**
   * Render table header labels
   * @returns HTMLElement
   */
  const renderTableHeader = () => {
    return (
      <tr className="th-background">
        <th className="th-first-item"></th>
        <th>ID</th>
        <th>Date</th>
        <th>Sender</th>
        <th>Recipient</th>
        <th className="th-last-item">Amount</th>
      </tr>
    );
  };

  /**
   * Render table body content
   * @returns HTMLElement
   */
  const renderTableBody = () => {
    return (
      <tbody>
        {mempool?.mempool?.map((row, index) => {
          const rowData: ITransactionRowData = mempoolQueryRowToTableRow(row);
          return TransactionRow(rowData, index, userAddress, true);
        })}
        {transactions?.user_commands?.map((row, index) => {
          const rowData: ITransactionRowData = transactionQueryRowToTableRow(
            row,
          );
          return TransactionRow(rowData, index, userAddress, false);
        })}
      </tbody>
    );
  };

  return (
    <div className="block-container">
      <Spinner className={"full-width"} show={loading}>
        <div>
          <ReactTooltip multiline={true} />
          <div id="transaction-table">
            <Table
              className="animate__animated animate__fadeIn"
              id="rwd-table-large">
              <thead>{renderTableHeader()}</thead>
              {renderTableBody()}
            </Table>
          </div>
          <Pagination
            page={page}
            setOffset={setOffset}
            user={userId}
            total={getTotalPages(
              totalData?.user_commands_aggregate?.aggregate?.count || 0,
            )}
          />
        </div>
      </Spinner>
    </div>
  );
};

export default TransactionsTable;
