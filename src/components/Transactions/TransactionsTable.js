import React from "react";
import { Table } from "react-bootstrap";
import Spinner from "../General/Spinner";
import ErrorImage from "../../assets/Error.png";
import NoTransactionsOrNotAvailableImage from "../../assets/NoTransactionsOrNotAvailable.svg";
import TxHistoryNotAvailableImage from "../../assets/TxHistoryNotAvailable.svg";
import NoTransactions from "../../assets/NoTransactions.svg";
import { toMINA } from "../../tools/utils";
import { useQuery, gql } from "@apollo/client";
import Pagination from "../General/Pagination";
import { ChevronRight, ChevronsDown, ChevronsUp, Check} from "react-feather";
import ReactTooltip from "react-tooltip";
import {formatDistance} from "date-fns";
import {decodeB58} from "../../tools/base58";

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
  const { loading, error, data, mempool, userId, userAddress } = props;
  const total = useQuery(GET_TRANSACTIONS_TOTAL, {
    variables: { user: userId },
    skip: !userId,
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
        <th className="th-first-item"></th>
        <th>ID</th>
        <th>Date</th>
        <th>Sender</th>
        <th>Recipient</th>
        <th className="th-last-item">Amount</th>
      </tr>
    );
  }

  function renderTransactionOrDelegationIcon(txType,sender,receiver){
    if(txType === 'delegation'){
      return(<Check data-tip="Delegation TX" />)
    }else{
      if (receiver===sender) {
        return (<ChevronRight data-tip="Self transaction" />)
      } else if(userAddress===sender){
        return(<ChevronsUp data-tip="Outgoing TX" color="red"/>)
      } else if(userAddress===receiver){
        return(<ChevronsDown data-tip="Incoming TX" color="green"/>)
      } else {
        return(<ChevronRight />)
      }
    }
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
    const sender = row.publicKeyBySourceId.value;
    const receiver = row.publicKeyByReceiverId.value;
    const fee = "Fee : " +(row.fee ? toMINA(row.fee) : 0) + " Mina";
    const type = row.type;
    const timeDistance = formatDistance(timestamp, new Date(), {includeSeconds: true, addSuffix: true});
    const timeISOString = new Date(timestamp).toISOString();
    const isOutgoing =  userAddress === sender
    const isSelf =  receiver === sender
    const humanAmount = isOutgoing ? (isSelf || type === 'delegation') ? amount : `-${amount}` : `+${amount}`
    const amountColor = isOutgoing ? (isSelf || type === 'delegation') ? '' : 'red' : 'green';
    const memo = decodeB58(row.memo);

    return (
      <tr key={index}>
        <td className="table-element table-icon"> {renderTransactionOrDelegationIcon(type,sender,receiver)} </td>
        <td className="table-element table-hash" data-tip={memo ? `Memo: ${memo}` : null}>
          <a
            href={`https://devnet.minaexplorer.com/block/${state_hash}`}
            target="_blank"
            rel="noreferrer"
          >
            {row.hash}
          </a>
        </td>
        <td className="table-element" data-tip={timeISOString}>{timeDistance}</td>
        <td className="table-element">{sender === userAddress ? 'you' : sender}</td>
        <td className="table-element">{receiver === userAddress ? 'you' : receiver}</td>
        <td className="table-element" style={{color:amountColor}} data-tip={fee}>{humanAmount} Mina</td>
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
    const amount = row.amount ? toMINA(row.amount) : 0;
    const sender = row.source && row.source.publicKey
    const receiver = row.receiver && row.receiver.publicKey
    const isOutgoing =  userAddress === sender
    const isSelf =  receiver === sender
    const humanAmount = isOutgoing ? isSelf ? amount : `-${amount}` : `+${amount}`
    const amountColor = isOutgoing ? isSelf ? '' : 'red' : 'green';
    const fee = "Fee : " +(row.fee ? toMINA(row.fee) : 0) + " Mina";
    const memo = decodeB58(row.memo);

    return (
      <tr key={index}>
        <td className="table-element"> {renderTransactionOrDelegationIcon(row.amount,sender,receiver)} </td>
        <td className="table-element table-hash" data-tip={memo ? `Memo: ${memo}` : null}>
          <a
            href={`https://devnet.minaexplorer.com/transaction/${row.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {row.id}
          </a>
        </td>
        <td className="table-element">Waiting for confirmation</td>
        <td className="table-element">{sender === userAddress ? 'you' : sender}</td>
        <td className="table-element">{receiver === userAddress ? 'you' : receiver}</td>
        <td className="table-element" style={{color:amountColor}} data-tip={fee}>{humanAmount} Mina</td>
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
      <div className="block-container">
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
      <div className="block-container">
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
      let totalItems = total.data.user_commands_aggregate.aggregate.count;
      const pages = (totalItems / ITEMS_PER_PAGE).toFixed(0);
      if(totalItems%ITEMS_PER_PAGE < 5 && totalItems%ITEMS_PER_PAGE!==0){
        return parseInt(pages) === 0 ? 1 : parseInt(pages)+1;
      }
      return parseInt(pages) === 0 ? 1 : pages;
    }
    return 1;
  }

  return (
    <div className="block-container">
      <Spinner className={"full-width"} show={loading}>
        <ReactTooltip multiline={true} />
        <div id="transaction-table">
          <Table className="animate__animated animate__fadeIn"  id="rwd-table-large">
            <thead>{renderTableHeader()}</thead>
            {renderTableBody()}
          </Table>
        </div>
        <Pagination
          page={props.page}
          setOffset={props.setOffset}
          user={props.userId}
          total={getTotalPages()}
        />
      </Spinner>
    </div>
  );
}
