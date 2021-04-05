import { MINIMUM_AMOUNT, MINIMUM_FEE, toMINA } from "../../../tools";
import { ITransactionData } from "../../../models/TransactionData";
import { toast } from "react-toastify";

/**
 * Check if all the mandatory fields inside the transaction data block are valid
 * @param transactionData
 * @param nextStep
 */
export const checkFieldsAndProceed = (
  transactionData: ITransactionData,
  nextStep: () => void,
) => {
  const { amount, fee, receiverAddress } = transactionData;
  if (amount < MINIMUM_AMOUNT || amount === 0) {
    const message = `Amount ${toMINA(
      amount,
    )} is less than the minimum amount (${toMINA(MINIMUM_AMOUNT)})`;
    return toast.error(message);
  }
  if (fee < MINIMUM_FEE) {
    const message = `Fee ${toMINA(fee)} is less than the minimum fee (${toMINA(
      MINIMUM_FEE,
    )})`;
    return toast.error(message);
  }
  if (receiverAddress === "") {
    return toast.error("Please insert a recipient");
  }
  nextStep();
};
