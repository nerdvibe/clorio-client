import { Table } from "react-bootstrap";
import Spinner from "../general/Spinner";
import { getTotalPages } from "../../tools/utils";
import { useQuery } from "@apollo/client";
import Pagination from "../general/pagination/Pagination";
import ReactTooltip from "react-tooltip";
import { GET_TRANSACTIONS_TOTAL } from "../../graphql/query";
import { ITransactionTableProps } from "./Transactions";
import TransactionRow from "./TransactionRow";
import MempoolRow from "./MempoolRow";
import TransactionsTableError from "./TransactionsTableError";
import TransactionTableEmptyState from "./TransactionTableEmptyState";

export default function TransactionsTable(props:ITransactionTableProps) {
  const { transactions, error, mempool, loading, userId, userAddress, page, setOffset, balance } = props;
  const total = useQuery(GET_TRANSACTIONS_TOTAL, {
    variables: { user: userId },
    skip: !userId,
    fetchPolicy: "network-only",
  });
  if (error) {
    return TransactionsTableError(balance);
  }
  if (!transactions || transactions.user_commands.length === 0) {
    return TransactionTableEmptyState(balance);
  }

  /**
   * Render table header labels
   * @returns HTMLElement
   */
  function renderTableHeader() {
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
  }

  /**
   * Render table body content
   * @returns HTMLElement
   */
  function renderTableBody() {
    return (
      <tbody>
        {mempool?.mempool?.map((row, index) => {
          return MempoolRow(row, index,userAddress);
        })}
        {transactions?.user_commands?.map((row, index) => {
          return TransactionRow(row, index, userAddress);
        })}
      </tbody>
    );
  }

  return (
    <div className="block-container">
      <Spinner className={"full-width"} show={loading}>
        <div>
          <ReactTooltip multiline={true} />
          <div id="transaction-table">
            <Table
              className="animate__animated animate__fadeIn"
              id="rwd-table-large"
            >
              <thead>{renderTableHeader()}</thead>
              {renderTableBody()}
            </Table>
          </div>
          <Pagination
            page={page}
            setOffset={setOffset}
            user={userId}
            total={getTotalPages(
              total.data?.user_commands_aggregate?.aggregate?.count || 0
            )}
          />
        </div>
      </Spinner>
    </div>
  );
}
