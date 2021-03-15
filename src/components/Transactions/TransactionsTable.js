import React from "react";
import { Table } from "react-bootstrap";
import Spinner from "../General/Spinner";
import ErrorImage from "../../assets/Error.png";
import NoTransactionsOrNotAvailableImage from "../../assets/NoTransactionsOrNotAvailable.svg";
import TxHistoryNotAvailableImage from "../../assets/TxHistoryNotAvailable.svg";
import NoTransactions from "../../assets/NoTransactions.svg";
import { timestampToDate, toMINA } from "../../tools/utils";
import Big from "big.js";
import { useQuery, gql } from "@apollo/client";
import Pagination from "../General/Pagination";

const ITEMS_PER_PAGE = 10;
const GET_TRANSACTIONS_TOTAL = gql`
  query TransactionsTotal($user: Int!) {
    user_commands_aggregate(
      where: {
        _or: [{ receiver_id: { _eq: $user } }, { source_id: { _eq: $user } }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export default function TransactionsTable(props) {
  const { loading, error, data, mempool, user } = props;
  const total = useQuery(GET_TRANSACTIONS_TOTAL, {
    variables: { user },
    skip: !user,
    fetchPolicy: "network-only",
  });
  if (error || mempool.error) {
    return renderError();
  }
  if (!data || data.user_commands.length === 0) {
    return renderEmptyState();
  }

  /**
   * Render table header labels
   * @returns HTMLElement
   */
  function renderTableHeader() {
    return (
      <tr className="th-background">
        <th className="th-first-item">ID</th>
        <th>Date</th>
        <th>Sender</th>
        <th>Recipient</th>
        <th className="th-last-item">Amount</th>
      </tr>
    );
  }

  /**
   * Render transaction row
   * @param {object} row Object containing row data
   * @param {number} index Index of the row
   * @returns HTMLElement
   */
  function renderTransactionRow(row, index) {
    const { timestamp, state_hash } = row.blocks_user_commands[0].block;
    const amount = row.amount ? toMINA(row.amount) : 0;
    return (
      <tr key={index}>
        <td className="table-element">
          <a
            href={`https://devnet.minaexplorer.com/block/${state_hash}`}
            target="_blank"
            rel="noreferrer"
          >
            {row.hash}
          </a>
        </td>
        <td className="table-element">{timestampToDate(timestamp)}</td>
        <td className="table-element">{row.publicKeyBySourceId.value}</td>
        <td className="table-element">{row.publicKeyByReceiverId.value}</td>
        <td className="table-element">{amount} MINA</td>
      </tr>
    );
  }

  /**
   * Render mempool transaction row
   * @param {object} row Object containing row data
   * @param {*} index Index of the row
   * @returns HTMLElement
   */
  function renderMempoolRow(row, index) {
    const amount = row.amount ? Big(row.amount).mul(1e-9).toFixed(3) : 0;
    return (
      <tr key={index}>
        <td className="table-element">
          <a
            href={`https://devnet.minaexplorer.com/payment/${row.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {row.id}
          </a>
        </td>
        <td className="table-element">Waiting for confirmation</td>
        <td className="table-element">{row.source && row.source.publicKey}</td>
        <td className="table-element">
          {row.receiver && row.receiver.publicKey}
        </td>
        <td className="table-element">{amount} MINA</td>
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
        {mempool.data &&
          mempool.data.mempool &&
          mempool.data.mempool.map((row, index) => {
            return renderMempoolRow(row, index);
          })}
        {data &&
          data.user_commands.map((row, index) => {
            return renderTransactionRow(row, index);
          })}
      </tbody>
    );
  }

  /**
   * If errors occur, render error screen
   * @returns HTMLElement
   */
  function renderError() {
    const { balance } = props;
    let imageToRender = ErrorImage;
    if (balance === 0) {
      imageToRender = NoTransactionsOrNotAvailableImage;
    } else if (balance > 0) {
      imageToRender = TxHistoryNotAvailableImage;
    }
    return (
      <div className="block-container-last">
        <div className="full-width padding-y-50">
          <img
            src={imageToRender}
            className="animate__animated animate__fadeIn"
          />
        </div>
      </div>
    );
  }

  /**
   * If transactions history is empty, render empty state
   * @returns HTMLElement
   */
  function renderEmptyState() {
    const { balance } = props;
    let imageToRender = NoTransactions;
    if (balance === 0) {
      imageToRender = NoTransactionsOrNotAvailableImage;
    } else if (balance > 0) {
      imageToRender = TxHistoryNotAvailableImage;
    }
    return (
      <div className="block-container-last">
        <div className="full-width padding-y-50">
          <img
            src={imageToRender}
            className="animate__animated animate__fadeIn"
          />
        </div>
      </div>
    );
  }

  /**
   * Get number of table pages
   * @returns Number
   */
  function getTotalPages() {
    if (total.data && total.data.user_commands_aggregate.aggregate) {
      const totalItems = total.data.user_commands_aggregate.aggregate.count;
      const pages = (totalItems / ITEMS_PER_PAGE).toFixed(0);
      return parseInt(pages) === 0 ? 1 : pages;
    }
    return 1;
  }

  return (
    <div className="block-container-last">
      <Spinner className={"full-width"} show={loading}>
        <Table className="animate__animated animate__fadeIn">
          <thead>{renderTableHeader()}</thead>
          {renderTableBody()}
        </Table>
        <Pagination
          page={props.page}
          setOffset={props.setOffset}
          user={props.user}
          total={getTotalPages()}
        />
      </Spinner>
    </div>
  );
}
