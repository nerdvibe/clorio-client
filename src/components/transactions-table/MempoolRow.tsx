import { toMINA } from "../../tools";
import { decodeB58 } from "../../tools/base58";
import TransactionOrDelegationIcon from "./TransactionDelegationIcon";
import { IMempoolTransactionData } from "./transactions";

const MempoolRow = (row:IMempoolTransactionData, index:number, userAddress:string) => {
  const amount = row.amount ? toMINA(row.amount) : 0;
  const sender = row.source && row.source.publicKey;
  const receiver = row.receiver && row.receiver.publicKey;
  const isOutgoing = userAddress === sender;
  const isSelf = receiver === sender;
  const humanAmount = isOutgoing
    ? isSelf
      ? amount
      : `-${amount}`
    : `+${amount}`;
  const amountColor = isOutgoing ? (isSelf ? "" : "red") : "green";
  const fee = "Fee : " + (row.fee ? toMINA(row.fee) : 0) + " Mina";
  const memo = decodeB58(row.memo);

  return (
    <tr key={index}>
      <td className="table-element table-icon"> {TransactionOrDelegationIcon(row.amount,sender,receiver,userAddress)} </td>
      <td className="table-element table-hash" data-tip={memo ? `Memo: ${memo}` : null}>
        <a
          href={`${process.env.REACT_APP_EXPLORER_URL}/payment/${row.id}`}
          target="_blank"
          rel="noreferrer"
        >
          {row.id}
        </a>
      </td>
      <td className="table-element">Waiting for confirmation</td>
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

export default MempoolRow;
