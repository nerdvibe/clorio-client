import Animation from "../UI/Animation";
import MissingAnimation from "./assets/missing.json";

const TransactionsTableError = (balance: number, hasErrors: boolean) => {
  let secondaryText = "";
  let text = hasErrors
    ? "Ooops... Something went wrong! Please try again later"
    : "You haven't made any transaction yet";
  if (balance === 0) {
    text =
      "You haven't made any transaction yet or the history might not be available for your address.";
  } else if (balance > 0) {
    text = "The history might not be available for your address at this time.";
    secondaryText = "Please consult your transaction history on the explorer.";
  }
  return (
    <div className="block-container">
      <div className="full-width padding-y-50">
        <div className="full-width-align-center">
          <Animation
            text={text}
            secondaryText={secondaryText}
            width="200px"
            animation={MissingAnimation}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsTableError;
