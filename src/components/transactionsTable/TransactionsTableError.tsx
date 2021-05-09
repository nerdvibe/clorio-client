import ErrorImage from "./assets/error.png";
import NoTransactionsOrNotAvailableImage from "./assets/noTransactionsOrNotAvailable.svg";
import TxHistoryNotAvailableImage from "./assets/txHistoryNotAvailable.svg";
import NoTransactions from "./assets/noTransactions.svg";
import RefetchTransactions from "./RefetchTransactions";

const TransactionsTableError = (
  balance: number,
  hasErrors: boolean,
  refetchData: () => void
) => {
  let imageToRender = hasErrors ? ErrorImage : NoTransactions;
  if (balance === 0) {
    imageToRender = NoTransactionsOrNotAvailableImage;
  } else if (balance > 0) {
    imageToRender = TxHistoryNotAvailableImage;
  }
  return (
    <div className="block-container">
      <RefetchTransactions refetch={refetchData} />
      <div className="full-width padding-y-50">
        <img
          src={imageToRender}
          className="animate__animated animate__fadeIn"
        />
      </div>
    </div>
  );
};

export default TransactionsTableError;
