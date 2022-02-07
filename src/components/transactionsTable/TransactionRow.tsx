import { formatDistance } from "date-fns";
import { sanitizeString } from "../../tools";
import { BlacklistedAddress } from "../../types/Blacklist";
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
  blacklist: BlacklistedAddress[],
  isMempool: boolean
) => {
  let senderScam = 0;
  const isScam = blacklist.reduce((previous, actual) => {
    if (actual.address === receiver) {
      senderScam = 1;
    }
    return previous || actual.address === sender || actual.address === receiver;
  }, false);
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
    <>
      <tr key={index} className={isScam ? "dangerous-transaction" : ""}>
        <td className="table-element table-icon">
          {" "}
          {TransactionIcon(type, sender, receiver, userAddress, isScam)}{" "}
        </td>
        <td
          className="table-element table-hash"
          data-tip={memo ? `Memo: ${sanitizeString(memo)}` : null}
        >
          <a
            href={`${process.env.REACT_APP_EXPLORER_URL}/${urlPath}/${id}`}
            target="_blank"
            rel="noreferrer"
            className="purple-text"
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
      {isScam && (
        <tr key={`scam-${index}`} className="scam-alert-row">
          <td colSpan={6}>
            Be aware! This{" "}
            <strong data-tip={senderScam ? receiver : sender}>
              {senderScam ? "receiver" : "sender"}
            </strong>{" "}
            has been reported as a scammer!
          </td>
        </tr>
      )}
    </>
  );
};

export default TransactionRow;
