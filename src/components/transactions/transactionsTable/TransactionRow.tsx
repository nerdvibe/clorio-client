import { formatDistance } from "date-fns";
import { ITransactionData } from "./transactions";
import { toMINA } from "../../../tools";
import { decodeB58 } from "../../../tools/base58";
import TransactionOrDelegationIcon from "./TransactionDelegationIcon";

const TransactionRow = (row:ITransactionData, index:number, userAddress:string) => {
  const { timestamp } = row.blocks_user_commands[0].block;
  const amount = row.amount ? toMINA(row.amount) : 0;
  const sender = row.publicKeyBySourceId.value;
  const receiver = row.publicKeyByReceiverId.value;
  const fee = "Fee : " + (row.fee ? toMINA(row.fee) : 0) + " Mina";
  const type = row.type;
  const timeDistance = formatDistance(timestamp, new Date(), {
    includeSeconds: true,
    addSuffix: true,
  });
  const timeISOString = new Date(timestamp).toISOString();
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
      : "red"
    : "green";
  const memo = decodeB58(row.memo);

  return (
    <tr key={index}>
      <td className="table-element table-icon">
        {" "}
        {TransactionOrDelegationIcon(type, sender, receiver, userAddress)}{" "}
      </td>
      <td
        className="table-element table-hash"
        data-tip={memo ? `Memo: ${memo}` : null}
      >
        <a
          href={`${process.env.REACT_APP_EXPLORER_URL}/transaction/${row.hash}`}
          target="_blank"
          rel="noreferrer"
        >
          {row.hash}
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
      <td
        className="table-element"
        style={{ color: amountColor }}
        data-tip={fee}
      >
        {humanAmount} Mina
      </td>
    </tr>
  );
}

export default TransactionRow;
