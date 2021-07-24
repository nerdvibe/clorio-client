import { formatDistance } from "date-fns";
import TransactionIcon from "./TransactionIcon";
import { ITransactionRowData } from "./TransactionsTypes";

const TransactionRow = (
  {
    timestamp,
    amount,
    sender,
    receiver,
    fee,
    memo,
    id,
    type,
  }: ITransactionRowData,
  index: number,
  userAddress: string,
  isMempool: boolean
) => {
  const timeDistance =
    !isMempool && timestamp
      ? formatDistance(timestamp, new Date(), {
          includeSeconds: true,
          addSuffix: true,
        })
      : "Waiting for confirmation";

  const timeISOString =
    !isMempool && timestamp ? new Date(timestamp).toISOString() : "";
  const isOutgoing = userAddress === sender;
  const isSelf = receiver === sender;
  const humanAmount = isOutgoing
    ? isSelf || type === "delegation"
      ? amount
      : `-${amount}`
    : `+${amount}`;
  const amountColor = isOutgoing
    ? isSelf || type === "delegation"
      ? ""
      : "red-text"
    : "green-text";

  const urlPath = isMempool ? "payment" : "transaction";

  return (
    <tr key={index}>
      <td className="table-element table-icon">
        {" "}
        {TransactionIcon(type, sender, receiver, userAddress)}{" "}
      </td>
      <td
        className="table-element table-hash"
        data-tip={memo ? `Memo: ${memo}` : null}
      >
        <a
          href={`${process.env.REACT_APP_EXPLORER_URL}/${urlPath}/${id}`}
          target="_blank"
          rel="noreferrer"
        >
          {id}
        </a>
      </td>
      <td className="table-element" data-tip={timeISOString}>
        {timeDistance}
      </td>
      <td className="table-element">
        {sender === userAddress ? "you" : sender}
      </td>
      <td className="table-element">
        {receiver === userAddress ? "you" : receiver}
      </td>
      <td className={`table-element ${amountColor}`} data-tip={fee}>
        {humanAmount} Mina
      </td>
    </tr>
  );
};

export default TransactionRow;
